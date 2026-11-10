import { supabase } from "./supabaseClient";

import type {
  FoundItemDetails,
  ClaimSubmissionResponse,
} from "../types/item";

interface ItemResponse {
  success: boolean;
  item?: FoundItemDetails;
  error?: string;
}

export async function getFoundItemDetails(
  itemId: string
): Promise<FoundItemDetails> {
  const { data, error } =
    await supabase.functions.invoke<ItemResponse>(
      "get-found-item",
      {
        body: { itemId },
      }
    );

  if (error) {
    throw new Error(
      "Unable to load item details. Please try again."
    );
  }

  if (!data?.success || !data.item) {
    throw new Error(data?.error || "Item not found.");
  }

  return data.item;
}

export async function submitOwnershipClaim(
  itemId: string,
  answer: string
): Promise<ClaimSubmissionResponse> {
  const { data, error } =
    await supabase.functions.invoke<ClaimSubmissionResponse>(
      "submit-claim",
      {
        body: {
          itemId,
          answer,
        },
      }
    );

  if (error) {
    throw new Error(
      "Unable to submit your claim. Check the server logs if this continues."
    );
  }

  if (!data?.success) {
    throw new Error(
      data?.error || "Ownership claim failed."
    );
  }

  return data;
}
