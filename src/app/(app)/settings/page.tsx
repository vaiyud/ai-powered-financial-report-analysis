"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface Settings {
  workspace: {
    organisation: string;
    reportingCurrency: string;
  };
  privacy: {
    maskPii: boolean;
    dataMinimization: boolean;
    autoDeleteTemp: boolean;
    auditTrail: boolean;
  };
  analysis: {
    anomalyDetection: boolean;
    requireExplanation: boolean;
  };
}

const DEFAULT_SETTINGS: Settings = {
  workspace: { organisation: "Enterprise Finance Group", reportingCurrency: "USD ($)" },
  privacy: {
    maskPii: true,
    dataMinimization: true,
    autoDeleteTemp: true,
    auditTrail: true,
  },
  analysis: { anomalyDetection: true, requireExplanation: true },
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        checked ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("smartflow_settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.warn("Using default settings");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem("smartflow_settings", JSON.stringify(newSettings));
    } catch (e) {
      console.warn("Failed to update localStorage");
    }
  };

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      localStorage.setItem("smartflow_settings", JSON.stringify(settings));
      try {
        await fetch("/api/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
      } catch (err) {
        // Ignore API fetch fail in static SPA mode
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure PDPA Malaysia privacy controls, workspace reporting, and anomaly thresholds.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <ShieldCheck size={14} className="text-emerald-600" /> Enterprise Config
        </span>
      </div>

      {/* Workspace */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Workspace & Reporting</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="organisation"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Organisation Name
            </label>
            <input
              id="organisation"
              type="text"
              value={settings.workspace.organisation}
              onChange={(e) =>
                updateSettings({
                  ...settings,
                  workspace: {
                    ...settings.workspace,
                    organisation: e.target.value,
                  },
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Your organisation name"
            />
          </div>
          <div>
            <label
              htmlFor="currency"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Reporting Currency
            </label>
            <input
              id="currency"
              type="text"
              value={settings.workspace.reportingCurrency}
              onChange={(e) =>
                updateSettings({
                  ...settings,
                  workspace: {
                    ...settings.workspace,
                    reportingCurrency: e.target.value,
                  },
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. USD, EUR, MYR"
            />
          </div>
        </div>
      </section>

      {/* Privacy & Processing */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">
          PDPA Malaysia &amp; Privacy Processing
        </h2>
        <div className="mt-2 divide-y divide-slate-100">
          <ToggleRow
            label="Mask PII before AI analysis"
            description="Automatically redact personal identifiable information (NRICs, emails) before sending data to AI models."
            checked={settings.privacy.maskPii}
            onChange={(val) =>
              updateSettings({
                ...settings,
                privacy: { ...settings.privacy, maskPii: val },
              })
            }
          />
          <ToggleRow
            label="Data minimization enforcement"
            description="Only send the minimum required data fields to external vector search processing services."
            checked={settings.privacy.dataMinimization}
            onChange={(val) =>
              updateSettings({
                ...settings,
                privacy: { ...settings.privacy, dataMinimization: val },
              })
            }
          />
          <ToggleRow
            label="Auto-delete temporary processing cache"
            description="Remove intermediate files and cached extractions after analysis completes."
            checked={settings.privacy.autoDeleteTemp}
            onChange={(val) =>
              updateSettings({
                ...settings,
                privacy: { ...settings.privacy, autoDeleteTemp: val },
              })
            }
          />
          <ToggleRow
            label="Maintain compliance audit trail"
            description="Log every AI interaction, PII scrubbing event, and document access for audit review."
            checked={settings.privacy.auditTrail}
            onChange={(val) =>
              updateSettings({
                ...settings,
                privacy: { ...settings.privacy, auditTrail: val },
              })
            }
          />
        </div>
      </section>

      {/* Analysis */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">RAG Analysis &amp; Anomaly Engine</h2>
        <div className="mt-2 divide-y divide-slate-100">
          <ToggleRow
            label="Automated financial anomaly detection"
            description="Continuously monitor extracted financial statement metrics for unusual leverage or margin outliers."
            checked={settings.analysis.anomalyDetection}
            onChange={(val) =>
              updateSettings({
                ...settings,
                analysis: { ...settings.analysis, anomalyDetection: val },
              })
            }
          />
          <ToggleRow
            label="Require cited provenance for every insight"
            description="Force the AI RAG engine to provide page and table source justification for each generated recommendation."
            checked={settings.analysis.requireExplanation}
            onChange={(val) =>
              updateSettings({
                ...settings,
                analysis: { ...settings.analysis, requireExplanation: val },
              })
            }
          />
        </div>
      </section>

      {/* Save button */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          type="button"
          className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-md"
        >
          {saving ? "Saving Changes..." : "Save Settings"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 size={16} />
            Settings saved &amp; persisted successfully!
          </span>
        )}
      </div>
    </div>
  );
}
