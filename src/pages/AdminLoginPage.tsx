
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  LockKeyhole,
  LogIn,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../services/supabaseClient";
import { getAdminItems } from "../services/adminService";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw new Error("Invalid email or password.");
      }

      // Verify the account has an authorized ADMIN profile.
      try {
        await getAdminItems();
      } catch {
        await supabase.auth.signOut();
        throw new Error(
          "This account does not have administrator access."
        );
      }

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <LockKeyhole size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Administrator Login
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Sign in using your authorized FTMK Lost &
            Found administrator account.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="adminEmail"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="adminEmail"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="adminPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <input
                id="adminPassword"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              <LogIn size={18} />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-7 flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
            <ShieldCheck
              size={17}
              className="shrink-0 text-slate-600"
            />
            This login is for authorized administrators
            only. Students can use the public website
            without signing in.
          </div>
        </div>
      </div>
    </main>
  );
}
