'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import type { Hustle } from '@/types/database';

export type HustleWithStats = Hustle & {
  monthlyTotal: number;
  allTimeTotal: number;
  entryCount: number;
};

const hustleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  category: z.string().default('other'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
});

export async function createHustle(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const result = hustleSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category') || 'other',
    color: formData.get('color') || '#6366f1',
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, category, color } = result.data;

  const { data, error } = await supabase
    .from('hustles')
    .insert({
      user_id: user.id,
      name,
      category,
      color,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: 'You already have a hustle with this name' };
    }
    return { error: error.message };
  }

  revalidatePath('/hustles');
  revalidatePath('/log');
  revalidatePath('/dashboard');
  return { data };
}

export async function getHustles(): Promise<Hustle[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from('hustles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('name');

  return (data || []) as Hustle[];
}

export async function updateHustle(hustleId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const updates: Record<string, unknown> = {};

  const name = formData.get('name');
  const category = formData.get('category');
  const color = formData.get('color');
  const isActive = formData.get('isActive');

  if (name) updates.name = name;
  if (category) updates.category = category;
  if (color) updates.color = color;
  if (isActive !== null) updates.is_active = isActive === 'true';

  const { error } = await supabase
    .from('hustles')
    .update(updates)
    .eq('id', hustleId)
    .eq('user_id', user.id);

  if (error) {
    if (error.code === '23505') {
      return { error: 'You already have a hustle with this name' };
    }
    return { error: error.message };
  }

  revalidatePath('/hustles');
  revalidatePath('/log');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteHustle(hustleId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Soft delete by setting is_active to false
  const { error } = await supabase
    .from('hustles')
    .update({ is_active: false })
    .eq('id', hustleId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/hustles');
  revalidatePath('/log');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getHustlesWithStats(): Promise<HustleWithStats[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Get all active hustles
  const { data: hustles } = await supabase
    .from('hustles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('name');

  if (!hustles || hustles.length === 0) {
    return [];
  }

  // Get all income entries for this user
  const { data: entries } = await supabase
    .from('income_entries')
    .select('hustle_id, amount, date')
    .eq('user_id', user.id);

  const now = new Date();
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

  // Calculate stats for each hustle
  const hustlesWithStats: HustleWithStats[] = hustles.map((hustle) => {
    const hustleEntries = (entries || []).filter((e) => e.hustle_id === hustle.id);

    const allTimeTotal = hustleEntries.reduce((sum, e) => sum + Number(e.amount), 0);

    const monthlyEntries = hustleEntries.filter(
      (e) => e.date >= monthStart && e.date <= monthEnd
    );
    const monthlyTotal = monthlyEntries.reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      ...hustle,
      monthlyTotal,
      allTimeTotal,
      entryCount: hustleEntries.length,
    } as HustleWithStats;
  });

  // Sort by monthly total (highest first)
  return hustlesWithStats.sort((a, b) => b.monthlyTotal - a.monthlyTotal);
}
