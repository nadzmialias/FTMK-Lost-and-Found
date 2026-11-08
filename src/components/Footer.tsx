import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-col justify-between gap-6 md:flex-row">

          <div>
            <h3 className="text-lg font-bold text-blue-700">
              FTMK Lost & Found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Helping FTMK students reconnect with their lost belongings.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-600">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse Items</Link>
            <Link to="/report-lost">Report Lost</Link>
            <Link to="/report-found">Report Found</Link>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} FTMK Lost & Found.
          Student project at Universiti Teknikal Malaysia Melaka.
        </div>
      </div>
    </footer>
  );
}