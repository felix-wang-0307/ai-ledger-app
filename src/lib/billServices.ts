// lib/billService.ts

import { supabase } from './db';
import { IBill } from '@/types/bill';

// Create a new bill
export async function createBill(bill: Omit<IBill, 'id' | 'created_at'>): Promise<IBill | null> {
  const { data, error } = await supabase
    .from('bills')
    .insert(bill)
    .select()
    .single();

  if (error) {
    console.error('Error creating bill:', error);
    return null;
  }

  return data;
}

// Retrieve bills for a specific user
export async function getBills(userId: string): Promise<IBill[] | null> {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', userId)
    .order('bill_date', { ascending: false });

  if (error) {
    console.error('Error fetching bills:', error);
    return null;
  }

  return data;
}

// Update an existing bill
export async function updateBill(billId: string, updates: Partial<IBill>): Promise<IBill | null> {
  const { data, error } = await supabase
    .from('bills')
    .update(updates)
    .eq('id', billId)
    .select()
    .single();

  if (error) {
    console.error('Error updating bill:', error);
    return null;
  }

  return data;
}

// Delete a bill
export async function deleteBill(billId: string): Promise<boolean> {
  const { error } = await supabase
    .from('bills')
    .delete()
    .eq('id', billId);

  if (error) {
    console.error('Error deleting bill:', error);
    return false;
  }

  return true;
}
