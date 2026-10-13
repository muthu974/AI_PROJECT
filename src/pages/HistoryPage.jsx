import { Clock, Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAssessmentHistory } from '../hooks/useAssessmentHistory';
import { demoHistoryEntries } from '../data/demoData';
import { allSymptoms } from '../data/symptoms';
import { formatDate, formatScore, getScoreTextColor } from '../utils/helpers';

export default function HistoryPage() {
  const { history, clearHistory, deleteEntry } = useAssessmentHistory();
  const [expandedId, setExpandedId] = useState(null);

  // Merge real history with demo entries if history is empty
  const displayHistory = history.length > 0 ? history : demoHistoryEntries;
  const isDemo = history.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Assessment History</h1>
          <p className="text-navy-500 mt-1">Review your past symptom assessments.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {isDemo && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-3.5 mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-700">
            No assessments yet. Showing demo entries for illustration. Complete
            an assessment to see your real history here.
          </p>
        </div>
      )}

      {displayHistory.length === 0 ? (
        <div className="text-center py-20">
          <Clock className="w-12 h-12 text-navy-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-navy-700 mb-1">
            No History Yet
          </h3>
          <p className="text-navy-400 text-sm">
            Your completed assessments will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {displayHistory.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-navy-50/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-navy-900 truncate">
                        {entry.topPrediction}
                      </span>
                      <span
                        className={`text-xs font-bold ${getScoreTextColor(entry.topScore)}`}
                      >
                        {formatScore(entry.topScore)}
                      </span>
                      {entry.mode === 'demo' && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                          Demo
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-navy-400">
                      {formatDate(entry.date)} · {entry.symptoms.length} symptoms
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-navy-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-navy-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-navy-50 px-5 py-4 animate-fade-in">
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
                        Symptoms
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.symptoms.map((id) => {
                          const s = allSymptoms.find((sym) => sym.id === id);
                          return (
                            <span
                              key={id}
                              className="bg-navy-100 text-navy-700 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {s?.label || id}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {entry.predictions?.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
                          All Predictions
                        </h4>
                        <div className="space-y-1.5">
                          {entry.predictions.map((p) => (
                            <div
                              key={p.condition}
                              className="flex items-center gap-3"
                            >
                              <span className="text-sm text-navy-700 flex-1 truncate">
                                {p.condition}
                              </span>
                              <div className="w-24 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-teal-500 rounded-full"
                                  style={{
                                    width: `${Math.round(p.score * 100)}%`,
                                  }}
                                />
                              </div>
                              <span
                                className={`text-xs font-bold w-10 text-right ${getScoreTextColor(p.score)}`}
                              >
                                {formatScore(p.score)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isDemo && (
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors mt-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
