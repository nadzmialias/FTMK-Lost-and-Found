
import { supabase } from "./supabaseClient";

export type FoundItemStatus =
  | "REPORTED"
  | "AVAILABLE_FOR_COLLECTION"
  | "RETURNED"
  | "CLAIM_REQUESTED"; // Legacy records only

export interface PublicCollectionPoint {
  collection_point_id: string;
  point_name: string;
  location_description: string | null;
  description: string | null;
}

export interface PublicFoundItem {
  item_id: string;
  reference_code: string;
  report_type: "FOUND";
  item_name: string;
  category: string;
  description: string | null;
  location: string;
  item_date: string;
  photo_url: string | null;
  status: FoundItemStatus;
  created_at: string;
  received_at: string | null;
  collection_point: PublicCollectionPoint | null;
}

interface ListResponse {
  success: boolean;
  items?: PublicFoundItem[];
  error?: string;
}

interface DetailResponse {
  success: boolean;
  item?: PublicFoundItem;
  error?: string;
}

async function invokePublicItems(
  body: Record<string, string> = {}
) {
  const { data, error } = await supabase.functions.invoke(
    "public-found-items-v2",
    { body }
  );

  if (error) {
    console.error("Public items request failed:", error);
    throw new Error(
      "Unable to load found items. Please try again."
    );
  }

  return data;
}

export async function getPublicFoundItems():
  Promise<PublicFoundItem[]> {
  const data = (await invokePublicItems()) as ListResponse;

  if (!data?.success || !Array.isArray(data.items)) {
    throw new Error(data?.error ?? "Unable to load items.");
  }

  return data.items;
}

export async function getPublicFoundItem(
  itemId: string
): Promise<PublicFoundItem> {
  const data = (await invokePublicItems({
    itemId,
  })) as DetailResponse;

  if (!data?.success || !data.item) {
    throw new Error(data?.error ?? "Item not found.");
  }

  return data.item;
}
