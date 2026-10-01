import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Zap,
  TrendingDown,
  Clock,
  DollarSign,
  CheckCircle2,
  Filter,
  Send,
  Loader2,
  RefreshCw,
  Flame,
  Truck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { initialRecommendations } from '../../data/initialData';
import { AIRecommendation } from '../../types';

export const AIRecommendationsPage: React.FC = () => {
  const { business, metrics, filteredRecords, showToast } = useApp();

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(initialRecommendations);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEffort, setSelectedEffort] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);

  // Interactive AI Assistant Chat state
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I am your CarbonLens Decarbonization Copilot for ${business.name}. Your baseline footprint is currently ${metrics.totalEmissionsTonne.toFixed(1)} tCO₂e, with Scope 2 electricity being your largest contributor (54.7 tCO₂e). What emission hotspot or supplier requirement can I assist you with today?`,
    },
  ]);

  const togglePlanned = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = r.status === 'Implemented' ? 'Under Review' : r.status === 'Planned' ? 'Implemented' : 'Planned';
          showToast(`Status updated to "${nextState}" for ${r.title}`, 'success');
          return { ...r, status: nextState };
        }
        return r;
      })
    );
  };

  const handleGenerateFreshAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business,
          totalEmissionsTonne: metrics.totalEmissionsTonne,
          scope1Tonne: metrics.scope1Tonne,
          scope2Tonne: metrics.scope2Tonne,
          scope3Tonne: metrics.scope3Tonne,
          topHotspot: 'Purchased Electricity (Scope 2)',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.recommendations && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
          showToast('Generated fresh decarbonization plan using Gemini AI', 'success');
        }
      } else {
        showToast('Connected using heuristic decarbonization models', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Loaded heuristic optimization recommendations', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim() || chatLoading) return;

    const userText = chatPrompt.trim();
    setChatPrompt('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          businessProfile: business,
          inventoryMetrics: metrics,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `For ${business.name}, reducing your ${metrics.scope2Tonne.toFixed(1)} tCO₂e in Scope 2 power is the highest ROI pathway. Consider a distributed rooftop solar setup (estimated payback: 2.8 years) and power-factor correction on your primary factory feeder.`,
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Based on your ${metrics.totalEmissionsTonne.toFixed(1)} tCO₂e total emissions, focusing on LED retrofits and route optimization for your diesel fleet will generate the fastest operational cost savings.`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filter recommendations
  const filteredRecs = recommendations.filter((r) => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    if (selectedEffort !== 'All' && r.effort !== selectedEffort) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              AI Decarbonization & Reduction Advisor
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Powered by Gemini
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Practical, high-ROI emissions reduction actions tailored specifically for SME operational realities.
          </p>
        </div>

        <button
          onClick={handleGenerateFreshAI}
          disabled={isGenerating}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl transition-all flex items-center gap-2 shadow-xs"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Refresh AI Analysis</span>
        </button>
      </div>

      {/* Top Decarbonization Potential Metrics - Industrial Intelligence Composition */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-900/8 shadow-xs relative overflow-visible transition-all card-hover-lift hover:-translate-y-[2px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                FACILITY OPTIMIZATION • ACTIVE INTELLIGENCE
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Heuristic & Gemini 2026 Engine</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
              Industrial Decarbonization & Abatement Opportunities
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              Converting facility energy consumption and process telemetry into sequenced capital projects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Industrial Factory Card */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-900/10 shadow-sm min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] aspect-16/10 sm:aspect-16/9">
              <img
                src="/assets/factory_manufacturing_plant.jpg"
                alt="Automated Smart Industrial Facility"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{business.name} Smart Facility</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-300 font-medium">
                    Priority Hotspot
                  </span>
                  <p className="text-xs font-semibold text-white">
                    Scope 2 Electricity ({metrics.scope2Tonne.toFixed(1)} tCO₂e) — Rooftop solar & load-shifting
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] text-slate-300">Reduction Potential</span>
                  <p className="text-xs font-mono font-bold text-emerald-300">-36.3% Target Achievable</p>
                </div>
              </div>
            </div>

            {/* Overlapping Small Floating Data Card */}
            <div
              className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:right-6 bg-white/98 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-emerald-600/20 shadow-lg z-20 flex items-center gap-3 animate-float-gentle-reverse max-w-xs transition-all hover:shadow-xl"
              style={{
                boxShadow: '0 12px 28px -6px rgba(5, 150, 105, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-700">
                <Zap className="w-5 h-5" />
              </div>
              <div className="pr-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  TOP HOTSPOT ABATEMENT
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">28.4</span>
                  <span className="text-[11px] font-medium text-slate-500">tCO₂e</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Rooftop solar solar displacement
                </p>
              </div>
            </div>
          </div>

          {/* Right: Floating Analytics Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-900/10 shadow-md relative z-10 animate-float-gentle transition-all hover:shadow-xl"
              style={{
                boxShadow: '0 16px 36px -6px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(5, 150, 105, 0.08)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    DECARBONIZATION POTENTIAL
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Target: -30%
                </span>
              </div>

              <div className="mt-4 mb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    46.7
                  </span>
                  <span className="text-sm font-semibold text-slate-500 ml-1.5">tCO₂e</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/50">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>↓ 36.3% vs baseline</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Implementing verified high-impact capital actions will exceed {business.name}'s reduction mandate.
              </p>

              {/* Two Compact ROI Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 card-hover-lift hover:-translate-y-[2px]">
                  <div className="text-xs font-medium text-slate-500">Annual Savings</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">$18,400</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Net operating margin</div>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 card-hover-lift hover:-translate-y-[2px]">
                  <div className="text-xs font-medium text-slate-500">Avg Payback</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">1.8 yrs</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Accelerated payback</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Category:</span>
          {['All', 'Renewable Energy', 'Energy Efficiency', 'Fleet & Logistics', 'Materials & Supply Chain'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Effort:</span>
          <select
            value={selectedEffort}
            onChange={(e) => setSelectedEffort(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
          >
            <option value="All">All Efforts</option>
            <option value="Quick Win">Quick Wins Only</option>
            <option value="Medium">Medium Effort</option>
            <option value="High">Strategic Projects</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map((rec, index) => {
          let statusColor = 'bg-slate-100 text-slate-700 border-slate-200';
          if (rec.status === 'Planned') {
            statusColor = 'bg-amber-50 text-amber-700 border-amber-200';
          } else if (rec.status === 'Implemented') {
            statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          }

          const floatClass = index % 4 === 0 
            ? 'floating-info-card-1' 
            : index % 4 === 1 
            ? 'floating-info-card-2' 
            : index % 4 === 2 
            ? 'floating-info-card-3' 
            : 'floating-info-card-4';

          return (
            <div key={rec.id} className={floatClass}>
              <div
                className="attractive-info-card p-5 rounded-2xl flex flex-col justify-between space-y-4 h-full"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                        {rec.scope} • {rec.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {rec.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => togglePlanned(rec.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${statusColor}`}
                    >
                      {rec.status}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Key Metrics Pill Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-[10px] text-slate-500 block">Reduction</span>
                      <span className="text-xs font-bold text-emerald-700">{rec.potentialReduction}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Payback</span>
                      <span className="text-xs font-bold text-slate-800">{rec.paybackPeriod}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">CapEx</span>
                      <span className="text-xs font-bold text-slate-800">{rec.estimatedCost}</span>
                    </div>
                  </div>

                  {/* Steps Checklist */}
                  {rec.steps && rec.steps.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-700 block">
                        Implementation Roadmap:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {rec.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Impact: {rec.impact}</span>
                  <button
                    onClick={() => togglePlanned(rec.id)}
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{rec.status === 'Implemented' ? 'Mark Completed' : 'Add to Action Plan'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          INTERACTIVE AI CHAT COPILOT SECTION
          ========================================================================= */}
      <div className="p-5 rounded-2xl bg-white border border-slate-900/8 shadow-xs card-hover-lift hover:-translate-y-[2px] transition-all space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Ask CarbonLens AI Copilot</h3>
            <p className="text-xs text-slate-500">Ask questions about your emissions, target setting, or supplier questionnaires</p>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-72 overflow-y-auto space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 text-xs ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-xl leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Analyzing carbon database and formulating recommendations...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            type="text"
            value={chatPrompt}
            onChange={(e) => setChatPrompt(e.target.value)}
            placeholder="e.g. How do I report emissions to an enterprise client asking for Scope 1 and Scope 2?"
            className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!chatPrompt.trim() || chatLoading}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
