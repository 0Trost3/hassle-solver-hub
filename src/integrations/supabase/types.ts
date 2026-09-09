export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          case_id: string
          created_at: string
          customer_id: string
          external_event_id: string | null
          external_provider: string | null
          id: string
          note: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"]
        }
        Insert: {
          case_id: string
          created_at?: string
          customer_id: string
          external_event_id?: string | null
          external_provider?: string | null
          id?: string
          note?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
        }
        Update: {
          case_id?: string
          created_at?: string
          customer_id?: string
          external_event_id?: string | null
          external_provider?: string | null
          id?: string
          note?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "appointments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          case_id: string | null
          created_at: string
          detail: Json | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          case_id?: string | null
          created_at?: string
          detail?: Json | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          case_id?: string | null
          created_at?: string
          detail?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_contacts: {
        Row: {
          author: Database["public"]["Enums"]["contact_author"]
          case_id: string
          channel: Database["public"]["Enums"]["contact_channel"]
          contact_person: string | null
          created_at: string
          created_by: string | null
          id: string
          next_step: string | null
          note: string | null
          occurred_at: string
          outcome: string | null
        }
        Insert: {
          author?: Database["public"]["Enums"]["contact_author"]
          case_id: string
          channel: Database["public"]["Enums"]["contact_channel"]
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          next_step?: string | null
          note?: string | null
          occurred_at?: string
          outcome?: string | null
        }
        Update: {
          author?: Database["public"]["Enums"]["contact_author"]
          case_id?: string
          channel?: Database["public"]["Enums"]["contact_channel"]
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          next_step?: string | null
          note?: string | null
          occurred_at?: string
          outcome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_contacts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_documents: {
        Row: {
          case_id: string
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_internal_notes: {
        Row: {
          author_id: string
          body: string
          case_id: string
          created_at: string
          id: string
        }
        Insert: {
          author_id: string
          body: string
          case_id: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          case_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_internal_notes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_messages: {
        Row: {
          body: string
          case_id: string
          created_at: string
          from_staff: boolean
          id: string
          sender_id: string
        }
        Insert: {
          body: string
          case_id: string
          created_at?: string
          from_staff?: boolean
          id?: string
          sender_id: string
        }
        Update: {
          body?: string
          case_id?: string
          created_at?: string
          from_staff?: boolean
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          agreed_deadline_note: string | null
          agreed_end: string | null
          agreed_price_cents: number | null
          agreed_start: string | null
          assigned_to: string | null
          closed_at: string | null
          contact_attempts: number | null
          created_at: string
          customer_id: string
          deadline_at: string | null
          desired_outcome: string | null
          id: string
          invoice_number: string | null
          last_contact_at: string | null
          next_step: string | null
          order_date: string | null
          order_description: string | null
          order_number: string | null
          paid_cents: number | null
          priority: Database["public"]["Enums"]["case_priority"]
          problem_description: string
          problem_since: string | null
          problem_types: Database["public"]["Enums"]["problem_type"][]
          provider_address: string | null
          provider_company: string
          provider_contact_person: string | null
          provider_email: string | null
          provider_phone: string | null
          provider_reacted: boolean | null
          provider_website: string | null
          service_type: string | null
          status: Database["public"]["Enums"]["case_status"]
          ticket_number: string
          updated_at: string
          what_happened: string | null
          what_is_not_working: string | null
          what_was_agreed: string | null
        }
        Insert: {
          agreed_deadline_note?: string | null
          agreed_end?: string | null
          agreed_price_cents?: number | null
          agreed_start?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          contact_attempts?: number | null
          created_at?: string
          customer_id: string
          deadline_at?: string | null
          desired_outcome?: string | null
          id?: string
          invoice_number?: string | null
          last_contact_at?: string | null
          next_step?: string | null
          order_date?: string | null
          order_description?: string | null
          order_number?: string | null
          paid_cents?: number | null
          priority?: Database["public"]["Enums"]["case_priority"]
          problem_description: string
          problem_since?: string | null
          problem_types?: Database["public"]["Enums"]["problem_type"][]
          provider_address?: string | null
          provider_company: string
          provider_contact_person?: string | null
          provider_email?: string | null
          provider_phone?: string | null
          provider_reacted?: boolean | null
          provider_website?: string | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["case_status"]
          ticket_number: string
          updated_at?: string
          what_happened?: string | null
          what_is_not_working?: string | null
          what_was_agreed?: string | null
        }
        Update: {
          agreed_deadline_note?: string | null
          agreed_end?: string | null
          agreed_price_cents?: number | null
          agreed_start?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          contact_attempts?: number | null
          created_at?: string
          customer_id?: string
          deadline_at?: string | null
          desired_outcome?: string | null
          id?: string
          invoice_number?: string | null
          last_contact_at?: string | null
          next_step?: string | null
          order_date?: string | null
          order_description?: string | null
          order_number?: string | null
          paid_cents?: number | null
          priority?: Database["public"]["Enums"]["case_priority"]
          problem_description?: string
          problem_since?: string | null
          problem_types?: Database["public"]["Enums"]["problem_type"][]
          provider_address?: string | null
          provider_company?: string
          provider_contact_person?: string | null
          provider_email?: string | null
          provider_phone?: string | null
          provider_reacted?: boolean | null
          provider_website?: string | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["case_status"]
          ticket_number?: string
          updated_at?: string
          what_happened?: string | null
          what_is_not_working?: string | null
          what_was_agreed?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          preferred_contact:
            | Database["public"]["Enums"]["contact_channel"]
            | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_channel"]
            | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_channel"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_business_days: {
        Args: { _days: number; _from: string }
        Returns: string
      }
      booked_slots: {
        Args: { _from: string; _to: string }
        Returns: {
          scheduled_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "customer" | "employee" | "admin"
      appointment_status: "requested" | "confirmed" | "completed" | "cancelled"
      case_priority: "low" | "normal" | "high" | "urgent"
      case_status:
        | "created"
        | "reviewing"
        | "call_pending"
        | "accepted"
        | "contacting_provider"
        | "awaiting_provider"
        | "negotiating"
        | "agreement_reached"
        | "closed"
        | "no_agreement"
        | "escalated"
      contact_author: "customer" | "staff"
      contact_channel:
        | "phone"
        | "email"
        | "sms"
        | "whatsapp"
        | "in_person"
        | "letter"
        | "other"
      problem_type:
        | "no_response"
        | "unreachable"
        | "delayed"
        | "unfinished"
        | "missed_appointment"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "employee", "admin"],
      appointment_status: ["requested", "confirmed", "completed", "cancelled"],
      case_priority: ["low", "normal", "high", "urgent"],
      case_status: [
        "created",
        "reviewing",
        "call_pending",
        "accepted",
        "contacting_provider",
        "awaiting_provider",
        "negotiating",
        "agreement_reached",
        "closed",
        "no_agreement",
        "escalated",
      ],
      contact_author: ["customer", "staff"],
      contact_channel: [
        "phone",
        "email",
        "sms",
        "whatsapp",
        "in_person",
        "letter",
        "other",
      ],
      problem_type: [
        "no_response",
        "unreachable",
        "delayed",
        "unfinished",
        "missed_appointment",
        "other",
      ],
    },
  },
} as const
