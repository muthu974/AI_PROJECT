from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .database import (
    clear_assessments,
    delete_assessment,
    initialize_database,
    list_assessments,
    save_assessment,
)
from .model import load_model, predict


@asynccontextmanager
async def lifespan(_app: FastAPI):
    initialize_database()
    load_model()
    yield


app = FastAPI(
    title="HealthAI Educational API",
    description=(
        "An educational demonstration API trained on the supplied augmented "
        "dataset. It is not clinically validated and must not be used for diagnosis."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type"],
)


class PredictionRequest(BaseModel):
    symptoms: list[str] = Field(min_length=1, max_length=50)


@app.get("/api/health")
def health():
    bundle = load_model()
    return {
        "status": "ok",
        "model": "scikit-learn Bernoulli Naive Bayes classifier",
        "dataset": bundle["dataset_name"],
        "training_rows": bundle["training_rows"],
        "training_classes": bundle["training_classes"],
        "validation": bundle["metrics"],
    }


@app.get("/api/symptoms")
def get_symptoms():
    return load_model()["symptoms"]


@app.post("/api/predictions")
def create_prediction(request: PredictionRequest):
    bundle = load_model()
    known_symptoms = {symptom["id"] for symptom in bundle["symptoms"]}
    unknown_symptoms = sorted(set(request.symptoms) - known_symptoms)
    if unknown_symptoms:
        raise HTTPException(
            status_code=422,
            detail={"message": "Unknown symptom IDs", "symptoms": unknown_symptoms},
        )

    symptoms = list(dict.fromkeys(request.symptoms))
    predictions = predict(symptoms, bundle)
    assessment = save_assessment(symptoms, predictions)

    return {
        "mode": "dataset-ml",
        "predictions": predictions,
        "guidance": [
            "This model was trained on an augmented symptom dataset; its data provenance and quality have not been independently verified.",
            "Scores are model outputs, not calibrated diagnostic probabilities.",
            "Do not use these results to make health or treatment decisions.",
            "Consult a qualified healthcare professional about symptoms or concerns.",
        ],
        "model_notice": (
            "This classifier was trained on the supplied augmented dataset and has "
            "not been clinically validated. Results are not a diagnosis."
        ),
        "timestamp": assessment["date"],
        "assessment_id": assessment["id"],
    }


@app.get("/api/predictions/history")
def get_history():
    return list_assessments()


@app.delete("/api/predictions/history")
def delete_history():
    clear_assessments()
    return {"deleted": True}


@app.delete("/api/predictions/history/{assessment_id}")
def delete_history_entry(assessment_id: str):
    if not delete_assessment(assessment_id):
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"deleted": True}
