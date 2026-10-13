/**
 * Custom hook for managing assessment history.
 * Stores demo assessments in localStorage with clear labeling.
 */
import { useState, useCallback } from 'react';
import { generateId } from '../utils/helpers';

const STORAGE_KEY = 'healthai_demo_history';

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    console.warn('Could not save assessment history to localStorage.');
  }
}

export function useAssessmentHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addAssessment = useCallback((symptoms, result) => {
    const entry = {
      id: generateId(),
      date: new Date().toISOString(),
      symptoms,
      topPrediction: result.predictions?.[0]?.condition || 'Unknown',
      topScore: result.predictions?.[0]?.score || 0,
      mode: result.mode,
      predictions: result.predictions?.map((p) => ({
        condition: p.condition,
        score: p.score,
      })),
    };
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 50); // Keep last 50
      saveHistory(updated);
      return updated;
    });
    return entry;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const deleteEntry = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  return { history, addAssessment, clearHistory, deleteEntry };
}
