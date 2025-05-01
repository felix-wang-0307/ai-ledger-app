export interface IBill {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  category?: string;
  description?: string;
  bill_date?: string; // ISO date
  image_url?: string;
  created_at: string;
}
