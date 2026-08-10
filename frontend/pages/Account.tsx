import React from "react";
import { User, Mail, Shield, Key, Bell, ChevronRight } from "lucide-react";

const Account = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500">
          Manage your profile and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-700 shadow-md">
                P
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Cashier</h2>
              <p className="text-sm text-indigo-100">cashier@paysso.com</p>
              <div className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                Active Employee
              </div>
            </div>

            <div className="p-4">
              <nav className="flex flex-col space-y-1">
                <button className="flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <User size={18} />
                    Personal Info
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                  <div className="flex items-center gap-3">
                    <Shield size={18} />
                    Security
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                  <div className="flex items-center gap-3">
                    <Bell size={18} />
                    Notifications
                  </div>
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="Paysso"
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Cashier"
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    defaultValue="cashier@paysso.com"
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                disabled
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm opacity-50 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Security</h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Password
                    </p>
                    <p className="text-xs text-slate-500">
                      Last changed 3 months ago
                    </p>
                  </div>
                </div>
                <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
