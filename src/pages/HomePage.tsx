import { useState } from "react";
import { Link, useNavigate } from "react-router";
import SupabaseConnectionTest from "../components/SupabaseConnectionTest";

import {
  Search,
  ArrowRight,
  PackageSearch,
  ClipboardPlus,
  ShieldCheck,
  MapPin,
} from "lucide-react";

import ItemCard from "../components/ItemCard";
import { sampleItems } from "../data/sampleItems";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const recentItems = sampleItems.slice(0, 3);

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
              to="/report-found"
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
              Browse items recently reported by students.
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
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
                  "Submit details about an item you've lost or found at FTMK.",
              },
              {
                icon: Search,
                number: "02",
                title: "Search & Discover",
                description:
                  "Browse reported items and search by category, keyword, or location.",
              },
              {
                icon: ShieldCheck,
                number: "03",
                title: "Claim & Recover",
                description:
                  "Verify ownership, request a claim, and track the return status.",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <step.icon size={30} className="text-blue-700" />
                </div>

                <span className="text-sm font-bold text-blue-700">
                  STEP {step.number}
                </span>

                <h3 className="mt-3 text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>
<SupabaseConnectionTest />
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