import React, { useState } from "react";

// Brand Colors
const brand = {
  navy: "#0B2D45",
  red: "#E33D2E",
};

// CRM Webhook Setup
const CRM_WEBHOOK_URL = ""; // <-- paste your webhook URL here
async function postToCRM(payload) {
  if (!CRM_WEBHOOK_URL) {
    throw new Error("CRM_WEBHOOK_URL is not set. Paste your webhook endpoint at the top of the file.");
  }
  const res = await fetch(CRM_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CRM request failed: ${res.status} ${text}`);
  }
  return res;
}

// Property Evaluation Form
function PropertyEvaluationForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const payload = {
      ...data,
      form_name: "Property Evaluation",
      source: "Website",
      page: typeof window !== "undefined" ? window.location.href : "",
      createdAt: new Date().toISOString(),
    };

    try {
      await postToCRM(payload);
      setSent(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <h4 className="text-xl font-semibold text-green-900">Thanks for submitting!</h4>
        <p className="mt-2 text-green-800">We’ll evaluate your property and send you a tailored report shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="hidden" name="form_name" value="Property Evaluation" />
      <input type="hidden" name="source" value="Website" />

      <div className="md:col-span-2">
        <label className="block text-sm font-medium">Property Address</label>
        <input name="address" required placeholder="123 Main St, City, TX" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"/>
      </div>
      <div>
        <label className="block text-sm font-medium">Year Built</label>
        <input name="year" type="number" placeholder="1990" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"/>
      </div>
      <div>
        <label className="block text-sm font-medium">Estimated Value</label>
        <input name="value" type="number" placeholder="$200,000" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"/>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium">Condition Notes</label>
        <textarea name="notes" rows={3} placeholder="Roof needs repair, kitchen outdated…" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"></textarea>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium">Owner Contact</label>
        <input name="contact" required placeholder="Name & phone/email" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"/>
      </div>

      <label className="md:col-span-2 flex items-start gap-2 text-xs text-slate-700">
        <input type="checkbox" name="consent" value="sms_opt_in" required />
        By submitting, you agree to receive calls and SMS from ERA Property Solutions. Reply STOP to opt out.
      </label>

      {error && (
        <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      <button type="submit" disabled={loading} className="md:col-span-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60">
        {loading ? "Submitting…" : "Submit for Evaluation"}
      </button>
    </form>
  );
}

// Website Component
export default function Website() {
  return (
    <div className="font-sans text-slate-900 scroll-smooth">
      {/* New Property Evaluation Section */}
      <section id="evaluation" className="py-16 md:py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Free Property Evaluation</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">Submit your property details below and we’ll provide a quick evaluation to help you understand its current market potential.</p>
          <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <PropertyEvaluationForm />
          </div>
        </div>
      </section>

      {/* Footer with Privacy + Terms links */}
      <footer className="border-t bg-white mt-12">
        <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-semibold text-lg">ERA Property Solutions</h3>
            <p className="mt-2 text-sm text-slate-600">We are a local Texas home‑buying company. We buy houses for cash in any condition. This site is for informational purposes only.</p>
          </div>
          <div className="md:text-right text-sm text-slate-600 flex flex-col gap-2 md:items-end">
            <a href="/privacy.md" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">Privacy Policy</a>
            <a href="/terms.md" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
