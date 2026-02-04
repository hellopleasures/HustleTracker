'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { IncomeEntryWithHustle, DashboardStats } from '@/types/database';
import { startOfMonth, endOfMonth, format } from 'date-fns';

const incomeEntrySchema = z.object({
  hustleId: z.string().uuid('Invalid hustle'),
  amount: z.coerce.number().positive('Amount must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  note: z.string().max(500, 'Note too long').optional(),
});

export async function createIncomeEntry(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const result = incomeEntrySchema.safeParse({
    hustleId: formData.get('hustleId'),
    amount: formData.get('amount'),
    date: formData.get('date'),
    note: formData.get('note') || undefined,
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { hustleId, amount, date, note } = result.data;

  const { data, error } = await supabase
    .from('income_entries')
    .insert({
      user_id: user.id,
      hustle_id: hustleId,
      amount,
      date,
      note: note || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/history');
  revalidatePath('/log');
  return { data };
}

export async function getIncomeEntries(filters?: {
  hustleId?: string;
  month?: string; // YYYY-MM format
}): Promise<IncomeEntryWithHustle[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  let query = supabase
    .from('income_entries')
    .select(`
      *,
      hustle:hustles(name, color)
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (filters?.hustleId) {
    query = query.eq('hustle_id', filters.hustleId);
  }

  if (filters?.month) {
    const [year, month] = filters.month.split('-').map(Number);
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));
    query = query
      .gte('date', format(start, 'yyyy-MM-dd'))
      .lte('date', format(end, 'yyyy-MM-dd'));
  }

  const { data } = await query;

  return (data || []) as IncomeEntryWithHustle[];
}

export async function updateIncomeEntry(entryId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const updates: Record<string, unknown> = {};

  const hustleId = formData.get('hustleId');
  const amount = formData.get('amount');
  const date = formData.get('date');
  const note = formData.get('note');

  if (hustleId) updates.hustle_id = hustleId;
  if (amount) updates.amount = parseFloat(amount as string);
  if (date) updates.date = date;
  if (note !== null) updates.note = note || null;

  const { error } = await supabase
    .from('income_entries')
    .update(updates)
    .eq('id', entryId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/history');
  return { success: true };
}

export async function deleteIncomeEntry(entryId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('income_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/history');
  return { success: true };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      monthlyTotal: 0,
      monthlyGoal: 0,
      goalProgress: 0,
      topHustles: [],
      recentEntries: [],
    };
  }

  const now = new Date();
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

  // Get profile for monthly goal
  const { data: profile } = await supabase
    .from('profiles')
    .select('monthly_goal, currency')
    .eq('id', user.id)
    .single();

  const monthlyGoal = profile?.monthly_goal || 0;

  // Get monthly income entries with hustle info
  const { data: entries } = await supabase
    .from('income_entries')
    .select(`
      *,
      hustle:hustles(name, color)
    `)
    .eq('user_id', user.id)
    .gte('date', monthStart)
    .lte('date', monthEnd)
    .order('date', { ascending: false });

  const typedEntries = (entries || []) as IncomeEntryWithHustle[];

  // Calculate monthly total
  const monthlyTotal = typedEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);

  // Calculate goal progress
  const goalProgress = monthlyGoal > 0 ? (monthlyTotal / monthlyGoal) * 100 : 0;

  // Calculate top hustles
  const hustleTotals = new Map<string, { name: string; total: number; color: string }>();
  typedEntries.forEach((entry) => {
    const existing = hustleTotals.get(entry.hustle_id);
    if (existing) {
      existing.total += Number(entry.amount);
    } else {
      hustleTotals.set(entry.hustle_id, {
        name: entry.hustle.name,
        total: Number(entry.amount),
        color: entry.hustle.color,
      });
    }
  });

  const topHustles = Array.from(hustleTotals.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  // Get recent entries (last 5)
  const recentEntries = typedEntries.slice(0, 5);

  return {
    monthlyTotal,
    monthlyGoal,
    goalProgress,
    topHustles,
    recentEntries,
  };
}
