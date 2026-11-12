import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import {
  Search,
  ArrowRight,
  PackageSearch,
  ClipboardPlus,
  ShieldCheck,
  MapPin,
  LoaderCircle,
  ImageOff,
} from "lucide-react";

import {
  getPublicFoundItems,
  type PublicFoundItem,
} from "../services/publicItemServices";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  
const [recentItems, setRecentItems] = useState<PublicFoundItem[]>([]);
const [loadingItems, setLoadingItems] = useState(true);
const [itemsError, setItemsError] = useState("");

useEffect(() => {
  let active = true;

  async function loadRecentItems() {
    try {
      const items = await getPublicFoundItems();

      if (!active) return;

      setRecentItems(items.slice(0, 3));
      setItemsError("");
    } catch (error) {
      if (!active) return;

      setItemsError(
        error instanceof Error
          ? error.message
          : "Unable to load recently found items."
      );
    } finally {
      if (active) {
        setLoadingItems(false);
      }
    }
  }

  void loadRecentItems();

  return () => {
    active = false;
  };
}, []);


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = searchQuery.trim();

    navigate(
      query
        ? `/browse?search=${encodeURIComponent(query)}`
        : "/browse"
    );
  };

  return (
    <main className="bg-slate-50">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-50 to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center md:py-32">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700">
            <MapPin size={15} />
            Digital Campus @ FTMK, UTeM
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-7xl">
            Lost Something?
            <br />
            <span className="text-blue-700">
              Let's Find It.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-600">
            A simple and convenient platform for FTMK students
            to report lost belongings, find missing items,
            and help return them to their rightful owners.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              to="/report-lost"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-4 font-semibold text-white transition hover:bg-blue-800"
            >
              <PackageSearch size={20} />
              I Lost Something
            </Link>

            <Link
  to="/lost-items"
  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-800 transition hover:bg-slate-100"
>
  <ClipboardPlus size={20} />
  I Found Something
</Link>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-14 flex max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50"
          >
            <Search className="ml-4 shrink-0 text-slate-400" size={22} />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for lost items..."
              aria-label="Search found items"
              className="min-w-0 flex-1 border-none bg-transparent py-3 text-sm text-slate-700 outline-none"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      
{/* RECENT ITEMS */}
<section className="mx-auto max-w-7xl px-6 py-20">
  <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h2 className="text-3xl font-bold text-slate-900">
        Recently Found Items
      </h2>

      <p className="mt-2 text-slate-500">
        Browse the latest items reported by students at FTMK.
      </p>
    </div>

    <Link
      to="/browse"
      className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
    >
      View All Items
      <ArrowRight size={18} />
    </Link>
  </div>

  {/* LOADING */}
  {loadingItems && (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-12 text-slate-500">
      <LoaderCircle
        size={23}
        className="animate-spin text-blue-700"
      />
      Loading recently found items...
    </div>
  )}

  {/* ERROR */}
  {!loadingItems && itemsError && (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
    >
      {itemsError}
    </div>
  )}

  {/* EMPTY STATE */}
  {!loadingItems &&
    !itemsError &&
    recentItems.length === 0 && (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
        <PackageSearch
          size={42}
          className="mx-auto text-slate-300"
        />

        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No Found Items Yet
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          New found-item reports will appear here.
        </p>

        <Link
          to="/report-found"
          className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
        >
          Report a Found Item
        </Link>
      </div>
    )}

  {/* REAL ITEMS */}
  {!loadingItems && !itemsError && (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recentItems.map((item) => {
        const available =
          item.status === "AVAILABLE_FOR_COLLECTION" &&
          Boolean(item.received_at);

        const returned = item.status === "RETURNED";

        return (
          <article
            key={item.item_id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            {/* ITEM IMAGE */}
            <div className="flex h-52 items-center justify-center bg-slate-100">
              {item.photo_url ? (
                <img
                  src={item.photo_url}
                  alt={item.item_name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImageOff size={40} />
                  <span className="text-xs">
                    No photo available
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* STATUS BADGE */}
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  returned
                    ? "bg-slate-100 text-slate-600"
                    : available
                      ? "bg-green-50 text-green-700"
                      : item.status === "CLAIM_REQUESTED"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-blue-50 text-blue-700"
                }`}
              >
                {returned
                  ? "Returned"
                  : available
                    ? "Available for Collection"
                    : item.status === "CLAIM_REQUESTED"
                      ? "Legacy Claim"
                      : "Reported"}
              </span>

              {/* ITEM NAME */}
              <h3 className="mt-4 line-clamp-1 text-xl font-bold text-slate-900">
                {item.item_name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {item.category}
              </p>

              {/* FOUND LOCATION */}
              <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-700"
                />

                <span className="line-clamp-2">
                  Found at {item.location}
                </span>
              </div>

              {/* COLLECTION POINT */}
              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">
                  {returned
                    ? "Collection Point"
                    : available
                      ? "Confirmed Collection Point"
                      : "Intended Collection Point"}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {item.collection_point?.point_name ??
                    "Not assigned"}
                </p>

                {returned ? (
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

              {/* DETAILS BUTTON */}
              <Link
                to={`/items/${item.item_id}`}
                className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
              >
                View Details
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  )}
</section>

      
{/* HOW IT WORKS */}
<section className="border-t border-slate-200 bg-white py-24">
  <div className="mx-auto max-w-7xl px-6">
    <div className="mb-14 text-center">
      <h2 className="text-3xl font-bold text-slate-900">
        How It Works
      </h2>

      <p className="mt-3 text-slate-500">
        Three simple steps to help recover lost belongings.
      </p>
    </div>

    <div className="grid gap-10 md:grid-cols-3">
      {[
        {
          icon: ClipboardPlus,
          number: "01",
          title: "Report an Item",
          description:
            "Report a lost or found item. Found items should be delivered to a designated collection point.",
        },
        {
          icon: Search,
          number: "02",
          title: "Search & Discover",
          description:
            "Browse found items, search by category or location, and check their collection status.",
        },
        {
          icon: ShieldCheck,
          number: "03",
          title: "Collect & Recover",
          description:
            "Visit the confirmed collection point. An administrator will verify ownership and handle the handover.",
        },
      ].map((step) => (
        <div key={step.number} className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <step.icon
              size={30}
              className="text-blue-700"
            />
          </div>

          <span className="text-sm font-bold text-blue-700">
            STEP {step.number}
          </span>

          <h3 className="mt-3 text-xl font-semibold text-slate-900">
            {step.title}
          </h3>

          <p className="mx-auto mt-3 max-w-xs leading-relaxed text-slate-500">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

    </main>
  );
}