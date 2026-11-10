import {
  FunctionsHttpError,
  FunctionsFetchError,
  FunctionsRelayError,
} from "@supabase/supabase-js";

import { supabase } from "./supabaseClient";
import type { DatabaseItem } from "../types/item";

interface FoundItemsResponse {
  success: boolean;
  items: DatabaseItem[];
  error?: string;
}

export async function getFoundItems(): Promise<DatabaseItem[]> {
  const { data, error } =
    await supabase.functions.invoke<FoundItemsResponse>(
      "get-found-items",
      {
        body: {},
      }
    );

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const status = error.context.status;

      const responseBody = await error.context
        .clone()
        .text()
        .catch(() => "");

      console.error("Edge Function HTTP Error:", {
        status,
        responseBody,
      });

      throw new Error(
        `Unable to load items. Server returned ${status}.`
      );
    }

    if (error instanceof FunctionsFetchError) {
      console.error("Network Error:", error.message);

      throw new Error(
        "Could not connect to Supabase."
      );
    }

    if (error instanceof FunctionsRelayError) {
      console.error("Relay Error:", error.message);

      throw new Error(
        "Unable to reach the Edge Function."
      );
    }

    throw new Error(error.message);
  }

  if (!data?.success || !Array.isArray(data.items)) {
    console.error("Unexpected response:", data);

    throw new Error(
      data?.error || "Invalid response from Supabase."
    );
  }

  console.log("Found items loaded:", data.items.length);

  return data.items;
}