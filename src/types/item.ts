export interface Item {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  status: "Reported" | "Claim Requested" | "Returned";
  image?: string;
}

export interface DatabaseItem {
  item_id: string;
  reference_code: string;
  item_name: string;
  category: string;
  description: string;
  location: string;
  item_date: string;
  photo_url: string | null;
  status: "REPORTED" | "CLAIM_REQUESTED" | "RETURNED";
  created_at: string;
}