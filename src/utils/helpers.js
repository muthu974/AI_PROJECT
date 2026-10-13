/**
 * Utility functions for HealthAI.
 */

/**
 * Format a date string for display.
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get a symptom label from its ID.
 * @param {string} id - Symptom ID
 * @param {object[]} allSymptoms - Array of symptom objects
 * @returns {string} Human-readable label
 */
export function getSymptomLabel(id, allSymptoms) {
  const symptom = allSymptoms.find((s) => s.id === id);
  return symptom ? symptom.label : id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Format a score as a percentage string.
 * @param {number} score - Score between 0 and 1
 * @returns {string} Percentage string
 */
export function formatScore(score) {
  return `${Math.round(score * 100)}%`;
}

/**
 * Generate a unique ID.
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get score color class based on value.
 * @param {number} score - 0 to 1
 * @returns {string} Tailwind color class
 */
export function getScoreColor(score) {
  if (score >= 0.7) return 'bg-teal-500';
  if (score >= 0.4) return 'bg-orange-400';
  return 'bg-navy-300';
}

/**
 * Get score text color class based on value.
 * @param {number} score - 0 to 1
 * @returns {string} Tailwind text color class
 */
export function getScoreTextColor(score) {
  if (score >= 0.7) return 'text-teal-700';
  if (score >= 0.4) return 'text-orange-600';
  return 'text-navy-500';
}
