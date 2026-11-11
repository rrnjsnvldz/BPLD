/**
 * Supabase database type stubs.
 * Replace with generated types: `npx supabase gen types typescript --local > src/lib/platform/types/database.ts`
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          timezone: string;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string; };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      roles: {
        Row: { id: number; name: string; description: string | null; };
        Insert: Database['public']['Tables']['roles']['Row'];
        Update: Partial<Database['public']['Tables']['roles']['Row']>;
      };
      user_roles: {
        Row: { user_id: string; role_id: number; granted_by: string | null; granted_at: string; };
        Insert: Omit<Database['public']['Tables']['user_roles']['Row'], 'granted_at'> & { granted_at?: string; };
        Update: Partial<Database['public']['Tables']['user_roles']['Insert']>;
      };
      audit_log: {
        Row: { id: number; user_id: string | null; action: string; table_name: string; record_id: string | null; old_data: Json | null; new_data: Json | null; ip_address: string | null; user_agent: string | null; created_at: string; };
        Insert: Omit<Database['public']['Tables']['audit_log']['Row'], 'id' | 'created_at'> & { id?: number; created_at?: string; };
        Update: Partial<Database['public']['Tables']['audit_log']['Insert']>;
      };
      outbox: {
        Row: { id: number; aggregate_type: string; aggregate_id: string; event_type: string; payload: Json; published_at: string | null; created_at: string; };
        Insert: Omit<Database['public']['Tables']['outbox']['Row'], 'id' | 'created_at'> & { id?: number; created_at?: string; };
        Update: Partial<Database['public']['Tables']['outbox']['Insert']>;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
};
