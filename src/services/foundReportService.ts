
import { supabase } from "./supabaseClient";

export interface CollectionPoint {
  collection_point_id: string;
  point_name: string;
  description: string | null;
  location_description: string | null;
}

export interface FoundReportInput {
  itemName: string;
  category: string;
  description: string;
  location: string;
  itemDate: string;
  collectionPointId: string;
}

export interface FoundReportResult {
  success: boolean;
  referenceCode: string;
  status: "REPORTED";
}

export async function getCollectionPoints() {
  const { data, error } = await supabase
    .from("collection_points")
    .select(
      "collection_point_id, point_name, description, location_description"
    )
    .eq("is_active", true)
    .order("point_name");

  if (error) {
    throw new Error("Unable to load collection points.");
  }

  return (data ?? []) as CollectionPoint[];
}


export async function submitFoundReport(
  input: FoundReportInput,
  photo: File | null
): Promise<FoundReportResult> {
  const formData = new FormData();

  formData.append("itemName", input.itemName);
  formData.append("category", input.category);
  formData.append("description", input.description);
  formData.append("location", input.location);
  formData.append("itemDate", input.itemDate);
  formData.append(
    "collectionPointId",
    input.collectionPointId
  );

  if (photo) {
    formData.append("photo", photo);
  }

  const { data, error } =
    await supabase.functions.invoke<FoundReportResult>(
      "submit-found-item-v3",
      {
        body: formData,
      }
    );

  if (error) {
    const context = (
      error as { context?: unknown }
    ).context;

    let message = "Unable to submit the report.";

    if (context instanceof Response) {
      const response = await context
        .clone()
        .json()
        .catch(() => null);

      if (
        response &&
        typeof response.error === "string"
      ) {
        message = response.error;
      }
    }

    throw new Error(message);
  }

  if (!data?.success || !data.referenceCode) {
    throw new Error(
      "Report submission was not confirmed."
    );
  }

  return data;
}

