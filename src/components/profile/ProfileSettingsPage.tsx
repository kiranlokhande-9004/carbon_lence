import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Target,
  Users,
  ShieldCheck,
  Save,
  RotateCcw,
  Mail,
  UserPlus,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { UserRole } from '../../types';

export const ProfileSettingsPage: React.FC = () => {
  const {
    business,
    updateBusinessProfile,
    teamMembers,
    addTeamMember,
    resetToDemo,
    showToast,
  } = useApp();

  // Local form state
  const [name, setName] = useState(business.name);
  const [industry, setIndustry] = useState(business.industry);
  const [employees, setEmployees] = useState(business.employees);
  const [country, setCountry] = useState(business.country);
  const [city, setCity] = useState(business.city);
  const [targetReductionPct, setTargetReductionPct] = useState(business.targetReductionPct);
  const [targetYear, setTargetYear] = useState(business.targetYear);
  const [baselineYear, setBaselineYear] = useState(business.baselineYear);

  // New member invite state
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('Contributor');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({
      name,
      industry,
      employees: Number(employees),
      country,
      city,
      targetReductionPct: Number(targetReductionPct),
      targetYear: Number(targetYear),
      baselineYear: Number(baselineYear),
    });
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail || !newMemberName) return;

    addTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      status: 'Active',
    });

    setNewMemberName('');
    setNewMemberEmail('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Business Profile & Decarbonization Targets
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure legal entity details, emission reduction objectives, and organization permissions.
        </p>
      </div>

      {/* Organization Details Form */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Organization Identity</h3>
            <p className="text-xs text-slate-500">Legal entity information displayed on carbon disclosures</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Company / Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Primary Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Headcount (FTEs)</label>
              <input
                type="number"
                value={employees}
                onChange={(e) => setEmployees(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">City / Facility Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Decarbonization Targets */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <h4 className="font-semibold text-slate-900">Science-Aligned Reduction Target</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Reduction (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetReductionPct}
                    onChange={(e) => setTargetReductionPct(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Achievement Year</label>
                <input
                  type="number"
                  value={targetYear}
                  onChange={(e) => setTargetYear(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Baseline Year</label>
                <input
                  type="number"
                  value={baselineYear}
                  onChange={(e) => setBaselineYear(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Team Access Management */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-semibold text-sm text-slate-900">Team Members & Access Roles</h3>
              <p className="text-xs text-slate-500">Collaborate with internal accountants and sustainability advisors</p>
            </div>
          </div>
        </div>

        {/* Existing Team Members List */}
        <div className="divide-y divide-slate-100 text-xs">
          {teamMembers.map((member) => (
            <div key={member.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">{member.name}</div>
                <div className="text-slate-400">{member.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {member.role}
                </span>
                <span className="text-[10px] text-slate-400">Added {member.addedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Team Member Form */}
        <form onSubmit={handleInviteMember} className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2 text-xs">
          <input
            type="text"
            required
            placeholder="Name (e.g. David Ross)"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          <input
            type="email"
            required
            placeholder="Email (e.g. david@greenbrew.com)"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          <select
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
            className="px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900"
          >
            <option value="Contributor">Contributor</option>
            <option value="Auditor">Auditor (Read-Only)</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite</span>
          </button>
        </form>
      </div>

      {/* Demo Workspace Maintenance */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm text-slate-900">Reset Demo Workspace</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Reload the benchmark food & beverage enterprise dataset (GreenBrew Foods Pvt. Ltd.).
          </p>
        </div>
        <button
          onClick={resetToDemo}
          className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
