import React, { useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  TableProperties,
  Flame,
  Sparkles,
  FileSpreadsheet,
  BookOpen,
  FileCheck2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Upload,
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

// Exactly the requested navigation list:
// Overview, Emissions, Scope 1, Insights, Reports, Emission Factors, Audit Trail
const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'emissions', label: 'Emissions', icon: TableProperties },
  { id: 'scope1', label: 'Scope 1', icon: Flame },
  { id: 'ai-insights', label: 'Insights', icon: Sparkles },
  { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  { id: 'factors', label: 'Emission Factors', icon: BookOpen },
  { id: 'audit', label: 'Audit Trail', icon: FileCheck2 },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, setIsESGUploadModalOpen } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white text-slate-700 border-r border-slate-200 transition-all duration-300 flex flex-col z-30 shrink-0 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left cursor-pointer overflow-hidden focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs">
            <span>C</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-slate-900 tracking-tight text-sm">CarbonLens</span>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase">SME ESG</span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle navigation bar"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation: ONLY the 7 required items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left text-sm">{item.label}</span>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-slate-100 text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section: ESG PDF Upload & Settings */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button
          type="button"
          onClick={() => setIsESGUploadModalOpen(true)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/90 transition-all group relative cursor-pointer shadow-2xs ${
            collapsed ? 'justify-center px-2' : ''
          }`}
          title={collapsed ? 'Upload ESG PDF' : undefined}
        >
          <Upload className="w-4 h-4 shrink-0 text-emerald-700 group-hover:scale-105 transition-transform" />
          {!collapsed && (
            <span className="truncate flex-1 text-left text-sm font-bold">Upload ESG PDF</span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-slate-100 text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              Upload ESG PDF
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
          } ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings
            className={`w-4 h-4 shrink-0 transition-colors ${
              activeTab === 'settings' ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
            }`}
          />
          {!collapsed && (
            <span className="truncate flex-1 text-left">Settings</span>
          )}

          {collapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-slate-100 text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              Settings
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
