import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Factory,
  Users,
  MapPin,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const INDUSTRIES = [
  { id: 'Manufacturing', label: 'Manufacturing', icon: '🏭' },
  { id: 'Retail', label: 'Retail & E-commerce', icon: '🛍️' },
  { id: 'Restaurant', label: 'Restaurant / Food Service', icon: '🍽️' },
  { id: 'Technology', label: 'Technology / SaaS', icon: '💻' },
  { id: 'Logistics', label: 'Logistics & Distribution', icon: '🚚' },
  { id: 'Hospitality', label: 'Hospitality & Tourism', icon: '🏨' },
  { id: 'Professional Services', label: 'Professional Services', icon: '💼' },
  { id: 'Other', label: 'Other SME Sector', icon: '🌱' },
];

const SIZES = [
  { id: 8, label: '1–10 employees', desc: 'Micro business / studio' },
  { id: 42, label: '11–50 employees', desc: 'Small enterprise (GreenBrew benchmark)' },
  { id: 150, label: '51–250 employees', desc: 'Mid-sized operations' },
  { id: 450, label: '250+ employees', desc: 'Scaling enterprise' },
];

const GOALS = [
  { id: 'understand', title: 'Understand my footprint', desc: 'Establish an initial baseline and identify key emissions hotspots.' },
  { id: 'reduce', title: 'Reduce emissions & costs', desc: 'Identify energy waste and operational efficiencies with ROI.' },
  { id: 'supplier', title: 'Prepare supplier disclosure', desc: 'Respond to Tier-1 enterprise customers requesting carbon data.' },
  { id: 'reporting', title: 'Voluntary ESG & sustainability reporting', desc: 'Publish transparent stakeholders and board summaries.' },
  { id: 'track', title: 'Track yearly decarbonization progress', desc: 'Measure progress against science-aligned reduction targets.' },
];

export const OnboardingWizard: React.FC = () => {
  const { business, completeOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(business.name || 'GreenBrew Foods Pvt. Ltd.');
  const [industry, setIndustry] = useState(business.industry || 'Food & Beverage');
  const [employees, setEmployees] = useState(business.employees || 42);
  const [country, setCountry] = useState(business.country || 'India');
  const [city, setCity] = useState(business.city || 'Bengaluru');
  const [goal, setGoal] = useState(business.carbonGoal || 'Reduce emissions & costs');
  const [targetPct, setTargetPct] = useState(business.targetReductionPct || 30);
  const [targetYear, setTargetYear] = useState(business.targetYear || 2028);

  const handleFinish = () => {
    completeOnboarding({
      name,
      industry,
      employees,
      country,
      city,
      carbonGoal: goal,
      targetReductionPct: targetPct,
      targetYear,
      reportingYear: 2026,
      baselineYear: 2024,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-700 text-white shadow-md mb-4">
            <span className="text-2xl font-bold tracking-tight">C</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Set up your CarbonLens workspace</h2>
          <p className="mt-1 text-sm text-slate-500">
            Configure your business profile to calibrate emission factors and baseline models.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Step {step} of 5</span>
            <span className="text-emerald-700 font-medium">
              {step === 1 && 'Business Identity'}
              {step === 2 && 'Industry Classification'}
              {step === 3 && 'Team Size'}
              {step === 4 && 'Operating Region'}
              {step === 5 && 'Decarbonization Goal'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Card Container */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          {/* STEP 1: Business Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">What is your business legal or trading name?</h3>
                  <p className="text-xs text-slate-500">This will appear on audit sheets and generated reports.</p>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. GreenBrew Foods Pvt. Ltd."
                  className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Your workspace data is encrypted and completely isolated to your organization.</span>
              </div>
            </div>
          )}

          {/* STEP 2: Industry */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Select your primary industry</h3>
                  <p className="text-xs text-slate-500">Helps CarbonLens curate industry-specific emission benchmarks and AI advice.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setIndustry(ind.id)}
                    className={`p-3 text-left rounded-xl border transition-all flex items-center gap-2.5 ${
                      industry === ind.id
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-semibold ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xl">{ind.icon}</span>
                    <span className="text-xs leading-tight">{ind.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Business Size */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">How many full-time staff work at your business?</h3>
                  <p className="text-xs text-slate-500">Used for employee commuting estimates and intensity metrics.</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setEmployees(s.id)}
                    className={`w-full p-3.5 text-left rounded-xl border transition-all flex items-center justify-between ${
                      employees === s.id
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-semibold ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{s.label}</div>
                      <div className="text-xs text-slate-500">{s.desc}</div>
                    </div>
                    {employees === s.id && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Location */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Where are your core facilities located?</h3>
                  <p className="text-xs text-slate-500">Default electricity grid emission factors depend on geography.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="India">India (Grid factor: 0.82 kgCO₂e/kWh)</option>
                    <option value="United Kingdom">United Kingdom (0.207 kgCO₂e/kWh)</option>
                    <option value="United States">United States (0.386 kgCO₂e/kWh)</option>
                    <option value="European Union">European Union (0.231 kgCO₂e/kWh)</option>
                    <option value="Singapore">Singapore (0.408 kgCO₂e/kWh)</option>
                    <option value="Australia">Australia (0.680 kgCO₂e/kWh)</option>
                    <option value="Global">Global / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Carbon Goals */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">What is your primary carbon objective?</h3>
                  <p className="text-xs text-slate-500">Tailors dashboard KPI indicators and progress monitoring.</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.title)}
                    className={`w-full p-3 text-left rounded-xl border transition-all ${
                      goal === g.title
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{g.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{g.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Reduction Target:</span>
                  <span className="text-emerald-700">{targetPct}% reduction by {targetYear}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={targetPct}
                  onChange={(e) => setTargetPct(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Open Workspace
              </button>
            )}
          </div>
        </div>

        {/* Footer info note */}
        <p className="text-center text-xs text-slate-400">
          SME Sustainability reporting aligned with Greenhouse Gas (GHG) Protocol Corporate Standard.
        </p>
      </div>
    </div>
  );
};
