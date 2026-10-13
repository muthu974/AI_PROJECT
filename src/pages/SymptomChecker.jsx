import { useState, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  X,
  Loader2,
  AlertTriangle,
  Thermometer,
  Wind,
  Brain,
  Apple,
  Bone,
  Fingerprint,
  Heart,
} from 'lucide-react';
import { symptomCategories, allSymptoms } from '../data/symptoms';
import { analyzeSymptoms } from '../services/predictionService';
import ResultsView from '../components/ResultsView';

const iconMap = {
  Thermometer,
  Wind,
  Brain,
  Apple,
  Bone,
  Fingerprint,
  Heart,
};

export default function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allSymptoms.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  function toggleSymptom(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function removeSymptom(id) {
    setSelected((prev) => prev.filter((s) => s !== id));
  }

  async function handleAnalyze() {
    if (selected.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSymptoms(selected);
      setResults(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSelected([]);
    setResults(null);
    setError(null);
    setSearchQuery('');
    setActiveCategory(null);
  }

  // Show results screen
  if (results) {
    return (
      <ResultsView
        results={results}
        selectedSymptoms={selected}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Symptom Checker</h1>
        <p className="text-navy-500 mt-2">
          Select all symptoms you are experiencing, then analyze.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="mb-8 max-w-lg mx-auto bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden">
          {filteredSymptoms.length === 0 ? (
            <p className="px-4 py-3 text-sm text-navy-400">No symptoms found.</p>
          ) : (
            <ul className="divide-y divide-navy-50 max-h-60 overflow-y-auto">
              {filteredSymptoms.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => toggleSymptom(s.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      selected.includes(s.id)
                        ? 'bg-teal-50 text-teal-700'
                        : 'hover:bg-navy-50 text-navy-700'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-xs text-navy-400">{s.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Categories */}
      {!searchQuery.trim() && (
        <div className="space-y-3 mb-8">
          {symptomCategories.map((cat) => {
            const CatIcon = iconMap[cat.icon] || Thermometer;
            const isOpen = activeCategory === cat.name;
            const selectedCount = cat.symptoms.filter((s) =>
              selected.includes(s.id)
            ).length;

            return (
              <div
                key={cat.name}
                className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() =>
                    setActiveCategory(isOpen ? null : cat.name)
                  }
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-navy-50/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center flex-shrink-0">
                    <CatIcon className="w-5 h-5 text-navy-600" />
                  </div>
                  <span className="font-semibold text-navy-800 flex-1 text-left">
                    {cat.name}
                  </span>
                  {selectedCount > 0 && (
                    <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {selectedCount}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-5 h-5 text-navy-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-in">
                    {cat.symptoms.map((s) => {
                      const isSelected = selected.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleSymptom(s.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                            isSelected
                              ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                              : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'border-white bg-white/20'
                                : 'border-navy-300'
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Selected pills + Analyze button */}
      {selected.length > 0 && (
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-navy-100 -mx-4 px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
                Selected ({selected.length}):
              </span>
              {selected.map((id) => {
                const s = allSymptoms.find((sym) => sym.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full border border-teal-200"
                  >
                    {s?.label || id}
                    <button
                      onClick={() => removeSymptom(id)}
                      className="hover:text-teal-900 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 mb-3">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-navy-600 bg-navy-100 hover:bg-navy-200 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  'Analyze Symptoms'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
