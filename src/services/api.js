/**
 * API service module for HealthAI.
 * Handles all communication with the backend REST API.
 * Falls back gracefully when the backend is unavailable.
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Check if the API server is reachable.
 * @returns {Promise<boolean>}
 */
export async function checkApiHealth() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch {
    return false;
  }
}

/**
 * Submit symptoms for prediction.
 * @param {string[]} symptoms - Array of symptom IDs
 * @returns {Promise<object>} Prediction results
 * @throws {Error} If the API request fails
 */
export async function submitPrediction(symptoms) {
  const response = await apiClient.post('/predictions', { symptoms });
  return response.data;
}

/**
 * Fetch assessment history from the backend.
 * @returns {Promise<object[]>} Array of assessment records
 * @throws {Error} If the API request fails
 */
export async function fetchHistory() {
  const response = await apiClient.get('/predictions/history');
  return response.data;
}

export default apiClient;
