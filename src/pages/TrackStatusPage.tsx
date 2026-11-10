
import { useState } from "react";
import type { FormEvent } from "react";

import {
  Search,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Circle,
  AlertCircle,
  RefreshCw,
  MapPin,
  CalendarDays,
} from "lucide-react";

import {
  trackItem,
  type TrackingResult,
  type ItemStatus,
} from "../services/trackingService";

function formatStatus(status: ItemStatus) {
  switch (status) {
    case "CLAIM_REQUESTED":
      return "Claim Requested";
    case "RETURNED":
      return "Returned";
    default:
      return "Reported";
  }
}

function getStatusColor(status: ItemStatus) {
  switch (status) {
    case "RETURNED":
      return "bg-green-50 text-green-700";
    case "CLAIM_REQUESTED":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-blue-50 text-blue-700";
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TrackStatusPage() {
  const [referenceCode, setReferenceCode] = useState("");
  const [result, setResult] =
    useState<TrackingResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    const code = referenceCode.trim().toUpperCase();

    setError("");
    setResult(null);

    if (!/^FTMK-[FL]-[A-F0-9]{12}$/.test(code)) {
      setError(
        "Please enter a valid reference code, for example FTMK-F-123456ABCDEF."
      );
      return;
    }

    setLoading(true);

    try {
      const trackingResult = await trackItem(code);
      setResult(trackingResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to track item."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <ClipboardList size={16} />
            Item Status Tracker
          </div>

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Track Your Item
          </h1>

          <p className="mt-3 max-w-xl text-slate-500">
            Enter your report reference code to check
            the current status and history of your item.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* SEARCH FORM */}
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Enter Reference Code
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your reference code was provided when you
            submitted your lost or found report.
          </p>

          <form onSubmit={handleTrack} className="mt-6">
            <label
              htmlFor="referenceCode"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Reference Code
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="referenceCode"
                type="text"
                value={referenceCode}
                onChange={(e) =>
                  setReferenceCode(
                    e.target.value.toUpperCase()
                  )
                }
                maxLength={19}
                required
                autoComplete="off"
                placeholder="FTMK-F-XXXXXXXXXXXX"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium uppercase tracking-wide outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Track Item
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle
                size={19}
                className="shrink-0"
              />
              {error}
            </div>
          )}
        </section>

        {/* TRACKING RESULT */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* ITEM SUMMARY */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {result.item.report_type} Item Report
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {result.item.item_name}
                  </h2>

                  <p className="mt-2 break-all text-sm text-slate-500">
                    {result.item.reference_code}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                    result.item.status
                  )}`}
                >
                  {formatStatus(result.item.status)}
                </span>
              </div>

              <div className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
                <div className="flex gap-3">
                  <MapPin
                    size={19}
                    className="shrink-0 text-blue-700"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {result.item.report_type === "FOUND"
                        ? "Location Found"
                        : "Last Seen Location"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {result.item.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CalendarDays
                    size={19}
                    className="shrink-0 text-blue-700"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {result.item.report_type === "FOUND"
                        ? "Date Found"
                        : "Date Lost"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {result.item.item_date}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* STATUS HISTORY */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Status History
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Follow the progress of this report.
              </p>

              {result.history.length === 0 ? (
                <p className="mt-7 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  No status history is available yet.
                  Current status:{" "}
                  {formatStatus(result.item.status)}.
                </p>
              ) : (
                <div className="mt-8 space-y-0">
                  {result.history.map((entry, index) => {
                    const isLast =
                      index === result.history.length - 1;

                    const isReturned =
                      entry.new_status === "RETURNED";

                    return (
                      <div
                        key={entry.history_id}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          {isReturned ? (
                            <CheckCircle2
                              size={24}
                              className="shrink-0 text-green-600"
                            />
                          ) : isLast ? (
                            <Clock3
                              size={24}
                              className="shrink-0 text-blue-700"
                            />
                          ) : (
                            <Circle
                              size={24}
                              className="shrink-0 text-slate-400"
                            />
                          )}

                          {!isLast && (
                            <div className="my-2 min-h-12 w-0.5 flex-1 bg-slate-200" />
                          )}
                        </div>

                        <div className="min-w-0 pb-9">
                          <h3 className="font-semibold text-slate-900">
                            {formatStatus(entry.new_status)}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(entry.changed_at)}
                          </p>

                          {entry.previous_status && (
                            <p className="mt-2 text-xs text-slate-400">
                              Changed from{" "}
                              {formatStatus(
                                entry.previous_status
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm leading-relaxed text-blue-800">
              {result.item.status === "RETURNED"
                ? "The item has been marked as returned."
                : result.item.status === "CLAIM_REQUESTED"
                ? "An ownership claim has been requested. The finder must review it and confirm the handover."
                : "Your report has been recorded. No active ownership claim is reflected in the current item status."}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
