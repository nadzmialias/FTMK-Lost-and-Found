
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  CalendarDays,
  Check,
  Copy,
  MapPin,
  PackageSearch,
  Search,
} from "lucide-react";

import {
  getPublicLostItems,
  type PublicLostItem,
} from "../services/publicLostItemService";

export default function LostItemsPage() {
  const [items, setItems] = useState<PublicLostItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getPublicLostItems()
      .then((data) => {
        if (active) {
          setItems(data);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load items."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Category filter
  const categories = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(items.map((item) => item.category))
      ),
    ],
    [items]
  );

  // Search and filter lost reports
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.item_name,
          item.category,
          item.description,
          item.location,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "ALL" ||
        item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
            <PackageSearch size={18} />
            Lost & Found Directory
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Browse Lost Items
          </h1>

          <p className="mt-3 text-slate-500">
            Found something? Check whether another
            student has reported losing it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {/* SEARCH AND FILTER */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                type="search"
                aria-label="Search lost items"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search lost items..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-600"
              />
            </div>

            <select
              aria-label="Filter category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-xl border border-slate-200 px-4 py-3"
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value === "ALL"
                    ? "All Categories"
                    : value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ITEM COUNT */}
        <p className="my-6 text-sm text-slate-500">
          {loading
            ? "Loading lost items..."
            : `${filteredItems.length} item(s) found`}
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl bg-red-50 p-5 text-red-700"
          >
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          filteredItems.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <PackageSearch
                size={40}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 font-semibold">
                No Matching Lost Items
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                There are no public reports matching
                your search. You can still submit a
                found-item report.
              </p>
            </div>
          )}

        {/* LOST ITEM CARDS */}
        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              return (
                <article
                  key={item.item_id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Lost
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-slate-900">
                    {item.item_name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.category}
                  </p>

                  {/* LOCATION */}
                  <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} />
                    Last seen: {item.location}
                  </p>

                  {/* DATE */}
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays size={16} />
                    Date lost: {item.item_date}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  {/* OWNER CONTACT */}
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="mb-3 text-xs font-medium text-slate-500">
                      Public Owner Contact
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={item.contact_detail}
                        onFocus={(e) => e.target.select()}
                        aria-label={`Owner contact for ${item.item_name}`}
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(item.contact_detail);
                            setCopiedId(item.item_id);
                          } catch {
                            setCopiedId(null);
                            window.alert("Unable to copy automatically. Select the contact detail to copy it manually.");
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-slate-50"
                        aria-label={`Copy contact for ${item.item_name}`}
                      >
                        {copiedId === item.item_id ? <Check size={16} /> : <Copy size={16} />}
                        {copiedId === item.item_id ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* REPORT FOUND ITEM */}
        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="font-semibold text-blue-900">
            Found an item that is not listed?
          </h2>

          <p className="mt-2 text-sm text-blue-800">
            You can submit a Found Item report so the
            item can be recorded and handed in at a
            designated collection point.
          </p>

          <Link
            to="/report-found"
            className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Report a Found Item
          </Link>
        </div>
      </section>
    </main>
  );
}
