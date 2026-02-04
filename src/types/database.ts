export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  monthly_goal: number;
  currency: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Hustle = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  color: string;
  is_active: boolean;
  created_at: string;
};

export type IncomeEntry = {
  id: string;
  user_id: string;
  hustle_id: string;
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
};

export type IncomeEntryWithHustle = IncomeEntry & {
  hustle: Pick<Hustle, 'name' | 'color'>;
};

export type DashboardStats = {
  monthlyTotal: number;
  monthlyGoal: number;
  goalProgress: number;
  topHustles: {
    name: string;
    total: number;
    color: string;
  }[];
  recentEntries: IncomeEntryWithHustle[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      hustles: {
        Row: Hustle;
        Insert: Omit<Hustle, 'id' | 'created_at'>;
        Update: Partial<Omit<Hustle, 'id' | 'user_id' | 'created_at'>>;
      };
      income_entries: {
        Row: IncomeEntry;
        Insert: Omit<IncomeEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<IncomeEntry, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
};
