import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Building2, User, Mail, Lock, Globe, ArrowRight, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModal, closeAuthModal, login, signup, resetToDemo } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(authModal.mode || 'login');

  // Form states
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('India');
  const [forgotSent, setForgotSent] = useState(false);

  if (!authModal.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email || 'ananya@greenbrewfoods.com', fullName || 'Ananya Sharma');
    } else if (mode === 'signup') {
      signup(fullName || 'Sarah Chen', businessName || 'Apex Manufacturing', email || 'sarah@apex.com');
    } else if (mode === 'forgot') {
      setForgotSent(true);
    }
  };

  const handleDemoSignIn = () => {
    resetToDemo();
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold">
              <span className="text-base tracking-tight">C</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg leading-tight">CarbonLens</h3>
              <p className="text-xs text-slate-500">SME Carbon Accounting & ESG</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Pre-fill banner */}
        <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Need an instant walkthrough?</span>
          </div>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline decoration-emerald-400"
          >
            Launch Demo Workspace →
          </button>
        </div>

        {/* Tab switch */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-100 px-6 pt-3">
            <button
              onClick={() => setMode('login')}
              className={`pb-2.5 text-sm font-medium border-b-2 transition-colors mr-6 ${
                mode === 'login'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${
                mode === 'signup'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {mode === 'forgot' ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-base">Reset your password</h4>
              <p className="text-xs text-slate-500">
                Enter your work email and we will send you instructions to reset your password.
              </p>

              {forgotSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium text-sm">
                    <Check className="w-4 h-4 text-emerald-600" /> Password reset link dispatched!
                  </div>
                  <p className="text-xs text-emerald-700">
                    If an account exists for <span className="font-semibold">{email || 'your email'}</span>, you will receive reset instructions shortly.
                  </p>
                  <button
                    onClick={() => {
                      setForgotSent(false);
                      setMode('login');
                    }}
                    className="mt-2 text-xs font-semibold text-emerald-700 underline"
                  >
                    Back to Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="flex-1 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shadow-xs"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Acme Innovations Ltd."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-emerald-700 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Operating Country</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="India">India</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Germany">Germany</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Sign In to Workspace' : 'Continue to Onboarding'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                {mode === 'login' ? (
                  <span>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-emerald-700 font-medium hover:underline"
                    >
                      Sign up for free
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-emerald-700 font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
