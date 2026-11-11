
import { createContext, useContext } from "react";

export interface AdminAuthContextValue {
  isAdmin: boolean;
  isSignedIn: boolean;
  loading: boolean;
}

export const AdminAuthContext =
  createContext<AdminAuthContextValue | null>(null);

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider."
    );
  }

  return context;
}