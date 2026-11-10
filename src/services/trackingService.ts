
import { supabase } from "./supabaseClient";

export type ItemStatus =
  | "REPORTED"
  | "AVAILABLE_FOR_COLLECTION"
  | "RETURNED"
  | "CLAIM_REQUESTED";

export interface TrackedItem {
  reference_code: string;
  report_type: "FOUND" | "LOST";
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

export interface TrackingResult {
  item: TrackedItem;
  history: StatusHistory[];
}

interface TrackingResponse {
  success?: boolean;
  item?: TrackedItem;
  history?: StatusHistory[];
  error?: string;
}

export async function trackItem(
  referenceCode: string
): Promise<TrackingResult> {
  const code = referenceCode.trim().toUpperCase();

  if (!/^FTMK-[FL]-[A-F0-9]{12}$/.test(code)) {
    throw new Error("Invalid reference code format.");
  }

  const { data, error } =
    await supabase.functions.invoke<TrackingResponse>(
      "track-item",
      {
        body: { referenceCode: code },
      }
    );

  if (error) {
    const context = (
      error as { context?: unknown }
    ).context;

    if (context instanceof Response) {
      if (context.status === 404) {
        throw new Error(
          "Reference code not found. Please check the code."
        );
      }

      if (context.status === 400) {
        throw new Error("Invalid reference code format.");
      }
    }

    throw new Error(
      "Unable to retrieve tracking information."
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
