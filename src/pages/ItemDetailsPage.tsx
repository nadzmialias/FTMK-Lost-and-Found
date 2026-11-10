import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Link, useParams } from "react-router";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";

import {
  getFoundItemDetails,
  submitOwnershipClaim,
} from "../services/claimServices";

import type { FoundItemDetails } from "../types/item";

export default function ItemDetailsPage() {
  const { itemId } = useParams<{ itemId: string }>();

  const [item, setItem] = useState<FoundItemDetails | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadItem() {
      if (!itemId) {
        if (active) {
          setError("Invalid item ID.");
          setLoading(false);
        }
        return;
      }

      try {
        const result = await getFoundItemDetails(itemId);

        if (active) {
          setItem(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load item."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadItem();

    return () => {
      active = false;
    };
  }, [itemId]);

  const handleClaim = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!itemId || submitting) return;

    setClaimError("");
    setSubmitting(true);

    try {
      await submitOwnershipClaim(itemId, answer);

      setClaimSubmitted(true);

      // Clear sensitive answer after submission.
      setAnswer("");
    } catch (err) {
      setClaimError(
        err instanceof Error
          ? err.message
          : "Unable to submit claim."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-4xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Item Not Available
        </h1>

        <p className="mt-3 text-slate-500">
          {error || "The requested item could not be found."}
        </p>

        <Link
          to="/browse"
          className="mt-6 inline-block font-medium text-blue-700"
        >
          Back to Browse Items
        </Link>
      </main>
    );
  }

  const canClaim =
    item.status === "REPORTED" &&
    !claimSubmitted &&
    Boolean(item.verification_question);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">

        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Browse Items
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">

          {/* ITEM DETAILS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">

            <div className="flex h-72 items-center justify-center bg-slate-100">
              {item.photo_url ? (
                <img
                  src={item.photo_url}
                  alt={item.item_name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Package
                  size={72}
                  className="text-slate-300"
                />
              )}
            </div>

            <div className="p-7">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {item.category}
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {item.status.replaceAll("_", " ")}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                {item.item_name}
              </h1>

              <p className="mt-3 break-all text-sm text-slate-400">
                Reference: {item.reference_code}
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    className="shrink-0 text-blue-700"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Location Found
                    </p>
                    <p className="mt-1 text-slate-500">
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={20}
                    className="shrink-0 text-blue-700"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Date Found
                    </p>
                    <p className="mt-1 text-slate-500">
                      {item.item_date}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <h2 className="text-lg font-semibold">
                  Item Description
                </h2>

                <p className="mt-3 leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            </div>
          </section>

          {/* CLAIM PANEL */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={24}
                  className="text-blue-700"
                />

                <h2 className="text-xl font-bold text-slate-900">
                  Claim This Item
                </h2>
              </div>

              {claimSubmitted ? (
                <div className="mt-8 text-center">
                  <CheckCircle2
                    size={48}
                    className="mx-auto text-green-600"
                  />

                  <h3 className="mt-4 text-lg font-semibold">
                    Claim Submitted!
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Your ownership claim has been recorded.
                    The finder must review the claim and
                    confirm the item's return.
                  </p>

                  <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-800">
                    Status: CLAIM REQUESTED
                  </div>
                </div>
              ) : canClaim ? (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    To request ownership, answer the
                    verification question provided by the finder.
                  </p>

                  <form
                    onSubmit={handleClaim}
                    className="mt-7"
                  >
                    <label
                      htmlFor="claimAnswer"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Verification Question
                    </label>

                    <div className="mt-3 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-900">
                      {item.verification_question}
                    </div>

                    <label
                      htmlFor="claimAnswer"
                      className="mt-6 block text-sm font-semibold text-slate-700"
                    >
                      Your Answer
                    </label>

                    <input
                      id="claimAnswer"
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      required
                      minLength={2}
                      maxLength={200}
                      autoComplete="off"
                      placeholder="Enter your answer"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {claimError && (
                      <div
                        role="alert"
                        className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                      >
                        {claimError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-6 w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                    >
                      {submitting
                        ? "Submitting Claim..."
                        : "Submit Ownership Claim"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="mt-6 rounded-xl bg-amber-50 p-5">
                  <p className="font-semibold text-amber-900">
                    Claims Unavailable
                  </p>

                  <p className="mt-2 text-sm text-amber-800">
                    This item is not currently accepting
                    new ownership claims.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}