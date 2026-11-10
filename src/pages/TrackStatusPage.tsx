
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  MapPin,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

import {
  trackItem,
  type ItemStatus,
  type TrackingResult,
} from "../services/trackingService";

const stages = [
  {
    status: "REPORTED",
    label: "Reported",
    description: "The item report has been submitted.",
  },
  {
    status: "AVAILABLE_FOR_COLLECTION",
    label: "Available for Collection",
    description:
      "An administrator has confirmed receiving the item.",
  },
  {
    status: "RETURNED",
    label: "Returned",
    description:
      "The item has been handed back to its owner.",
  },
] as const;

function statusLabel(status: ItemStatus) {
  switch (status) {
    case "AVAILABLE_FOR_COLLECTION":
      return "Available for Collection";
    case "RETURNED":
      return "Returned";
    case "CLAIM_REQUESTED":
      return "Legacy Claim Requested";
    default:
      return "Reported";
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status: ItemStatus) {
  if (status === "RETURNED") {
    return "bg-green-50 text-green-700";
  }

  if (status === "AVAILABLE_FOR_COLLECTION") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "CLAIM_REQUESTED") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-blue-50 text-blue-700";
}

interface TrackerProps {
  initialCode: string;
}

function Tracker({ initialCode }: TrackerProps) {
  const navigate = useNavigate();

  const [referenceCode, setReferenceCode] =
    useState(initialCode);

  const [result, setResult] =
    useState<TrackingResult | null>(null);

  const [loading, setLoading] =
    useState(Boolean(initialCode));

  const [error, setError] = useState("");

  const loadReport = useCallback(
    async (code: string, isActive: () => boolean) => {
      try {
        const data = await trackItem(code);

        if (isActive()) {
          setResult(data);
          setError("");
        }
      } catch (err) {
        if (isActive()) {
          setResult(null);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load tracking information."
          );
        }
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
  if (!initialCode) return;

  let active = true;

  async function fetchTrackingData() {
    try {
      const data = await trackItem(initialCode);

      if (!active) return;

      setResult(data);
      setError("");
    } catch (err) {
      if (!active) return;

      setResult(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load tracking information."
      );
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  void fetchTrackingData();

  return () => {
    active = false;
  };
}, [initialCode]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const code = referenceCode.trim().toUpperCase();

    if (!/^FTMK-[FL]-[A-F0-9]{12}$/.test(code)) {
      setError("Please enter a valid reference code.");
      setResult(null);
      return;
    }

    if (code !== initialCode.toUpperCase()) {
      navigate(`/track/${encodeURIComponent(code)}`);
      return;
    }

    setLoading(true);
    setError("");
    await loadReport(code, () => true);
  }

  const currentStatus = result?.item.status;

  const activeStage = stages.findIndex(
    (stage) => stage.status === currentStatus
  );

  const isFound = result?.item.report_type === "FOUND";

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Search size={16} />
            Reference Code Tracking
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Track Your Item
          </h1>

          <p className="mt-3 max-w-xl text-slate-500">
            Check your lost or found report status
            using the reference code provided after
            submission.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-7 px-6 py-10">
        {/* SEARCH */}
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="referenceCode"
              className="block text-sm font-semibold text-slate-700"
            >
              Reference Code
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="referenceCode"
                type="text"
                required
                maxLength={19}
                value={referenceCode}
                onChange={(e) =>
                  setReferenceCode(e.target.value.toUpperCase())
                }
                placeholder="FTMK-F-XXXXXXXXXXXX"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                    Loading...
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
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}
        </section>

        {result && (
          <>
            {/* REPORT DETAILS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
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
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClass(
                    result.item.status
                  )}`}
                >
                  {statusLabel(result.item.status)}
                </span>
              </div>

              <div className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="shrink-0 text-blue-700"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {isFound
                        ? "Location Found"
                        : "Last Seen Location"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {result.item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className="shrink-0 text-blue-700"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {isFound ? "Date Found" : "Date Lost"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {result.item.item_date}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FOUND ITEM PROGRESS */}
            {isFound && activeStage >= 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Collection Progress
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Current progress of your found-item report.
                </p>

                <div className="mt-8 space-y-0">
                  {stages.map((stage, index) => {
                    const completed = index < activeStage;
                    const current = index === activeStage;
                    const reached = index <= activeStage;

                    return (
                      <div
                        key={stage.status}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          {completed ? (
                            <CheckCircle2
                              size={26}
                              className="shrink-0 text-green-600"
                            />
                          ) : current ? (
                            <Clock3
                              size={26}
                              className="shrink-0 text-blue-700"
                            />
                          ) : (
                            <Circle
                              size={26}
                              className="shrink-0 text-slate-300"
                            />
                          )}

                          {index < stages.length - 1 && (
                            <div
                              className={`my-2 h-12 w-0.5 ${
                                reached && index < activeStage
                                  ? "bg-green-500"
                                  : "bg-slate-200"
                              }`}
                            />
                          )}
                        </div>

                        <div className="min-w-0 pt-0.5">
                          <h3
                            className={`font-semibold ${
                              reached
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {stage.label}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* STATUS HISTORY */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Status History
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Recorded status changes for this report.
              </p>

              {result.history.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">
                  No status history has been recorded.
                </p>
              ) : (
                <ol className="mt-6 space-y-5">
                  {result.history.map((entry) => (
                    <li
                      key={entry.history_id}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        size={20}
                        className="mt-0.5 shrink-0 text-blue-700"
                      />

                      <div>
                        <p className="font-semibold text-slate-900">
                          {statusLabel(entry.new_status)}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(entry.changed_at)}
                        </p>

                        {entry.previous_status && (
                          <p className="mt-1 text-xs text-slate-400">
                            Previously:{" "}
                            {statusLabel(entry.previous_status)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            {/* NEXT STEPS */}
            <section className="rounded-xl border border-blue-100 bg-blue-50 p-6">
              <div className="flex items-center gap-2 font-semibold text-blue-900">
                <ShieldCheck size={20} />
                What Happens Next?
              </div>

              <p className="mt-3 text-sm leading-relaxed text-blue-800">
                {isFound
                  ? currentStatus === "RETURNED"
                    ? "An administrator has confirmed the item was returned to its owner."
                    : currentStatus === "AVAILABLE_FOR_COLLECTION"
                    ? "An administrator has received the item. The owner can visit the designated collection point and provide proof of ownership."
                    : currentStatus === "CLAIM_REQUESTED"
                    ? "This is a record from the previous claim-based workflow. Please contact the project administrator for its current handling status."
                    : "The report has been submitted. An administrator must confirm receipt before the item is ready for collection."
                  : "Your lost-item report has been recorded. Browse the found-item listings for a possible match. The new system does not yet automatically match lost and found reports."}
              </p>

              {isFound && (
                <Link
                  to="/browse"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
                >
                  Browse Found Items
                  <ArrowRight size={16} />
                </Link>
              )}
            </section>

            {isFound &&
              currentStatus === "AVAILABLE_FOR_COLLECTION" && (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  <PackageCheck size={20} />
                  The item is confirmed available for collection.
                </div>
              )}
          </>
        )}
      </div>
    </main>
  );
}

export default function TrackStatusPage() {
  const { referenceCode } = useParams<{
    referenceCode: string;
  }>();

  const code = referenceCode?.toUpperCase() ?? "";

  // Remount the tracker when the URL code changes.
  return <Tracker key={code} initialCode={code} />;
}
