# HealthAI

HealthAI is an academic symptom-pattern demo with a React/Vite frontend, a FastAPI backend, a scikit-learn Bernoulli Naive Bayes classifier, SQLite assessment history, and Recharts visualizations. The symptom catalog and classifier use the supplied augmented symptom dataset in `server/data/disease-symptoms.zip`.

> **Important:** The classifier is trained on the supplied augmented dataset. Its provenance and data quality have not been independently verified, and it has not been clinically validated or calibrated for diagnosis. Scores are model outputs, not diagnostic probabilities; do not use this app for health decisions.

## Run locally (Windows)

1. Create the backend virtual environment if needed, then install requirements:

   ```powershell
   python -m venv server\.venv
   .\server\.venv\Scripts\python.exe -m pip install -r .\server\requirements.txt
   ```

2. Train and evaluate the model on the supplied dataset:

   ```powershell
   cd server
   .\.venv\Scripts\python.exe train_model.py
   ```

   The command reports holdout accuracy and macro F1 and writes the model artifact to `server\artifacts\symptom_classifier.joblib`. You can pass another compatible CSV or ZIP using `--dataset`.

3. Start the backend:

   ```powershell
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 5000
   ```

   Assessment history is stored in `server\healthai.sqlite3`. The API docs are available at `http://localhost:5000/docs`.
   Restart the backend after retraining so it reloads the newly saved model artifact.

4. In a separate terminal, start the frontend:

   ```powershell
   cd client
   npm install
   npm run dev
   ```

   The frontend uses `VITE_API_BASE_URL` from `client\.env`; the default is `http://localhost:5000/api`.

## API

- `GET /api/health` — backend/model status
- `GET /api/symptoms` — symptom catalog derived from the dataset
- `POST /api/predictions` — model scores for selected symptom IDs; also saves the assessment
- `GET /api/predictions/history` — saved assessments
- `DELETE /api/predictions/history/{id}` — delete one assessment
- `DELETE /api/predictions/history` — delete all assessments

The notebook references separate `Training.csv` and `Testing.csv` files, but the supplied ZIP contains a different single CSV: 246,945 rows, 377 binary symptom columns, and 773 disease labels. The training script uses a stratified holdout split, reports metrics, and then fits the saved model on the full supplied dataset. Scores should not be interpreted as diagnosis or clinical confidence.
