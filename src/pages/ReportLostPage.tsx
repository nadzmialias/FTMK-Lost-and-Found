import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";

import { submitLostReport, type LostReportInput } from "../services/lostReportService";

const categories = [
  "Electronics",
  "Cards & Documents",
  "Keys",
  "Bags & Wallets",
  "Clothing & Accessories",
  "Books & Stationery",
  "Personal Items",
  "Others",
];

const locations = [
  "FTMK Computer Lab",
  "FTMK Lecture Hall",
  "FTMK Cafeteria",
  "FTMK Library",
  "FTMK Lobby",
  "FTMK Corridor",
  "FTMK Parking Area",
  "Other Location",
];

const initialForm: LostReportInput = {
  itemName: "",
  category: "",
  location: "",
  dateLost: "",
  description: "",
};

const inputStyle =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 " +
  "text-sm outline-none transition focus:border-blue-500 " +
  "focus:ring-2 focus:ring-blue-100";

const getToday = () => {
  const now = new Date();

  return new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10);
};

export default function ReportLostPage() {
  const [formData, setFormData] =
    useState<LostReportInput>(initialForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [referenceCode, setReferenceCode] = useState("");

  const today = getToday();

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (formData.dateLost > today) {
      setError("Date lost cannot be in the future.");
      return;
    }
    if (formData.description.trim().length < 10) {
      setError("Description must contain at least 10 characters.");
      return;
    }
    setLoading(true);
    try {
      const result = await submitLostReport(formData);
      setReferenceCode(result.referenceCode);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setReferenceCode("");
    setError("");
  };

  // SUCCESS SCREEN
  if (referenceCode) {
    return (
      <main className="min-h-[80vh] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 size={34} className="text-green-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Lost Item Reported!
          </h1>
          <p className="mt-3 text-slate-500">
            Your lost-item report has been saved successfully.
          </p>
          <div className="mt-8 rounded-xl bg-blue-50 p-6">
            <p className="text-sm font-medium text-blue-700">Your Reference Code</p>
            <h2 className="mt-3 break-all text-2xl font-bold text-blue-900">
              {referenceCode}
            </h2>
            <p className="mt-3 text-sm text-blue-800">
              Save this code to track your report status.
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(referenceCode);
                  window.alert("Reference code copied.");
                } catch {
                  window.alert("Please select and copy the code manually.");
                }
              }}
              className="mt-4 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              Copy Reference Code
            </button>
          </div>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left">
            <h3 className="font-semibold text-slate-900">What Happens Next?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Your lost-item report has been recorded.
              You can browse recently found items to check for a possible match.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              If you find a matching item that is available for collection,
              visit its confirmed collection point. An administrator will verify
              ownership before handing it over.
            </p>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Current Status:
            <span className="ml-2 font-semibold text-blue-700">REPORTED</span>
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to={`/track/${encodeURIComponent(referenceCode)}`}
              className="rounded-xl bg-blue-700 px-6 py-3 text-center font-semibold text-white hover:bg-blue-800"
            >
              Track Report
            </Link>
            <Link
              to="/browse"
              className="rounded-xl border border-slate-200 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse Found Items
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              Report Another Item
            </button>
          </div>
          <Link
            to="/"
            className="mt-5 block text-sm text-slate-500 hover:text-blue-700"
          >
            Back to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">

        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* HEADER */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <PackageSearch size={16} />
            Lost Item Report
          </div>

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Report a Lost Item
          </h1>

          <p className="mt-3 text-slate-500">
            Lost something at FTMK? Tell us what happened
            so your missing item can be recorded.
          </p>
        </div>

        {/* PRIVACY NOTICE */}
        <div className="mb-8 flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <ShieldCheck
            size={22}
            className="shrink-0 text-blue-700"
          />

          <div>
            <h3 className="font-semibold text-blue-900">
              Protect Your Personal Information
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-blue-800">
              Do not include student ID numbers, passwords,
              phone numbers, or other sensitive information
              in your report.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">

            {/* ITEM DETAILS */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-7 py-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Item Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Describe the item you've lost.
                </p>
              </div>

              <div className="space-y-6 p-7">
                <div>
                  <label
                    htmlFor="itemName"
                    className="mb-2 block text-sm font-medium"
                  >
                    Item Name *
                  </label>

                  <input
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={100}
                    placeholder="e.g. Scientific Calculator"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium"
                  >
                    Category *
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={inputStyle}
                  >
                    <option value="">Select category</option>

                    {categories.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium"
                  >
                    Item Description *
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength={10}
                    maxLength={500}
                    rows={5}
                    placeholder="Describe your missing item, including its color, size, or other general features..."
                    className={inputStyle}
                  />

                  <p className="mt-2 text-right text-xs text-slate-400">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>
            </section>

            {/* LOCATION & DATE */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-7 py-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <MapPin size={20} className="text-blue-700" />
                  Location & Date
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Where and when did you lose the item?
                </p>
              </div>

              <div className="space-y-6 p-7">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium"
                  >
                    Last Seen Location *
                  </label>

                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className={inputStyle}
                  >
                    <option value="">Select location</option>

                    {locations.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dateLost"
                    className="mb-2 flex items-center gap-2 text-sm font-medium"
                  >
                    <CalendarDays size={16} />
                    Date Lost *
                  </label>

                  <input
                    id="dateLost"
                    type="date"
                    name="dateLost"
                    value={formData.dateLost}
                    onChange={handleChange}
                    max={today}
                    required
                    className={inputStyle}
                  />
                </div>
              </div>
            </section>

            {/* SUBMISSION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Ready to Submit?
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Check your details before submitting.
                A reference code will be generated after
                your report is saved successfully.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Lost Report
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}