
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  manageFoundClaim,
  type ManagedItem,
  type ManagedClaim,
  type ManagementAction,
} from "../services/managementServices";

export default function ManageFoundItemPage() {
  const { referenceCode } = useParams<{
    referenceCode: string;
  }>();

  const [token] = useState(
    () =>
      new URLSearchParams(
        window.location.hash.slice(1)
      ).get("token") ?? ""
  );

  const [item, setItem] = useState<ManagedItem | null>(
    null
  );

  const [claims, setClaims] = useState<ManagedClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    if (!referenceCode || !token) {
      setError("Invalid or missing private management link.");
      setLoading(false);
      return;
    }

    try {
      const result = await manageFoundClaim(
        referenceCode,
        token,
        "VIEW"
      );

      setItem(result.item ?? null);
      setClaims(result.claims ?? []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load report."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function fetchReport() {
      if (!referenceCode || !token) {
        if (active) {
          setError("Invalid or missing private link.");
          setLoading(false);
        }
        return;
      }

      try {
        const result = await manageFoundClaim(
          referenceCode,
          token,
          "VIEW"
        );

        if (active) {
          setItem(result.item ?? null);
          setClaims(result.claims ?? []);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load report."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchReport();

    return () => {
      active = false;
    };
  }, [referenceCode, token]);

  async function handleAction(action: ManagementAction) {
    if (!referenceCode || !token || processing) return;

    const confirmMessages: Record<string, string> = {
      APPROVE:
        "Approve this ownership claim? You must still confirm the physical handover.",
      REJECT:
        "Reject this claim and reopen the item for new claims?",
      RETURN:
        "Confirm that the item has physically been returned to its owner?",
    };

    if (
      action !== "VIEW" &&
      !window.confirm(confirmMessages[action])
    ) {
      return;
    }

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      const result = await manageFoundClaim(
        referenceCode,
        token,
        action
      );

      setMessage(result.message ?? "Action completed.");

      // Fetch updated item and claim information.
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete action."
      );
    } finally {
      setProcessing(false);
    }
  }

  const pendingClaim = claims.find(
    (claim) => claim.status === "PENDING"
  );

  const approvedClaim = claims.find(
    (claim) => claim.status === "APPROVED"
  );

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <RefreshCw
          size={36}
          className="animate-spin text-blue-700"
        />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-3xl px-6 py-20 text-center">
        <ShieldCheck
          size={48}
          className="mx-auto text-slate-400"
        />

        <h1 className="mt-5 text-2xl font-bold">
          Management Link Unavailable
        </h1>

        <p className="mt-3 text-slate-500">
          {error || "Unable to access this report."}
        </p>

        <Link
          to="/"
          className="mt-6 inline-block text-blue-700"
        >
          Back to Homepage
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* PAGE HEADER */}
        <div className="mt-8 mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <ShieldCheck size={16} />
            Private Finder Access
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Manage Found Item
          </h1>

          <p className="mt-3 text-slate-500">
            Review ownership claims and manage item handover.
          </p>
        </div>

        {/* ITEM INFORMATION */}
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {item.item_name}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {item.category} · {item.location}
              </p>

              <p className="mt-3 break-all text-sm text-slate-400">
                Reference: {item.reference_code}
              </p>
            </div>

            <span className="self-start rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {item.status.replaceAll("_", " ")}
            </span>
          </div>
        </section>

        {/* FEEDBACK */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {/* CLAIM MANAGEMENT */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <ClipboardList
                  size={22}
                  className="text-blue-700"
                />
                Ownership Claims
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Review requests submitted for this item.
              </p>
            </div>

            <button
              type="button"
              disabled={processing}
              onClick={() => {
                setLoading(true);
                void loadData();
              }}
              className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
              aria-label="Refresh claims"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {claims.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-8 text-center">
              <ClipboardList
                size={38}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-semibold text-slate-900">
                No Claims Yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No ownership requests have been submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div
                  key={claim.claim_id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Ownership Claim
                      </h3>

                      <p className="mt-2 text-xs text-slate-500">
                        Submitted:{" "}
                        {new Date(
                          claim.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {claim.status}
                    </span>
                  </div>

                  {claim.status === "PENDING" &&
                    item.status === "CLAIM_REQUESTED" && (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={processing}
                          onClick={() =>
                            handleAction("APPROVE")
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle2 size={18} />
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={processing}
                          onClick={() =>
                            handleAction("REJECT")
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* HANDOVER CONFIRMATION */}
        {approvedClaim &&
          item.status === "CLAIM_REQUESTED" && (
            <section className="mt-8 rounded-2xl border border-green-200 bg-white p-7 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <PackageCheck
                  size={24}
                  className="text-green-600"
                />
                Confirm Item Handover
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                The ownership claim has been approved.
                Only confirm the return after the item has
                physically been handed to its owner.
              </p>

              <button
                type="button"
                disabled={processing}
                onClick={() => handleAction("RETURN")}
                className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                Confirm Item Returned
              </button>
            </section>
          )}

        {item.status === "RETURNED" && (
          <section className="mt-8 rounded-2xl bg-green-50 p-7 text-center">
            <CheckCircle2
              size={42}
              className="mx-auto text-green-600"
            />

            <h2 className="mt-4 text-xl font-bold text-green-900">
              Item Successfully Returned
            </h2>

            <p className="mt-2 text-sm text-green-800">
              This item has been marked as returned.
            </p>
          </section>
        )}

        {pendingClaim &&
          item.status === "CLAIM_REQUESTED" && (
            <p className="mt-6 text-center text-sm text-slate-500">
              Review the pending claim before confirming
              ownership or arranging handover.
            </p>
          )}
      </div>
    </main>
  );
}
