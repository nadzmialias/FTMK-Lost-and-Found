import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

import {
  Search,
  SlidersHorizontal,
  PackageSearch,
  RefreshCw,
  MapPin,
  CalendarDays,
  Package,
} from "lucide-react";

import { getFoundItems } from "../services/itemServices";
import type { DatabaseItem } from "../types/item";

const categories = [
  "All Categories",
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
  "All Locations",
  "FTMK Computer Lab",
  "FTMK Lecture Hall",
  "FTMK Cafeteria",
  "FTMK Library",
  "FTMK Lobby",
  "FTMK Corridor",
  "FTMK Parking Area",
  "Other Location",
];

const statuses = [
  "All Statuses",
  "REPORTED",
  "CLAIM_REQUESTED",
  "RETURNED",
];

function formatStatus(status: string) {
  switch (status) {
    case "CLAIM_REQUESTED":
      return "Claim Requested";
    case "RETURNED":
      return "Returned";
    default:
      return "Reported";
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "RETURNED":
      return "bg-slate-100 text-slate-600";

    case "CLAIM_REQUESTED":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-green-50 text-green-700";
  }
}

export default function BrowseItemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";

  const [category, setCategory] = useState(
    "All Categories"
  );

  const [location, setLocation] = useState(
    "All Locations"
  );

  const [status, setStatus] = useState(
    "All Statuses"
  );


  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getFoundItems();
      setItems(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function fetchItems() {
      try {
        const result = await getFoundItems();

        if (active) {
          setItems(result);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load items."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchItems();

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.item_name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword);

      const matchesCategory =
        category === "All Categories" ||
        item.category === category;

      const matchesLocation =
        location === "All Locations" ||
        item.location === location;

      const matchesStatus =
        status === "All Statuses" ||
        item.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesStatus
      );
    });
  }, [items, search, category, location, status]);

  const clearFilters = () => {
  setCategory("All Categories");
  setLocation("All Locations");
  setStatus("All Statuses");
  setSearchParams({});
};

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <PackageSearch size={16} />
            Lost & Found Directory
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Browse Found Items
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Looking for something you've lost?
            Explore items reported by students at FTMK.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Search & Filter Panel */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal
              size={20}
              className="text-blue-700"
            />

            <h2 className="font-semibold text-slate-900">
              Search & Filter
            </h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => {
                const value = e.target.value;

                setSearchParams(
                  value ? { search: value } : {},
                  { replace: true }
                );
              }}
              placeholder="Search items by name, description, or location..."
              aria-label="Search found items"
              className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
          </div>

          {/* Filters */}
          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {/* Category */}
            <div>
              <label
                htmlFor="categoryFilter"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Category
              </label>

              <select
                id="categoryFilter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                {categories.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="locationFilter"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Location
              </label>

              <select
                id="locationFilter"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                {locations.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="statusFilter"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Status
              </label>

              <select
                id="statusFilter"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                {statuses.map((value) => (
                  <option key={value} value={value}>
                    {value === "CLAIM_REQUESTED"
                      ? "Claim Requested"
                      : value === "REPORTED"
                      ? "Reported"
                      : value === "RETURNED"
                      ? "Returned"
                      : value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </section>

        {/* Results Header */}
        <div className="mb-6 mt-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Found Items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading items..."
                : `${filteredItems.length} item(s) found`}
            </p>
          </div>

          <button
            type="button"
            onClick={loadItems}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-60 flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

            <p className="mt-5 text-sm text-slate-500">
              Loading found items...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <h3 className="font-semibold text-red-800">
              Unable to Load Items
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadItems}
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">

            <PackageSearch
              size={52}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              No Found Items
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              No items match your current search or filters.
              Try using different keywords or clearing the filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Item Grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredItems.map((item) => (
              <article
                key={item.item_id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg"
              >

                {/* Image */}
                <div className="flex h-48 items-center justify-center bg-slate-100">
                  {item.photo_url ? (
                    <img
                      src={item.photo_url}
                      alt={item.item_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package
                      size={52}
                      className="text-slate-300"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {item.category}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {formatStatus(item.status)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.item_name}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 space-y-3 text-sm text-slate-500">

                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>{item.item_date}</span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-xs text-slate-400">
                      Reference: {item.reference_code}
                    </p>

                    <Link
                      to={`/items/${item.item_id}`}
                      className="mt-3 inline-flex items-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      View Details & Claim
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}