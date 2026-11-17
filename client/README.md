# HealthAI frontend

The React/Vite client is in this directory. For full project setup, including the FastAPI backend and model training, see the repository-root [README](../README.md).

## Run locally

From this directory:

```powershell
npm install
npm run dev
```

The API base URL defaults to `http://localhost:5000/api`. Set `VITE_API_BASE_URL` in a local `.env` file to override it.

Run `npm run lint` and `npm run build` to validate the client.
