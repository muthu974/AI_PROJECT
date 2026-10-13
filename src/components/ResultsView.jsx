import {
  ArrowLeft,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import { allSymptoms } from '../data/symptoms';
import { formatScore, getScoreColor, getScoreTextColor } from '../utils/helpers';

export default function ResultsView({ results, selectedSymptoms, onReset }) {
  const { predictions = [], guidance = [], mode } = results;
  const isDemo = mode === 'demo';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        New Assessment
      </button>

      {/* Demo badge */}
      {isDemo && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-3.5 mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-orange-700">
            <strong>Demo Mode:</strong> The ML backend is unavailable. These are
            illustrative results for demonstration purposes only — they are NOT
            real medical predictions.
          </div>
        </div>
      )}

      {/* Selected symptoms recap */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-2">
          Analyzed Symptoms
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {selectedSymptoms.map((id) => {
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

      {/* Prediction cards */}
      <h2 className="text-2xl font-bold text-navy-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-teal-600" />
        Results
      </h2>

      <div className="space-y-4 stagger-children mb-8">
        {predictions.map((pred, idx) => (
          <div
            key={pred.condition}
            className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 p-5">
              {/* Rank */}
              <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                #{idx + 1}
              </div>
              {/* Condition name + score */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-navy-900 truncate">
                  {pred.condition}
                </h3>
                <div className="flex items-center gap-3 mt-1.5">
                  {/* Score bar */}
                  <div className="flex-1 h-2 bg-navy-100 rounded-full overflow-hidden max-w-[200px]">
                    <div
                      className={`h-full rounded-full ${getScoreColor(pred.score)} transition-all duration-500`}
                      style={{ width: `${Math.round(pred.score * 100)}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-bold ${getScoreTextColor(pred.score)}`}
                  >
                    {formatScore(pred.score)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description + Precautions */}
            {(pred.description || pred.precautions) && (
              <div className="border-t border-navy-50 px-5 py-4 space-y-3">
                {pred.description && (
                  <p className="text-sm text-navy-600 leading-relaxed">
                    {pred.description}
                  </p>
                )}
                {pred.precautions?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
                      Recommended Precautions
                    </h4>
                    <ul className="space-y-1">
                      {pred.precautions.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-navy-600"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* General guidance */}
      {guidance.length > 0 && (
        <div className="bg-navy-50 rounded-2xl p-5 mb-8">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-800 mb-3">
            <Info className="w-4 h-4 text-navy-500" />
            General Guidance
          </h3>
          <ul className="space-y-2">
            {guidance.map((g, i) => (
              <li key={i} className="text-sm text-navy-600 flex items-start gap-2">
                <span className="text-navy-400 mt-1">•</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medical disclaimer */}
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
        <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-700">
          <strong>Important:</strong> This tool is an academic prototype and
          does not provide medical diagnoses. If you are experiencing
          concerning symptoms, please consult a qualified healthcare
          professional immediately.
        </div>
      </div>
    </div>
  );
}
