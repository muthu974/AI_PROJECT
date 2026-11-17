import { useState, useCallback, useEffect } from 'react';
import {
  clearHistory as clearRemoteHistory,
  deleteHistoryEntry,
  fetchHistory,
} from '../services/api';

export function useAssessmentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchHistory()
      .then((entries) => {
        if (active) {
          setHistory(entries);
          setError('');
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Could not load assessment history.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await clearRemoteHistory();
      setHistory([]);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not clear assessment history.');
    }
  }, []);

  const deleteEntry = useCallback(async (id) => {
    try {
      await deleteHistoryEntry(id);
      setHistory((prev) => prev.filter((entry) => entry.id !== id));
      setError('');
    } catch (err) {
      setError(err.message || 'Could not delete the assessment.');
    }
  }, []);

  return { history, loading, error, clearHistory: clearAll, deleteEntry };
}
