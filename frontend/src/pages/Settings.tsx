import { useState } from "react";
import { User, Building2, Bell, Shield, Users, Save } from "lucide-react";
import { cn } from "../lib/utils";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "roles", label: "Role & Permissions", icon: Users },
];

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-slate-100 last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "w-10 h-5.5 h-6 rounded-full transition-colors relative",
        enabled ? "bg-brand-600" : "bg-slate-200"
      )}
    >
      <div className={cn(
        "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
        enabled ? "translate-x-4.5 translate-x-[18px]" : "translate-x-0.5"
      )} />
    </button>
  );
}

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState({
    newApplication: true,
    riskFlag: true,
    verificationUpdate: true,
    documentUploaded: false,
    aiAnalysis: true,
    dailyDigest: false,
  });

  const InputField = ({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) => (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-400 transition-colors"
      />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account and platform settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="section-card p-3 h-fit">
          <nav className="space-y-0.5">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                  activeSection === id
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3 section-card p-6">
          {activeSection === "profile" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-semibold text-slate-900">Profile</h3>
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-xl font-bold text-white">
                  PM
                </div>
                <div>
                  <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">Change Photo</button>
                  <p className="text-xs text-slate-400 mt-0.5">JPG, PNG. Max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="First Name" defaultValue="Priya" />
                <InputField label="Last Name" defaultValue="Mehta" />
                <InputField label="Email Address" defaultValue="priya.mehta@intellicredit.in" type="email" />
                <InputField label="Phone" defaultValue="+91 98765 43210" />
                <InputField label="Department" defaultValue="Credit Department" />
                <InputField label="Branch" defaultValue="Mumbai Main Branch" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Role</label>
                <input
                  defaultValue="Senior Credit Officer"
                  disabled
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Role is managed by your administrator</p>
              </div>
              <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeSection === "organization" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-semibold text-slate-900">Organization</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Organization Name" defaultValue="National Credit Bank Ltd" />
                <InputField label="Institution Type" defaultValue="Scheduled Commercial Bank" />
                <InputField label="RBI License No." defaultValue="RBI-SCB-2001-00234 (Demo)" />
                <InputField label="Head Office" defaultValue="Mumbai, Maharashtra" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 mt-4">Workflow Configuration</h4>
                <div className="space-y-1">
                  <SettingRow
                    label="Require dual authorization for approvals above ₹1 Cr"
                    description="Two credit officers must sign off on large sanctions"
                  >
                    <Toggle enabled={true} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow
                    label="Auto-assign applications by branch"
                    description="New applications are automatically routed to branch credit officers"
                  >
                    <Toggle enabled={false} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow
                    label="Enable AI analysis on submission"
                    description="Run AI analysis automatically when an application is submitted"
                  >
                    <Toggle enabled={true} onChange={() => {}} />
                  </SettingRow>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Configure when you receive email and in-app notifications</p>
              <div className="space-y-1">
                {[
                  { key: "newApplication", label: "New application assigned to me", desc: "When a new loan application is assigned to you" },
                  { key: "riskFlag", label: "Risk flag detected", desc: "When an AI or system risk flag is raised" },
                  { key: "verificationUpdate", label: "Verification status update", desc: "Legal, field, or valuation verification updates" },
                  { key: "documentUploaded", label: "New document uploaded", desc: "When borrower uploads a new document" },
                  { key: "aiAnalysis", label: "AI analysis completed", desc: "When AI analysis finishes for an application" },
                  { key: "dailyDigest", label: "Daily digest email", desc: "Summary of all pending actions each morning" },
                ].map(({ key, label, desc }) => (
                  <SettingRow key={key} label={label} description={desc}>
                    <Toggle
                      enabled={notifications[key as keyof typeof notifications]}
                      onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                    />
                  </SettingRow>
                ))}
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-base font-semibold text-slate-900">Security</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Change Password</h4>
                  <div className="space-y-3">
                    <InputField label="Current Password" type="password" />
                    <InputField label="New Password" type="password" />
                    <InputField label="Confirm New Password" type="password" />
                  </div>
                  <button className="mt-3 flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    <Shield className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Two-Factor Authentication</h4>
                  <SettingRow label="Enable 2FA" description="Require OTP verification on every login">
                    <Toggle enabled={true} onChange={() => {}} />
                  </SettingRow>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Active Sessions</h4>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-900">Chrome on Windows (Current)</p>
                        <p className="text-[10px] text-slate-400">192.168.1.22 · Mumbai, India · Active now</p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "roles" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-semibold text-slate-900">Role & Permissions</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-medium text-blue-800">Current Role: Senior Credit Officer</p>
                <p className="text-xs text-blue-600 mt-1">Role assignments are managed by the system administrator</p>
              </div>
              <div className="space-y-1">
                {[
                  { permission: "View Applications", granted: true },
                  { permission: "Create Applications", granted: true },
                  { permission: "Upload Documents", granted: true },
                  { permission: "Assign Verification Tasks", granted: true },
                  { permission: "Generate CAM", granted: true },
                  { permission: "Record Credit Decision", granted: true },
                  { permission: "Approve Applications (up to ₹1 Cr)", granted: true },
                  { permission: "Approve Applications (above ₹1 Cr)", granted: false },
                  { permission: "Manage Users", granted: false },
                  { permission: "Configure System Settings", granted: false },
                ].map(({ permission, granted }) => (
                  <SettingRow key={permission} label={permission}>
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded",
                      granted ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"
                    )}>
                      {granted ? "✓ Granted" : "✗ Not Granted"}
                    </span>
                  </SettingRow>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
