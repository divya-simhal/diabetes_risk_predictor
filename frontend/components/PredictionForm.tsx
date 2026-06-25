"use client";

import { useState, FormEvent } from "react";
import { predictRisk, PredictionInput, PredictionResult } from "@/lib/api";

const FIELD_GROUPS: {
  title: string;
  fields: {
    key: keyof PredictionInput;
    label: string;
    step?: string;
    hint?: string;
  }[];
}[] = [
  {
    title: "Background",
    fields: [
      { key: "age", label: "Age (years)" },
      { key: "pregnancies", label: "Pregnancies" },
    ],
  },
  {
    title: "Vitals",
    fields: [
      { key: "glucose", label: "Glucose (mg/dL)" },
      { key: "blood_pressure", label: "Blood pressure (mm Hg)" },
      { key: "bmi", label: "BMI", step: "0.1" },
    ],
  },
  {
    title: "Labs",
    fields: [
      { key: "skin_thickness", label: "Skin thickness (mm)" },
      { key: "insulin", label: "Insulin (mu U/mL)" },
      {
        key: "diabetes_pedigree_function",
        label: "Diabetes pedigree function",
        step: "0.01",
        hint: "Family-history risk score, typically 0–2.5",
      },
    ],
  },
];

const EMPTY_FORM: Record<keyof PredictionInput, string> = {
  pregnancies: "",
  glucose: "",
  blood_pressure: "",
  skin_thickness: "",
  insulin: "",
  bmi: "",
  diabetes_pedigree_function: "",
  age: "",
};

export default function PredictionForm({
  onResult,
}: {
  onResult: (result: PredictionResult) => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField(key: keyof PredictionInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const payload: PredictionInput = {
        pregnancies: Number(form.pregnancies),
        glucose: Number(form.glucose),
        blood_pressure: Number(form.blood_pressure),
        skin_thickness: Number(form.skin_thickness),
        insulin: Number(form.insulin),
        bmi: Number(form.bmi),
        diabetes_pedigree_function: Number(form.diabetes_pedigree_function),
        age: Number(form.age),
      };
      const result = await predictRisk(payload);
      onResult(result);
    } catch {
      setError("Couldn't run that screening. Check the values and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {FIELD_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="font-data text-xs uppercase tracking-[0.15em] text-ink-soft mb-3">
            {group.title}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label
                  className="block text-sm text-ink-soft mb-1.5"
                  htmlFor={field.key}
                >
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type="number"
                  required
                  min={0}
                  step={field.step ?? "1"}
                  value={form[field.key]}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="w-full rounded-md border border-line bg-card px-3 py-2.5 text-ink focus:border-teal outline-none"
                />
                {field.hint && (
                  <p className="mt-1 text-xs text-ink-soft">{field.hint}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <p className="text-sm text-coral" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto rounded-md bg-teal px-6 py-3 text-white font-medium hover:bg-teal-dark transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Running screening…" : "Run screening"}
      </button>
    </form>
  );
}
