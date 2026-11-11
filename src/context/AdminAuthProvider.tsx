
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { supabase } from "../services/supabaseClient";
import { getAdminItems } from "../services/adminService";
import { AdminAuthContext } from "./adminAuthContext";

interface AdminAuthProviderProps {
  children: ReactNode;
}

interface AdminCheck {
  token: string;
  isAdmin: boolean;
}

export default function AdminAuthProvider({
  children,
}: AdminAuthProviderProps) {
  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [initialized, setInitialized] = useState(false);

  const [adminCheck, setAdminCheck] =
    useState<AdminCheck | null>(null);

  // Listen for initial session, login, logout,
  // and token refresh.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAccessToken(session?.access_token ?? null);
        setInitialized(true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Verify the admin role using the existing
  // protected admin Edge Function.
  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function verifyAdmin() {
      try {
        const result = await getAdminItems();

        if (!cancelled) {
          setAdminCheck({
            token: accessToken!,
            isAdmin: result.profile?.role === "ADMIN",
          });
        }
      } catch {
        if (!cancelled) {
          setAdminCheck({
            token: accessToken!,
            isAdmin: false,
          });
        }
      }
    }

    void verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const isAdmin =
    Boolean(accessToken) &&
    adminCheck?.token === accessToken &&
    adminCheck?.isAdmin === true;

  const loading =
    !initialized ||
    Boolean(
      accessToken &&
      adminCheck?.token !== accessToken
    );

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        isSignedIn: Boolean(accessToken),
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}