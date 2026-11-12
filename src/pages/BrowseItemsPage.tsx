
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowRight,
  MapPin,
  PackageSearch,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  getPublicFoundItems,
  type FoundItemStatus,
  type PublicFoundItem,
} from "../services/publicItemServices";

function statusLabel(status: FoundItemStatus) {
  switch (status) {
    case "AVAILABLE_FOR_COLLECTION":
      return "Available for Collection";
    case "RETURNED":
      return "Returned";
    case "CLAIM_REQUESTED":
      return "Legacy Claim Status";
    default:
      return "Reported";
  }
}

function statusStyle(status: FoundItemStatus) {
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

export default function BrowseItemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [items, setItems] = useState<PublicFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    let active = true;

    getPublicFoundItems()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load items."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [
      "ALL",
      ...Array.from(new Set(items.map((item) => item.category))),
    ],
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.item_name,
          item.category,
          item.location,
          item.description ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "ALL" || item.category === category;

      const matchesStatus =
        statusFilter === "ALL" ||
        item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, category, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700">
            <PackageSearch size={18} />
            Lost & Found Directory
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Browse Found Items
          </h1>

          <p className="mt-3 text-slate-500">
            Search for your belongings and check whether
            they have arrived at a collection point.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-3.5 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                const value = event.target.value;
                setSearchParams(
                  value ? { search: value } : {},
                  { replace: true }
                );
              }}
              placeholder="Search by item name or location"
              aria-label="Search found items"
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="absolute left-3 top-4 text-slate-400"
            />
            <select
              aria-label="Filter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4"
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value === "ALL" ? "All Categories" : value}
                </option>
              ))}
            </select>
          </div>

          <select
            aria-label="Filter item status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="AVAILABLE_FOR_COLLECTION">
              Available for Collection
            </option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>

        <p className="my-6 text-sm text-slate-500">
          {loading
            ? "Loading found items..."
            : `${filteredItems.length} item(s) found`}
        </p>

        {error && (
          <div role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <PackageSearch
              size={40}
              className="mx-auto text-slate-300"
            />
            <h2 className="mt-4 font-semibold">No matching items</h2>
            <p className="mt-2 text-sm text-slate-500">
              Try another keyword or filter.
            </p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const available =
              item.status === "AVAILABLE_FOR_COLLECTION" &&
              Boolean(item.received_at);

            return (
              <article
                key={item.item_id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex h-40 items-center justify-center bg-slate-100">
                  {item.photo_url ? (
                    <img
                      src={item.photo_url}
                      alt={item.item_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <PackageSearch
                      size={45}
                      className="text-slate-300"
                    />
                  )}
                </div>

                <div className="p-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>

                  <h2 className="mt-4 text-lg font-bold text-slate-900">
                    {item.item_name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.category}
                  </p>

                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} />
                    Found at {item.location}
                  </p>

                  
<div className="mt-4 rounded-xl bg-slate-50 p-3">
  <p className="text-xs font-medium text-slate-500">
    {item.status === "RETURNED"
      ? "Collection Point"
      : available
        ? "Confirmed Collection Point"
        : "Intended Collection Point"}
  </p>

  <p className="mt-1 text-sm font-semibold text-slate-900">
    {item.collection_point?.point_name ?? "Not assigned"}
  </p>

  {item.status === "RETURNED" ? (
    <p className="mt-1 text-xs font-medium text-green-700">
      Already returned to owner
    </p>
  ) : available ? (
    <p className="mt-1 text-xs font-medium text-green-700">
      Ready for collection
    </p>
  ) : (
    <p className="mt-1 text-xs text-amber-700">
      Not confirmed ready for collection
    </p>
  )}
</div>


                  <Link
                    to={`/items/${item.item_id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
