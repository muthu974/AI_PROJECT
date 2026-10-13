/**
 * Prediction service — orchestrates prediction requests.
 * Tries the real API first; falls back to demo mode if unavailable.
 */
import { submitPrediction, checkApiHealth } from './api';
import { getDemoPredictions } from '../data/demoData';

/**
 * Analyze symptoms — attempts real API, falls back to demo.
 * @param {string[]} symptomIds - Selected symptom IDs
 * @returns {Promise<object>} Prediction result with mode indicator
 */
export async function analyzeSymptoms(symptomIds) {
  // Try the real ML backend first
  const isApiAvailable = await checkApiHealth();

  if (isApiAvailable) {
    try {
      const result = await submitPrediction(symptomIds);
      return { ...result, mode: result.mode || 'ml' };
    } catch (error) {
      console.warn('API prediction failed, falling back to demo mode:', error.message);
    }
  }

  // Fall back to demo mode — explicitly labeled
  // Simulate a brief processing delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return getDemoPredictions(symptomIds);
}
