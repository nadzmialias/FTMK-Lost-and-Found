
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { useAdminAuth } from "../context/adminAuthContext";
import { updateAdminItem } from "../services/adminService";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";



import {
  getPublicFoundItem,
  type PublicFoundItem,
} from "../services/publicItemServices";

export default function ItemDetailsPage() {
  const { itemId } = useParams<{ itemId: string }>();

const { isAdmin } = useAdminAuth();

const [updatingStatus, setUpdatingStatus] =
  useState(false);

const [adminError, setAdminError] = useState("");
const [adminMessage, setAdminMessage] = useState("");

  const [item, setItem] = useState<PublicFoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadItem() {
      if (!itemId) {
        if (active) {
          setError("Missing item ID.");
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getPublicFoundItem(itemId);
        if (active) {
          setItem(data);
          setError("");
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

    void loadItem();

    return () => {
      active = false;
    };
  }, [itemId]);


async function handleAdminAction(
  action: "RECEIVE" | "RETURN"
) {
  if (!item || !isAdmin || updatingStatus) {
    return;
  }

  // Only allow the appropriate next action.
  if (
    action === "RECEIVE" &&
    item.status !== "REPORTED"
  ) {
    return;
  }

  if (
    action === "RETURN" &&
    (
      item.status !== "AVAILABLE_FOR_COLLECTION" ||
      !item.received_at
    )
  ) {
    return;
  }

  const confirmation =
    action === "RECEIVE"
      ? `Confirm that "${item.item_name}" has physically arrived at the collection point?`
      : `Confirm that ownership of "${item.item_name}" has been verified and the item has been handed over?`;

  if (!window.confirm(confirmation)) {
    return;
  }

  setUpdatingStatus(true);
  setAdminError("");
  setAdminMessage("");

  try {
    // The Edge Function verifies admin permission
    // and performs the database status transition.
    await updateAdminItem(item.item_id, action);

    setAdminMessage(
      action === "RECEIVE"
        ? "Item receipt confirmed successfully."
        : "Item return confirmed successfully."
    );

    // Reload the public details so the new
    // status appears without refreshing the page.
    try {
      const refreshedItem = await getPublicFoundItem(
        item.item_id
      );

      setItem(refreshedItem);
    } catch {
      setAdminError(
        "The status was updated, but the latest item details could not be loaded. Please refresh the page."
      );
    }
  } catch (err) {
    setAdminError(
      err instanceof Error
        ? err.message
        : "Unable to update item status."
    );
  } finally {
    setUpdatingStatus(false);
  }
}

  if (loading) {
    return (
      <main className="min-h-[65vh] bg-slate-50 p-12 text-center text-slate-500">
        Loading item details...
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-[65vh] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-xl py-20 text-center">
          <PackageSearch
            size={44}
            className="mx-auto text-slate-300"
          />
          <h1 className="mt-5 text-2xl font-bold">
            Item Unavailable
          </h1>
          <p className="mt-3 text-slate-500">
            {error || "The requested item could not be found."}
          </p>
          <Link
            to="/browse"
            className="mt-6 inline-block font-medium text-blue-700"
          >
            Back to Browse
          </Link>
        </div>
      </main>
    );
  }

  const isAvailable =
    item.status === "AVAILABLE_FOR_COLLECTION" &&
    Boolean(item.received_at);

  const isReturned = item.status === "RETURNED";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Browse
        </Link>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* ITEM IMAGE */}
          <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {item.photo_url ? (
              <img
                src={item.photo_url}
                alt={item.item_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <PackageSearch
                size={64}
                className="text-slate-300"
              />
            )}
          </div>

          {/* ITEM INFORMATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Found Item
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              {item.item_name}
            </h1>

            <p className="mt-3 text-slate-500">
              {item.category}
            </p>

            <div className="mt-5">
              {isReturned ? (
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  Returned
                </span>
              ) : isAvailable ? (
                <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  Available for Collection
                </span>
              ) : (
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {item.status === "CLAIM_REQUESTED"
                    ? "Legacy Claim Status"
                    : "Reported"}
                </span>
              )}
            </div>

            <div className="mt-7 space-y-5 border-t border-slate-100 pt-6">
              <div className="flex gap-3">
                <MapPin
                  size={19}
                  className="shrink-0 text-blue-700"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Location Found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarDays
                  size={19}
                  className="shrink-0 text-blue-700"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Date Found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.item_date}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <h2 className="font-semibold text-slate-900">
                Description
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {item.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* COLLECTION POINT */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <PackageCheck
              size={23}
              className="text-blue-700"
            />
            Collection Information
          </h2>

          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {isAvailable
                ? "Confirmed Collection Point"
                : "Intended Collection Point"}
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {item.collection_point?.point_name ??
                "Collection point not assigned"}
            </p>

            {item.collection_point?.location_description && (
              <p className="mt-2 text-sm text-slate-600">
                {item.collection_point.location_description}
              </p>
            )}
          </div>

          {isAvailable ? (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2 font-semibold text-green-900">
                <CheckCircle2 size={20} />
                Ready for Collection
              </div>

              <p className="mt-3 text-sm leading-relaxed text-green-800">
                An administrator has confirmed receipt of
                this item. Visit the collection point and
                provide evidence that you are its owner.
              </p>

              <p className="mt-3 text-sm text-green-800">
                Final ownership verification and handover
                will be handled in person by an administrator.
              </p>
            </div>
          ) : isReturned ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={20} />
                Item Returned
              </div>

              <p className="mt-2 text-sm text-slate-600">
                This item has already been handed back.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <Clock3 size={20} />
                Awaiting Confirmation
              </div>

              <p className="mt-3 text-sm leading-relaxed text-amber-900">
                This item has been reported, but an
                administrator has not yet confirmed it
                is available at the collection point.
                Please check again later.
              </p>
            </div>
          )}
        </section>


{/* ADMINISTRATOR CONTROLS */}
{isAdmin && (
  <section className="mt-8 rounded-2xl border border-green-200 bg-white p-7 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
        <ShieldCheck
          size={24}
          className="text-green-700"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Administrator Controls
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage the physical receipt and return
          of this item.
        </p>
      </div>
    </div>

    <div className="mt-6 rounded-xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">
        Current Item Status
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {item.status === "AVAILABLE_FOR_COLLECTION"
          ? "Available for Collection"
          : item.status === "RETURNED"
            ? "Returned"
            : item.status === "CLAIM_REQUESTED"
              ? "Legacy Claim Status"
              : "Reported"}
      </p>
    </div>

    {adminError && (
      <div
        role="alert"
        className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {adminError}
      </div>
    )}

    {adminMessage && (
      <div
        role="status"
        className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
      >
        {adminMessage}
      </div>
    )}

    {item.status === "REPORTED" && (
      <div className="mt-6">
        <p className="mb-4 text-sm text-slate-600">
          Confirm that the physical item has arrived
          at the selected collection point.
        </p>

        <button
          type="button"
          disabled={updatingStatus}
          onClick={() => {
            void handleAdminAction("RECEIVE");
          }}
          className="w-full rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updatingStatus
            ? "Updating..."
            : "Confirm Item Received"}
        </button>
      </div>
    )}

    {item.status === "AVAILABLE_FOR_COLLECTION" &&
      Boolean(item.received_at) && (
        <div className="mt-6">
          <p className="mb-4 text-sm text-slate-600">
            Only confirm return after verifying the
            owner's identity and physically handing
            over the item.
          </p>

          <button
            type="button"
            disabled={updatingStatus}
            onClick={() => {
              void handleAdminAction("RETURN");
            }}
            className="w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updatingStatus
              ? "Updating..."
              : "Confirm Item Returned"}
          </button>
        </div>
      )}

    {item.status === "RETURNED" && (
      <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">
        This item has been returned successfully.
        No further action is available.
      </div>
    )}

    {item.status === "CLAIM_REQUESTED" && (
      <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        This is a legacy claim record.
        No status action is available here.
      </div>
    )}

    <Link
      to="/admin/dashboard"
      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
    >
      Go to Admin Dashboard
    </Link>
  </section>
)}

        <section className="mt-7 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-2 font-semibold text-blue-900">
            <ShieldCheck size={19} />
            Ownership Verification
          </div>

          <p className="mt-2 text-sm leading-relaxed text-blue-800">
            To collect an item, you must demonstrate
            ownership to an authorized administrator.
            The website does not approve ownership claims
            or arrange handovers automatically.
          </p>

          <Link
            to={`/track/${item.reference_code}`}
            className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
          >
            Track Item Status
          </Link>
        </section>
      </div>
    </main>
  );
}
