import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Calendar,
  Upload,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    business,
    reportingPeriod,
    setReportingPeriod,
    currentUser,
    logout,
    setActiveTab,
    notifications,
    markNotificationRead,
    activeTab,
    setIsESGUploadModalOpen,
    currentESGData,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Greeting and subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
            Good morning, {business.name || 'Microsoft Corporation'}
          </h1>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Verified MSFT Data
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Audited environmental footprint & GHG emissions disclosure.
        </p>
      </div>

      {/* Right: Upload ESG PDF, Date Selector, Notifications, Business Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Upload ESG PDF Action Button */}
        <button
          type="button"
          onClick={() => setIsESGUploadModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          title="Upload real company ESG report PDF"
        >
          <Upload className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">Upload ESG PDF</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
        </button>

        {/* Date / Period Selector */}
        <div className="flex items-center bg-slate-100/90 rounded-xl p-1 text-xs font-medium text-slate-700 border border-slate-200/70">
          <button
            type="button"
            onClick={() => setReportingPeriod('2023')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              reportingPeriod === '2023' || reportingPeriod === '2026'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2023
          </button>
          <button
            type="button"
            onClick={() => setReportingPeriod('2022')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              reportingPeriod === '2022'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2022
          </button>
          <button
            type="button"
            onClick={() => setReportingPeriod('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              reportingPeriod === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Years
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileMenuOpen(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100/80 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-800">
                <span>Notifications</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-1">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-slate-400">No new notifications</p>
                ) : (
                  notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <p className="font-medium text-slate-800 text-xs">{n.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Business Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center shadow-xs">
              {(business.name || 'G')[0]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                {business.name || 'GreenBrew Foods'}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {currentUser?.role || 'Admin'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="p-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">{business.name || 'GreenBrew Foods Pvt. Ltd.'}</p>
                <p className="text-slate-500 text-[11px]">{currentUser?.email || 'admin@greenbrew.com'}</p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" /> Business Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('settings');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> Settings
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
