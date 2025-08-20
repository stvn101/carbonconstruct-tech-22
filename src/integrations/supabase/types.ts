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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      epd_claude_logs: {
        Row: {
          context_data: Json | null
          created_at: string
          epd_id: string | null
          id: string
          prompt: string
          response: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          epd_id?: string | null
          id?: string
          prompt: string
          response: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          epd_id?: string | null
          id?: string
          prompt?: string
          response?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "epd_claude_logs_epd_id_fkey"
            columns: ["epd_id"]
            isOneToOne: false
            referencedRelation: "epd_records"
            referencedColumns: ["id"]
          },
        ]
      }
      epd_records: {
        Row: {
          company_id: string | null
          created_at: string
          data_sources: Json | null
          epd_hash: string | null
          epd_stage_data: Json
          functional_unit: string
          gwp_biogenic: number | null
          gwp_fossil: number | null
          gwp_total: number | null
          id: string
          iso_compliant: boolean
          manufacturer_abn: string | null
          manufacturer_location: string | null
          manufacturer_name: string
          material_id: string | null
          product_description: string | null
          product_name: string
          status: string
          submitted_at: string | null
          submitted_by: string
          total_co2e: number | null
          updated_at: string
          verification_status: string
          verified_at: string | null
          version_number: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          data_sources?: Json | null
          epd_hash?: string | null
          epd_stage_data?: Json
          functional_unit?: string
          gwp_biogenic?: number | null
          gwp_fossil?: number | null
          gwp_total?: number | null
          id?: string
          iso_compliant?: boolean
          manufacturer_abn?: string | null
          manufacturer_location?: string | null
          manufacturer_name: string
          material_id?: string | null
          product_description?: string | null
          product_name: string
          status?: string
          submitted_at?: string | null
          submitted_by: string
          total_co2e?: number | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          version_number?: number
        }
        Update: {
          company_id?: string | null
          created_at?: string
          data_sources?: Json | null
          epd_hash?: string | null
          epd_stage_data?: Json
          functional_unit?: string
          gwp_biogenic?: number | null
          gwp_fossil?: number | null
          gwp_total?: number | null
          id?: string
          iso_compliant?: boolean
          manufacturer_abn?: string | null
          manufacturer_location?: string | null
          manufacturer_name?: string
          material_id?: string | null
          product_description?: string | null
          product_name?: string
          status?: string
          submitted_at?: string | null
          submitted_by?: string
          total_co2e?: number | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          version_number?: number
        }
        Relationships: []
      }
      epd_registry: {
        Row: {
          created_at: string
          epd_record_id: string
          full_hash: string
          id: string
          is_active: boolean
          publication_notes: string | null
          published_at: string
          short_hash: string
        }
        Insert: {
          created_at?: string
          epd_record_id: string
          full_hash: string
          id?: string
          is_active?: boolean
          publication_notes?: string | null
          published_at?: string
          short_hash: string
        }
        Update: {
          created_at?: string
          epd_record_id?: string
          full_hash?: string
          id?: string
          is_active?: boolean
          publication_notes?: string | null
          published_at?: string
          short_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "epd_registry_epd_record_id_fkey"
            columns: ["epd_record_id"]
            isOneToOne: false
            referencedRelation: "epd_records"
            referencedColumns: ["id"]
          },
        ]
      }
      epd_stage_emissions: {
        Row: {
          co2e_value: number
          created_at: string
          data_source: string | null
          description: string | null
          epd_record_id: string
          id: string
          stage: string
        }
        Insert: {
          co2e_value: number
          created_at?: string
          data_source?: string | null
          description?: string | null
          epd_record_id: string
          id?: string
          stage: string
        }
        Update: {
          co2e_value?: number
          created_at?: string
          data_source?: string | null
          description?: string | null
          epd_record_id?: string
          id?: string
          stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "epd_stage_emissions_epd_record_id_fkey"
            columns: ["epd_record_id"]
            isOneToOne: false
            referencedRelation: "epd_records"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          region: string | null
          result: Json
          tags: string[] | null
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          region?: string | null
          result?: Json
          tags?: string[] | null
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          region?: string | null
          result?: Json
          tags?: string[] | null
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      unified_materials: {
        Row: {
          category: string | null
          created_at: string
          data_quality: string | null
          embodied_carbon: number | null
          id: string
          name: string
          region: string | null
          source: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          data_quality?: string | null
          embodied_carbon?: number | null
          id?: string
          name: string
          region?: string | null
          source?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          data_quality?: string | null
          embodied_carbon?: number | null
          id?: string
          name?: string
          region?: string | null
          source?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      verifiers: {
        Row: {
          active: boolean
          certification: string | null
          created_at: string
          email: string
          id: string
          name: string | null
        }
        Insert: {
          active?: boolean
          certification?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          active?: boolean
          certification?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_unified_materials_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
