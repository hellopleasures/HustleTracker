'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { Profile } from '@/types/database';

const onboardingSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  monthlyGoal: z.coerce.number().min(0, 'Goal must be positive'),
});

const profileUpdateSchema = z.object({
  fullName: z.string().min(1, 'Name is required').optional(),
  currency: z.string().min(1, 'Currency is required').optional(),
  monthlyGoal: z.coerce.number().min(0, 'Goal must be positive').optional(),
});

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const result = onboardingSchema.safeParse({
    currency: formData.get('currency'),
    monthlyGoal: formData.get('monthlyGoal'),
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { currency, monthlyGoal } = result.data;

  const { error } = await supabase
    .from('profiles')
    .update({
      currency,
      monthly_goal: monthlyGoal,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const result = profileUpdateSchema.safeParse({
    fullName: formData.get('fullName') || undefined,
    currency: formData.get('currency') || undefined,
    monthlyGoal: formData.get('monthlyGoal') || undefined,
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (result.data.fullName !== undefined) {
    updates.full_name = result.data.fullName;
  }
  if (result.data.currency !== undefined) {
    updates.currency = result.data.currency;
  }
  if (result.data.monthlyGoal !== undefined) {
    updates.monthly_goal = result.data.monthlyGoal;
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/settings');
  revalidatePath('/dashboard');
  return { success: true };
}
