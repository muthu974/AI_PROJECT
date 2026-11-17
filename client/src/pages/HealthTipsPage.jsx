import { useState } from 'react';
import {
  Droplets,
  Moon,
  Shield,
  Apple,
  Activity,
  Brain,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { healthArticles } from '../data/healthContent';

const iconMap = {
  Droplets,
  Moon,
  Shield,
  Apple,
  Activity,
  Brain,
  Stethoscope,
};

const categoryColors = {
  Wellness: 'from-blue-400 to-blue-600',
  Rest: 'from-indigo-400 to-indigo-600',
  Hygiene: 'from-teal-400 to-teal-600',
  Nutrition: 'from-green-400 to-green-600',
  Fitness: 'from-orange-400 to-orange-600',
  'Mental Health': 'from-purple-400 to-purple-600',
  'Medical Guidance': 'from-red-400 to-red-600',
};

export default function HealthTipsPage() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-navy-900">Health & Wellness Tips</h1>
        <p className="text-navy-500 mt-2">
          General wellness education to support healthy habits.
        </p>
      </div>

      <div className="space-y-4 stagger-children">
        {healthArticles.map((article) => {
          const Icon = iconMap[article.icon] || Activity;
          const isExpanded = expandedId === article.id;
          const gradient = categoryColors[article.category] || 'from-navy-400 to-navy-600';

          return (
            <div
              key={article.id}
              className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
                className="w-full flex items-center gap-4 px-5 py-5 text-left hover:bg-navy-50/30 transition-colors"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-navy-900 truncate">
                    {article.title}
                  </h3>
                  <p className="text-sm text-navy-500 mt-0.5 truncate">
                    {article.summary}
                  </p>
                </div>
                <span className="hidden sm:block text-xs font-semibold text-navy-400 uppercase tracking-wide bg-navy-50 px-2 py-1 rounded mr-2">
                  {article.category}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-navy-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-navy-400 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-navy-50 px-5 py-5 animate-fade-in">
                  <ul className="space-y-3">
                    {article.content.map((paragraph, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-navy-600 leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                        {paragraph}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 text-center text-xs text-navy-400">
        This content is for general wellness education only and does not
        constitute medical advice.
      </div>
    </div>
  );
}
