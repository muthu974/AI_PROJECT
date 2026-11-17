"""Train and save the classifier using the supplied symptom dataset."""

import argparse

from app.model import DATASET_PATH, MODEL_PATH, save_model, train_model

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument(
    "--dataset",
    default=str(DATASET_PATH),
    help="CSV or ZIP containing the disease/symptom dataset",
)
args = parser.parse_args()

bundle = train_model(args.dataset)
save_model(bundle)

print(f"Dataset: {bundle['dataset_name']}")
print(f"Training rows: {bundle['training_rows']}")
print(f"Disease classes: {bundle['training_classes']}")
print(f"Holdout rows: {bundle['metrics']['validation_rows']}")
print(f"Holdout accuracy: {bundle['metrics']['accuracy']:.4f}")
print(f"Holdout macro F1: {bundle['metrics']['macro_f1']:.4f}")
print(f"Model saved to: {MODEL_PATH}")
