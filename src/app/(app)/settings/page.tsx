"use client";

import { useEffect, useState } from "react";

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

const defaultSettings: Settings = {
  workspace: { organisation: "", reportingCurrency: "USD" },
  privacy: {
    maskPii: false,
    dataMinimization: false,
    autoDeleteTemp: false,
    auditTrail: false,
  },
  analysis: { anomalyDetection: false, requireExplanation: false },
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
        checked ? "bg-emerald-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
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
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      setSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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
      <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>

      {/* Workspace */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800">Workspace</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="organisation"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Organisation
            </label>
            <input
              id="organisation"
              type="text"
              value={settings.workspace.organisation}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  workspace: {
                    ...settings.workspace,
                    organisation: e.target.value,
                  },
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Your organisation name"
            />
          </div>
          <div>
            <label
              htmlFor="currency"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Reporting currency
            </label>
            <input
              id="currency"
              type="text"
              value={settings.workspace.reportingCurrency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  workspace: {
                    ...settings.workspace,
                    reportingCurrency: e.target.value,
                  },
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. USD, EUR, GBP"
            />
          </div>
        </div>
      </section>

      {/* Privacy & Processing */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800">
          Privacy &amp; processing
        </h2>
        <div className="mt-2 divide-y divide-slate-100">
          <ToggleRow
            label="Mask PII before AI analysis"
            description="Automatically redact personal identifiable information before sending data to AI models."
            checked={settings.privacy.maskPii}
            onChange={(val) =>
              setSettings({
                ...settings,
                privacy: { ...settings.privacy, maskPii: val },
              })
            }
          />
          <ToggleRow
            label="Data minimization"
            description="Only send the minimum required data fields to external processing services."
            checked={settings.privacy.dataMinimization}
            onChange={(val) =>
              setSettings({
                ...settings,
                privacy: { ...settings.privacy, dataMinimization: val },
              })
            }
          />
          <ToggleRow
            label="Auto-delete temporary processing data"
            description="Remove intermediate files and cached extractions after analysis completes."
            checked={settings.privacy.autoDeleteTemp}
            onChange={(val) =>
              setSettings({
                ...settings,
                privacy: { ...settings.privacy, autoDeleteTemp: val },
              })
            }
          />
          <ToggleRow
            label="Keep an analysis audit trail"
            description="Log every AI interaction and data access for compliance and review."
            checked={settings.privacy.auditTrail}
            onChange={(val) =>
              setSettings({
                ...settings,
                privacy: { ...settings.privacy, auditTrail: val },
              })
            }
          />
        </div>
      </section>

      {/* Analysis */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800">Analysis</h2>
        <div className="mt-2 divide-y divide-slate-100">
          <ToggleRow
            label="Automated anomaly detection"
            description="Continuously monitor extracted metrics for unusual patterns or outliers."
            checked={settings.analysis.anomalyDetection}
            onChange={(val) =>
              setSettings({
                ...settings,
                analysis: { ...settings.analysis, anomalyDetection: val },
              })
            }
          />
          <ToggleRow
            label="Require explanation for every insight"
            description="Force the AI to provide a cited justification for each generated recommendation."
            checked={settings.analysis.requireExplanation}
            onChange={(val) =>
              setSettings({
                ...settings,
                analysis: { ...settings.analysis, requireExplanation: val },
              })
            }
          />
        </div>
      </section>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600">
            Settings saved successfully.
          </span>
        )}
      </div>
    </div>
  );
}
