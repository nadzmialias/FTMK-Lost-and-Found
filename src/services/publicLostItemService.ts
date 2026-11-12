
import { supabase } from "./supabaseClient";

export interface PublicLostItem {
  item_id: string;
  item_name: string;
  category: string;
  description: string;
  location: string;
  item_date: string;
  contact_detail: string;
  created_at: string;
}

interface LostItemsResponse {
  success: boolean;
  items?: PublicLostItem[];
  error?: string;
}

export async function getPublicLostItems():
  Promise<PublicLostItem[]> {
  const { data, error } =
    await supabase.functions.invoke<LostItemsResponse>(
      "public-lost-items-v1",
      {
        body: {},
      }
    );

  if (error) {
    throw new Error(
      "Unable to load lost items. Please try again."
    );
  }

  if (!data?.success || !Array.isArray(data.items)) {
    throw new Error(
      data?.error ?? "Unable to retrieve lost items."
    );
  }

  return data.items;
}