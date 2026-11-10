
import { supabase } from "./supabaseClient";

export type AdminItemStatus =
  | "REPORTED"
  | "AVAILABLE_FOR_COLLECTION"
  | "RETURNED"
  | "CLAIM_REQUESTED";

export interface AdminItem {
  item_id: string;
  reference_code: string;
  item_name: string;
  category: string;
  location: string;
  status: AdminItemStatus;
  created_at: string;
  received_at: string | null;
  returned_at: string | null;
  collection_point: {
    point_name: string;
  } | null;
}

export interface AdminProfile {
  full_name: string;
  role: "ADMIN";
}

interface AdminResponse {
  success: boolean;
  profile?: AdminProfile;
  items?: AdminItem[];
  message?: string;
  error?: string;
}

async function adminRequest(
  body: Record<string, string>
): Promise<AdminResponse> {
  const { data: sessionData } =
    await supabase.auth.getSession();

  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  const { data, error } =
    await supabase.functions.invoke<AdminResponse>(
      "admin-items",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }
    );

  if (error) {
    console.error("Admin API error:", error);
    throw new Error(
      "Admin request failed. Please check your session or item status."
    );
  }

  if (!data?.success) {
    throw new Error(data?.error ?? "Admin request failed.");
  }

  return data;
}

export async function getAdminItems() {
  const result = await adminRequest({ action: "LIST" });

  return {
    items: result.items ?? [],
    profile: result.profile!,
  };
}

export async function updateAdminItem(
  itemId: string,
  action: "RECEIVE" | "RETURN"
) {
  return adminRequest({ action, itemId });
}
