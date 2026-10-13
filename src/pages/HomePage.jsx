import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Shield,
  Brain,
  ArrowRight,
  Sparkles,
  Clock,
  BookOpen,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Advanced machine learning models analyze your symptoms for potential conditions.',
    color: 'from-teal-400 to-teal-600',
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    desc: 'Your health data stays on your device. No data is stored on external servers.',
    color: 'from-navy-400 to-navy-600',
  },
  {
    icon: Clock,
    title: 'Instant Results',
    desc: 'Get preliminary health insights in seconds, not hours or days.',
    color: 'from-orange-400 to-orange-600',
  },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 -left-20 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Academic Health Assessment Prototype
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 leading-tight tracking-tight">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
              Intelligently
            </span>{' '}
            Analyzed
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-navy-500 max-w-2xl mx-auto leading-relaxed">
            Describe your symptoms and receive AI-powered preliminary health
            insights. Built as an academic prototype to explore ML-driven
            healthcare solutions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/check"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Stethoscope className="w-5 h-5" />
              Start Assessment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/health-tips"
              className="inline-flex items-center gap-2 bg-white text-navy-700 px-8 py-3.5 rounded-xl font-semibold border border-navy-200 hover:bg-navy-50 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              <BookOpen className="w-5 h-5" />
              Health Tips
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 max-w-xl mx-auto bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 text-sm text-orange-700">
            <strong>Disclaimer:</strong> This is an educational prototype.
            Results are not medical advice. Always consult a healthcare
            professional.
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-white rounded-2xl p-6 border border-navy-100 hover:border-teal-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-md`}
              >
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-2">{f.title}</h3>
              <p className="text-navy-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8 stagger-children">
            {[
              { step: '1', title: 'Select Symptoms', desc: 'Choose from categorized symptoms or search by name.' },
              { step: '2', title: 'AI Analysis', desc: 'Our ML model evaluates patterns across your selected symptoms.' },
              { step: '3', title: 'Get Insights', desc: 'View potential conditions, confidence scores, and health guidance.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-navy-300 text-sm leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
