import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'client' | 'worker';
  location: string;
  specialty: string;
  rating: number;
  about: string;
  created_at: string;
};

export type ConversationRow = {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
};

export type DbMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
};

export type DbNotification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export type JobRequestRow = {
  id: string;
  client_id: string;
  category: string;
  description: string;
  preferred_date: string;
  preferred_time: string;
  budget: string;
  status: 'requested' | 'ongoing' | 'completed';
  created_at: string;
};

