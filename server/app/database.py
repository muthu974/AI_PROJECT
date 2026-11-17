import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(
    os.environ.get(
        "HEALTHAI_DB_PATH",
        str(Path(__file__).resolve().parents[1] / "healthai.sqlite3"),
    )
)


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS assessments (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                symptoms TEXT NOT NULL,
                predictions TEXT NOT NULL,
                mode TEXT NOT NULL
            )
            """
        )


def save_assessment(symptoms, predictions):
    entry = {
        "id": str(uuid.uuid4()),
        "date": datetime.now(timezone.utc).isoformat(),
        "symptoms": symptoms,
        "predictions": predictions,
        "topPrediction": predictions[0]["condition"],
        "topScore": predictions[0]["score"],
        "mode": "dataset-ml",
    }
    with connect() as connection:
        connection.execute(
            """
            INSERT INTO assessments (id, created_at, symptoms, predictions, mode)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                entry["id"],
                entry["date"],
                json.dumps(symptoms),
                json.dumps(predictions),
                entry["mode"],
            ),
        )
    return entry


def list_assessments():
    with connect() as connection:
        rows = connection.execute(
            "SELECT id, created_at, symptoms, predictions, mode "
            "FROM assessments ORDER BY created_at DESC"
        ).fetchall()
    return [
        {
            "id": row["id"],
            "date": row["created_at"],
            "symptoms": json.loads(row["symptoms"]),
            "predictions": json.loads(row["predictions"]),
            "topPrediction": json.loads(row["predictions"])[0]["condition"],
            "topScore": json.loads(row["predictions"])[0]["score"],
            "mode": row["mode"],
        }
        for row in rows
    ]


def delete_assessment(assessment_id):
    with connect() as connection:
        cursor = connection.execute(
            "DELETE FROM assessments WHERE id = ?", (assessment_id,)
        )
    return cursor.rowcount > 0


def clear_assessments():
    with connect() as connection:
        connection.execute("DELETE FROM assessments")
