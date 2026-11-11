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
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          timezone?: string;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          timezone?: string;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      roles: {
        Row: { id: number; name: string; description: string | null; };
        Insert: { id: number; name: string; description?: string | null; };
        Update: { id?: number; name?: string; description?: string | null; };
      };
      user_roles: {
        Row: { user_id: string; role_id: number; granted_by: string | null; granted_at: string; };
        Insert: { user_id: string; role_id: number; granted_by?: string | null; granted_at?: string; };
        Update: { user_id?: string; role_id?: number; granted_by?: string | null; granted_at?: string; };
      };
      audit_log: {
        Row: { id: number; user_id: string | null; action: 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT'; table_name: string; record_id: string | null; old_data: Json | null; new_data: Json | null; ip_address: string | null; user_agent: string | null; created_at: string; };
        Insert: { id?: number; user_id?: string | null; action: 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT'; table_name: string; record_id?: string | null; old_data?: Json | null; new_data?: Json | null; ip_address?: string | null; user_agent?: string | null; created_at?: string; };
        Update: { id?: number; user_id?: string | null; action?: 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT'; table_name?: string; record_id?: string | null; old_data?: Json | null; new_data?: Json | null; ip_address?: string | null; user_agent?: string | null; created_at?: string; };
      };
      outbox: {
        Row: { id: number; aggregate_type: string; aggregate_id: string; event_type: string; payload: Json; idempotency_key: string | null; published_at: string | null; created_at: string; };
        Insert: { id?: number; aggregate_type: string; aggregate_id: string; event_type: string; payload?: Json; idempotency_key?: string | null; published_at?: string | null; created_at?: string; };
        Update: { id?: number; aggregate_type?: string; aggregate_id?: string; event_type?: string; payload?: Json; idempotency_key?: string | null; published_at?: string | null; created_at?: string; };
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
};
