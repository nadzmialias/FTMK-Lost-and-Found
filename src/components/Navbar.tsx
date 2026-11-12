
import { useState } from "react";
import { Link, NavLink } from "react-router";
import {
  Menu,
  X,
  Search,
  ShieldCheck,
} from "lucide-react";

import { useAdminAuth } from "../context/adminAuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin } = useAdminAuth();

  const links = [
    { label: "Home", path: "/" },
    { label: "Browse Items", path: "/browse" },
    { label: "Lost Items", path: "/lost-items" },
    { label: "Track Status", path: "/track" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
            <Search size={23} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              FTMK Lost & Found
            </h1>
            <p className="text-xs text-slate-500">
              Digital Campus @ UTeM
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-blue-700"
                    : "text-slate-600 hover:text-blue-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 text-sm font-semibold transition ${
                  isActive
                    ? "text-blue-700"
                    : "text-green-700 hover:text-green-800"
                }`
              }
            >
              <ShieldCheck size={18} />
              Admin Dashboard
            </NavLink>
          )}

          <Link
            to="/report-found"
            className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Report Item
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-green-700"
              >
                <ShieldCheck size={18} />
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/report-found"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Report Item
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}