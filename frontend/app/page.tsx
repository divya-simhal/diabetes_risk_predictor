import Link from "next/link";
import PulseLine from "@/components/PulseLine";

const features = [
  {
    label: "Screen",
    title: "Log a reading in under a minute",
    body: "Enter eight standard clinical metrics — glucose, BMI, blood pressure and more — and get an instant risk read from a trained model.",
  },
  {
    label: "Track",
    title: "Every reading, kept on record",
    body: "Past screenings are saved to your account so you can see how risk factors move over time, not just a single snapshot.",
  },
  {
    label: "Understand",
    title: "See what's driving the score",
    body: "A dashboard breaks down which factors influence the model most, plus your own averages across every screening.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-teal mb-6">
          Diabetes risk screening
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-ink max-w-3xl">
          Read the signal before it becomes a diagnosis.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-xl">
          Vitals turns eight routine health metrics into a clear diabetes
          risk read, backed by a model trained on clinical data —
          and keeps a history so you can watch the trend, not just the
          moment.
        </p>

        <div className="mt-10">
          <PulseLine className="h-16" />
          <div className="baseline-rule" />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/register"
            className="rounded-md bg-teal px-5 py-3 text-white font-medium hover:bg-teal-dark transition-colors"
          >
            Create a free account
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-line px-5 py-3 text-ink font-medium hover:border-teal hover:text-teal transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8 border-t border-line">
        {features.map((feature) => (
          <div key={feature.title}>
            <p className="font-data text-xs uppercase tracking-[0.15em] text-ink-soft mb-3">
              {feature.label}
            </p>
            <h3 className="font-display text-lg font-semibold text-ink mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              {feature.body}
            </p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-line">
        <div className="rounded-xl border border-line bg-card p-8 sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            Built on the Pima Indians Diabetes dataset
          </h2>
          <p className="text-ink-soft leading-relaxed max-w-2xl">
            The underlying model is a logistic regression classifier trained
            on eight clinical features — pregnancies, glucose, blood
            pressure, skin thickness, insulin, BMI, diabetes pedigree
            function, and age. Predictions return a probability, not just a
            label, so risk is shown as a spectrum: Low, Moderate, or High.
          </p>
        </div>
      </section>
    </div>
  );
}
