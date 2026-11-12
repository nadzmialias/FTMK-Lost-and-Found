
import { supabase } from "./supabaseClient";

export interface LostReportInput {
  itemName: string;
  category: string;
  location: string;
  dateLost: string;
  description: string;
  contactDetail: string;
  publicContactConsent: boolean;
}

export interface LostReportResult {
  success: boolean;
  status: "REPORTED";
}

interface LostReportApiResponse {
  success?: boolean;
  status?: string;
  error?: string;
}

export async function submitLostReport(
  input: LostReportInput
): Promise<LostReportResult> {
  const { data, error } =
    await supabase.functions.invoke<LostReportApiResponse>(
      "submit-lost-item-v3",
      {
        body: input,
      }
    );

  if (error) {
    let message = "Unable to submit lost-item report.";

    const context = (
      error as { context?: unknown }
    ).context;

    if (context instanceof Response) {
      const response: unknown = await context
        .clone()
        .json()
        .catch(() => null);

      if (
        response &&
        typeof response === "object" &&
        "error" in response &&
        typeof response.error === "string"
      ) {
        message = response.error;
      }
    }

    throw new Error(message);
  }

  if (
    !data?.success ||
    data.status !== "REPORTED"
  ) {
    throw new Error(
      data?.error ??
        "Report submission was not confirmed."
    );
  }

  return {
    success: true,
    status: "REPORTED",
  };
}
