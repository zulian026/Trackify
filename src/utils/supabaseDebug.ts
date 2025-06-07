import { supabase } from '@/lib/supabase';

export const debugSupabaseAuth = async () => {
  console.group('🔍 Supabase Auth Debug');
  
  try {
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'EXISTS' : 'NULL');
    console.log('Session error:', sessionError);
    
    if (session) {
      console.log('User ID:', session.user.id);
      console.log('Email:', session.user.email);
      console.log('Token expires at:', new Date(session.expires_at! * 1000));
      console.log('Token valid:', session.expires_at! * 1000 > Date.now());
    }

    // Check user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', user ? 'EXISTS' : 'NULL');
    console.log('User error:', userError);

    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    console.log('Database connection:', error ? 'FAILED' : 'OK');
    console.log('Connection error:', error);

  } catch (error) {
    console.error('Debug failed:', error);
  }
  
  console.groupEnd();
};