
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  LogOut,
  Package,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../services/supabaseClient";

import {
  getAdminItems,
  updateAdminItem,
  type AdminItem,
  type AdminProfile,
} from "../services/adminService";

function statusLabel(status: string) {
  switch (status) {
    case "AVAILABLE_FOR_COLLECTION":
      return "Available for Collection";
    case "CLAIM_REQUESTED":
      return "Legacy Claim";
    case "RETURNED":
      return "Returned";
    default:
      return "Reported";
  }
}

function statusStyle(status: string) {
  switch (status) {
    case "AVAILABLE_FOR_COLLECTION":
      return "bg-green-50 text-green-700";
    case "RETURNED":
      return "bg-slate-100 text-slate-600";
    case "CLAIM_REQUESTED":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-blue-50 text-blue-700";
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState<AdminItem[]>([]);
  const [profile, setProfile] = useState<AdminProfile | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadItems = useCallback(async () => {
    try {
      const result = await getAdminItems();

      setItems(result.items);
      setProfile(result.profile);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const result = await getAdminItems();

        if (!active) return;

        setItems(result.items);
        setProfile(result.profile);
        setError("");
      } catch {
        if (active) {
          navigate("/admin/login", { replace: true });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, [navigate]);

  const counts = useMemo(
    () => ({
      total: items.length,
      reported: items.filter(
        (item) => item.status === "REPORTED"
      ).length,
      available: items.filter(
        (item) => item.status === "AVAILABLE_FOR_COLLECTION"
      ).length,
      returned: items.filter(
        (item) => item.status === "RETURNED"
      ).length,
    }),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.item_name,
          item.reference_code,
          item.location,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "ALL" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  async function handleAction(
    item: AdminItem,
    action: "RECEIVE" | "RETURN"
  ) {
    if (processingId) return;

    const confirmation =
      action === "RECEIVE"
        ? `Confirm that "${item.item_name}" has physically arrived at the selected collection point?`
        : `Confirm ownership has been verified in person and "${item.item_name}" has been handed back?`;

    if (!window.confirm(confirmation)) return;

    setProcessingId(item.item_id);
    setError("");
    setMessage("");

    try {
      const result = await updateAdminItem(
        item.item_id,
        action
      );

      setMessage(
        result.message ?? "Item updated successfully."
      );

      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update item."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <RefreshCw
          size={30}
          className="animate-spin text-blue-700"
        />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-[70vh] p-12 text-center">
        <p className="text-red-700">
          Administrator access unavailable.
        </p>
        <button
          onClick={() => navigate("/admin/login")}
          className="mt-4 text-blue-700"
        >
          Back to Login
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              <ShieldCheck size={16} />
              Administrator
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Welcome, {profile.full_name}. Manage found
              items and confirm handovers.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <LogOut size={17} />
            Log Out
          </button>
        </div>

        {/* STATISTICS */}
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Found Items",
              value: counts.total,
              icon: Package,
            },
            {
              label: "Reported",
              value: counts.reported,
              icon: ClipboardList,
            },
            {
              label: "Available",
              value: counts.available,
              icon: Clock3,
            },
            {
              label: "Returned",
              value: counts.returned,
              icon: CheckCircle2,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <Icon
                  size={21}
                  className="text-blue-700"
                />

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* ITEM MANAGEMENT */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Found Item Management
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Confirm receipt when an item arrives,
                and confirm return after ownership verification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void loadItems();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700"
            >
              {message}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search item or reference code"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
              />
            </div>

            <select
              aria-label="Filter by status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="AVAILABLE_FOR_COLLECTION">
                Available for Collection
              </option>
              <option value="RETURNED">Returned</option>
              <option value="CLAIM_REQUESTED">
                Legacy Claims
              </option>
            </select>
          </div>

          <div className="mt-6 space-y-4">
            {filteredItems.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                No items match your search.
              </p>
            )}

            {filteredItems.map((item) => (
              <div
                key={item.item_id}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.item_name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.reference_code}
                    </p>

                    <p className="mt-3 text-sm text-slate-600">
                      Found at: {item.location}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Collection Point:{" "}
                      {item.collection_point?.point_name ??
                        "Not assigned"}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-3 py-2 text-xs font-semibold ${statusStyle(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                  {item.status === "REPORTED" &&
                    item.collection_point && (
                      <button
                        type="button"
                        disabled={
                          processingId === item.item_id
                        }
                        onClick={() =>
                          handleAction(item, "RECEIVE")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                      >
                        <PackageCheck size={18} />
                        Confirm Receipt
                      </button>
                    )}

                  {item.status ===
                    "AVAILABLE_FOR_COLLECTION" && (
                    <button
                      type="button"
                      disabled={
                        processingId === item.item_id
                      }
                      onClick={() =>
                        handleAction(item, "RETURN")
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle2 size={18} />
                      Confirm Handover
                    </button>
                  )}

                  {item.status === "RETURNED" && (
                    <p className="text-sm font-medium text-green-700">
                      Item successfully returned
                    </p>
                  )}

                  {item.status === "CLAIM_REQUESTED" && (
                    <p className="text-sm text-amber-700">
                      Legacy claim record. Resolve during migration.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
