
import { Link } from "react-router";
import { LockKeyhole } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          {/* Branding */}
          <div>
            <h3 className="text-lg font-bold text-blue-700">
              FTMK Lost & Found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Helping FTMK students reconnect with their
              lost belongings.
            </p>
          </div>

          {/* Footer Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600"
          >
            <Link
              to="/"
              className="transition hover:text-blue-700"
            >
              Home
            </Link>

            <Link
              to="/browse"
              className="transition hover:text-blue-700"
            >
              Browse Items
            </Link>

            <Link
              to="/report-lost"
              className="transition hover:text-blue-700"
            >
              Report Lost
            </Link>

            <Link
              to="/report-found"
              className="transition hover:text-blue-700"
            >
              Report Found
            </Link>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-blue-700"
            >
              <LockKeyhole size={14} />
              Admin Login
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} FTMK Lost & Found.
          Student project at Universiti Teknikal Malaysia Melaka.
        </div>
      </div>
    </footer>
  );
}
