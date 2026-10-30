import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lfbghuingwmmjrylwmdz.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYmdodWluZ3dtbWpyeWx3bWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjMwMjQsImV4cCI6MjEwODgzOTAyNH0.m4UgRnWAa90VXOt3cS1NpNufCwp9aG7txWMPwvWD9-o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
