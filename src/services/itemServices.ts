import { supabase } from "./supabaseClient";
import type { DatabaseItem } from "../types/item";

interface FoundItemsResponse {
  success: boolean;
  items: DatabaseItem[];
  error?: string;
}

export async function getFoundItems(): Promise<DatabaseItem[]> {
  const { data, error } = await supabase.functions.invoke<
    FoundItemsResponse
  >("get-found-items", {
    body: {},
  });

  if (error) {
    throw new Error(
      "Unable to load found items. Please try again."
    );
  }

  if (!data?.success || !Array.isArray(data.items)) {
    throw new Error(
      data?.error || "Invalid response from server."
    );
  }

  return data.items;
}