import { submitPrediction } from './api';

/**
 * Analyze symptoms using the configured backend.
 * @param {string[]} symptomIds - Selected symptom IDs
 * @returns {Promise<object>} Prediction result
 */
export async function analyzeSymptoms(symptomIds) {
  return submitPrediction(symptomIds);
}
