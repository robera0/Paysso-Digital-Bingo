import { useState, useEffect } from "react";
import { User, Mail, Shield, Key, Bell, ChevronRight } from "lucide-react";
import { useProfile, useUpdateProfile } from "../src/services/useUser";
import { useLanguage } from "../src/LanguageContext";
import { translations } from "../src/translations";

const Account = () => {
  const { data: profile } = useProfile();
  const { language } = useLanguage();
  const t = translations[language].account;
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const info = profile?.profile;
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    if (info) {
      const [firstName = "", lastName = ""] = (info.fullName ?? "").split(" ");
      setForm({
        firstName,
        lastName,
        email: info.email ?? "",
      });
    }
  }, [info]);

  const handleCancel = () => {
    if (info) {
      const [firstName = "", lastName = ""] = (info.fullName ?? "").split(" ");
      setForm({ firstName, lastName, email: info.email ?? "" });
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    if (info) {
      updateProfile({
        profile: {
          ...info,
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
        },
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t.accountSettings}</h1>
        <p className="text-sm text-slate-500">
          {t.manageProfile}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative px-6 py-8 text-center overflow-hidden">
              {/* background image */}
              <img
                src="/Block_bingo.jpeg"
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* dark overlay so text stays readable */}
              <div className="absolute inset-0 bg-black/50" />

              {/* content sits above the overlay */}
              <div className="relative z-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-700 shadow-md">
                  P
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">
                  {info?.fullName}
                </h2>
                <p className="text-sm text-indigo-100">{info?.email}</p>
                <div className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                  {t.activeUser}
                </div>
              </div>
            </div>
            <div className="p-4">
              <nav className="flex flex-col space-y-1">
                <button className="flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <User size={18} />
                    {t.personalInfo}
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                  <div className="flex items-center gap-3">
                    <Shield size={18} />
                    {t.security}
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                  <div className="flex items-center gap-3">
                    <Bell size={18} />
                    {t.notifications}
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
              {t.personalInformation}
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t.firstName}
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isEditing ? "bg-white text-slate-900" : "bg-slate-50 text-slate-500"}`}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t.lastName}
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isEditing ? "bg-white text-slate-900" : "bg-slate-50 text-slate-500"}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t.emailAddress}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    disabled={!isEditing}
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={`w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isEditing ? "bg-white text-slate-900" : "bg-slate-50 text-slate-500"}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-x-4 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  isEditing ? handleCancel() : setIsEditing(true)
                }
                className={`rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none transition-colors ${isEditing ? "bg-slate-700 hover:bg-slate-600 active:bg-slate-800" : "bg-slate-900 hover:bg-slate-800 active:bg-slate-700"}`}
              >
                {isEditing ? t.cancel : t.edit}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!isEditing || isPending}
                className={`rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none transition-colors ${isEditing ? "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800" : "bg-indigo-500/70 text-slate-100 cursor-not-allowed"}`}
              >
                {isPending ? t.updatingProfile : t.saveChanges}
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{t.security}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {t.password}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.lastChanged}
                    </p>
                  </div>
                </div>
                <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                  {t.update}
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
