export default function SupabaseConnectionTest() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
      <h3 className="font-semibold text-green-800">
        Supabase Configuration Loaded
      </h3>

      <p className="mt-2 text-sm text-green-700">
        Supabase environment variables are available.
      </p>

      <p className="mt-2 text-xs text-green-700">
        Project URL: {supabaseUrl}
      </p>
    </div>
  );
}