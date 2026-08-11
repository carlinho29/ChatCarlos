import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Atencao: Verifique se configurou o arquivo .env.local com suas chaves.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
