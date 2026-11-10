
import { supabase } from "./supabaseClient";

export type ItemStatus =
  | "REPORTED"
  | "CLAIM_REQUESTED"
  | "RETURNED";

export type ClaimStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type ManagementAction =
  | "VIEW"
  | "APPROVE"
  | "REJECT"
  | "RETURN";

export interface ManagedClaim {
  claim_id: string;
  status: ClaimStatus;
  created_at: string;
  reviewed_at: string | null;
}

export interface ManagedItem {
  reference_code: string;
  item_name: string;
  category: string;
  location: string;
  status: ItemStatus;
  created_at: string;
}

export interface ManagementResponse {
  success: boolean;
  message?: string;
  error?: string;
  item?: ManagedItem;
  claims?: ManagedClaim[];
  status?: string;
}

export async function manageFoundClaim(
  referenceCode: string,
  token: string,
  action: ManagementAction
): Promise<ManagementResponse> {
  const { data, error } =
    await supabase.functions.invoke<ManagementResponse>(
      "manage-found-claim",
      {
        body: {
          referenceCode,
          token,
          action,
        },
      }
    );

  if (error) {
    throw new Error(
      "Unable to complete the request. Check your private link or try again."
    );
  }

  if (!data?.success) {
    throw new Error(
      data?.error || "Management operation failed."
    );
  }

  return data;
}
