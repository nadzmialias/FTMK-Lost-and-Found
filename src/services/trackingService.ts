
import { supabase } from "./supabaseClient";

export type ItemStatus =
  | "REPORTED"
  | "CLAIM_REQUESTED"
  | "RETURNED";

export interface TrackedItem {
  reference_code: string;
  report_type: "LOST" | "FOUND";
  item_name: string;
  category: string;
  location: string;
  item_date: string;
  status: ItemStatus;
  created_at: string;
}

export interface StatusHistory {
  history_id: string;
  previous_status: ItemStatus | null;
  new_status: ItemStatus;
  changed_at: string;
}

interface TrackingResponse {
  success: boolean;
  item?: TrackedItem;
  history?: StatusHistory[];
  error?: string;
}

export interface TrackingResult {
  item: TrackedItem;
  history: StatusHistory[];
}

export async function trackItem(
  referenceCode: string
): Promise<TrackingResult> {
  const { data, error } =
    await supabase.functions.invoke<TrackingResponse>(
      "track-item",
      {
        body: {
          referenceCode:
            referenceCode.trim().toUpperCase(),
        },
      }
    );

  if (error) {
    const response = (
      error as { context?: Response }
    ).context;

    if (response instanceof Response) {
      const details = await response
        .clone()
        .json()
        .catch(() => null);

      if (response.status === 404) {
        throw new Error(
          "Reference code not found. Please check your code."
        );
      }

      if (response.status === 400) {
        throw new Error(
          "Invalid reference code format."
        );
      }

      console.error(
        "Tracking function HTTP error:",
        response.status
      );

      throw new Error(
        details?.error ?? "Unable to track item."
      );
    }

    throw new Error(
      "Unable to connect to the tracking service."
    );
  }

  if (
    !data?.success ||
    !data.item ||
    !Array.isArray(data.history)
  ) {
    throw new Error(
      data?.error ?? "Invalid tracking response."
    );
  }

  return {
    item: data.item,
    history: data.history,
  };
}
