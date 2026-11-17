"""Training and inference for the supplied augmented symptom dataset."""

import os
import re
import zipfile
from functools import lru_cache
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import BernoulliNB

MODEL_PATH = Path(
    os.environ.get(
        "HEALTHAI_MODEL_PATH",
        str(Path(__file__).resolve().parents[1] / "artifacts" / "symptom_classifier.joblib"),
    )
)
DATASET_PATH = Path(
    os.environ.get(
        "HEALTHAI_DATASET_PATH",
        str(Path(__file__).resolve().parents[1] / "data" / "disease-symptoms.zip"),
    )
)
TARGET_COLUMN = "diseases"

_CATEGORY_KEYWORDS = {
    "Mental Health": (
        "anxiety", "depression", "psychotic", "insomnia", "emotional", "behavior",
        "stress", "suicid", "alcohol", "drug abuse", "panic", "nervous", "hallucin",
        "obsess", "compuls", "memory",
    ),
    "Respiratory": (
        "breath", "cough", "sputum", "lung", "nose", "nasal", "sneeze", "sinus",
        "throat", "voice", "congestion", "wheez",
    ),
    "Cardiovascular": (
        "heart", "chest pain", "palpitation", "blood pressure", "pulse", "heartbeat",
    ),
    "Digestive": (
        "abdominal", "stomach", "nausea", "vomit", "diarr", "constipat", "bowel",
        "stool", "appetite", "swallow", "reflux", "indigest", "liver", "jaundice",
        "rectal", "flatulence", "belly", "anus",
    ),
    "Urinary & Reproductive": (
        "urine", "urination", "urinary", "vaginal", "sexual", "testicle", "scrotum",
        "menstrual", "pregnan", "penis", "uter", "ovary", "pelvic", "discharge",
    ),
    "Skin": (
        "skin", "rash", "itch", "hair", "nail", "bruis", "sweat", "lesion", "discolor",
    ),
    "Musculoskeletal": (
        "pain", "joint", "muscle", "bone", "back", "neck", "leg", "arm", "stiff",
        "limb", "wrist", "ankle", "hip", "elbow", "foot", "hand", "knee", "shoulder",
    ),
    "Neurological": (
        "head", "dizz", "confus", "numb", "vision", "light", "hearing", "seiz",
        "tremor", "speech", "tingl", "movement", "weakness", "faint", "balance",
        "paralys", "coordination",
    ),
}


def _symptom_id(feature_name):
    return re.sub(r"[^a-z0-9]+", "_", feature_name.lower()).strip("_")


def _category_for(feature_name):
    normalized = feature_name.lower()
    for category, keywords in _CATEGORY_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords):
            return category
    return "General"


def _read_dataset(dataset_path):
    path = Path(dataset_path)
    if not path.is_file():
        raise FileNotFoundError(
            f"Dataset not found at {path}. Set HEALTHAI_DATASET_PATH or provide the "
            "disease-symptoms.zip file in server/data."
        )

    if zipfile.is_zipfile(path):
        with zipfile.ZipFile(path) as archive:
            csv_files = [name for name in archive.namelist() if name.lower().endswith(".csv")]
            if len(csv_files) != 1:
                raise ValueError(
                    f"Expected exactly one CSV in {path}, found {len(csv_files)}."
                )
            with archive.open(csv_files[0]) as source:
                frame = pd.read_csv(source)
    else:
        frame = pd.read_csv(path)

    frame = frame.loc[:, ~frame.columns.astype(str).str.match(r"^Unnamed:")]
    if TARGET_COLUMN not in frame.columns:
        raise ValueError(f"Dataset must contain a '{TARGET_COLUMN}' target column.")

    feature_names = [str(column) for column in frame.columns if column != TARGET_COLUMN]
    if not feature_names:
        raise ValueError("Dataset contains no symptom features.")
    if frame[TARGET_COLUMN].isna().any():
        raise ValueError("Dataset contains rows with an empty disease label.")

    slug_ids = [_symptom_id(name) for name in feature_names]
    if any(not symptom_id for symptom_id in slug_ids) or len(set(slug_ids)) != len(slug_ids):
        raise ValueError("Symptom column names must produce unique non-empty IDs.")

    features = frame[feature_names].apply(pd.to_numeric, errors="raise")
    values = features.to_numpy(dtype=np.float32)
    if not np.isfinite(values).all() or not np.isin(values, [0, 1]).all():
        raise ValueError("Symptom features must contain only binary 0/1 values.")

    labels = frame[TARGET_COLUMN].astype(str)
    return csr_matrix(values), labels, feature_names


def _fit_classifier(features, labels):
    classifier = BernoulliNB(alpha=0.1, fit_prior=False)
    classifier.fit(features, labels)
    return classifier


def _evaluate(classifier, features, labels):
    predictions = classifier.predict(features)
    return {
        "accuracy": float(accuracy_score(labels, predictions)),
        "macro_f1": float(f1_score(labels, predictions, average="macro", zero_division=0)),
        "validation_rows": int(len(labels)),
    }


def train_model(dataset_path=DATASET_PATH):
    """Train, evaluate on a held-out split, then fit the final model on all rows."""
    features, labels, feature_names = _read_dataset(dataset_path)
    label_counts = labels.value_counts()
    common_mask = labels.map(label_counts) >= 2
    common_indices = np.flatnonzero(common_mask.to_numpy())
    rare_indices = np.flatnonzero(~common_mask.to_numpy())

    train_common, validation_indices = train_test_split(
        common_indices,
        test_size=0.2,
        random_state=42,
        stratify=labels.iloc[common_indices],
    )
    training_indices = np.concatenate((train_common, rare_indices))
    validation_model = _fit_classifier(
        features[training_indices],
        labels.iloc[training_indices],
    )
    metrics = _evaluate(
        validation_model,
        features[validation_indices],
        labels.iloc[validation_indices],
    )

    classifier = _fit_classifier(features, labels)
    symptoms = [
        {
            "id": _symptom_id(name),
            "label": name,
            "category": _category_for(name),
        }
        for name in feature_names
    ]
    return {
        "classifier": classifier,
        "features": feature_names,
        "symptoms": symptoms,
        "classes": [str(label) for label in classifier.classes_],
        "metrics": metrics,
        "training_rows": int(len(labels)),
        "training_classes": int(labels.nunique()),
        "dataset_name": Path(dataset_path).name,
    }


def save_model(bundle):
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, MODEL_PATH, compress=3)
    return MODEL_PATH


@lru_cache(maxsize=1)
def load_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    bundle = train_model()
    save_model(bundle)
    return bundle


def predict(symptom_ids, bundle):
    feature_ids = [_symptom_id(name) for name in bundle["features"]]
    selected = set(symptom_ids)
    features = csr_matrix(
        [[int(symptom_id in selected) for symptom_id in feature_ids]],
        dtype=np.uint8,
    )
    scores = bundle["classifier"].predict_proba(features)[0]
    ranked = sorted(
        zip(bundle["classes"], scores),
        key=lambda item: item[1],
        reverse=True,
    )

    return [
        {
            "condition": condition,
            "score": round(float(score), 6),
            "description": (
                "The model matched this label using the supplied dataset. "
                "This output is not a diagnosis."
            ),
            "precautions": [],
        }
        for condition, score in ranked[:5]
    ]
