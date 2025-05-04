// The full bill returned from the database
export interface IBill {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  category?: string;
  subcategory?: string;
  description?: string;
  bill_date?: string; // ISO date
  image_url?: string;
  created_at: string;
}

// Input when creating a bill (client → API)
export interface NewBillDTO {
  amount: number;
  currency: string;
  category?: string;
  description?: string;
  bill_date?: string;
  image_url?: string;
  user_id: string;
}

// Input when updating a bill
export type UpdateBillDTO = Partial<Omit<NewBillDTO, 'user_id'>>;
