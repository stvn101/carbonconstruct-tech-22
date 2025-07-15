export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          email: string | null
          id: string
        }
        Insert: {
          email?: string | null
          id: string
        }
        Update: {
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string | null
          date: string | null
          id: number
          title: string | null
        }
        Insert: {
          content?: string | null
          date?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          content?: string | null
          date?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      calculations: {
        Row: {
          created_at: string | null
          id: string
          intensity_kgco2e_m2: number | null
          lifecycle_breakdown: Json | null
          project_id: string | null
          scope1: number | null
          scope2: number | null
          scope3: number | null
          total_co2e: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          intensity_kgco2e_m2?: number | null
          lifecycle_breakdown?: Json | null
          project_id?: string | null
          scope1?: number | null
          scope2?: number | null
          scope3?: number | null
          total_co2e?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          intensity_kgco2e_m2?: number | null
          lifecycle_breakdown?: Json | null
          project_id?: string | null
          scope1?: number | null
          scope2?: number | null
          scope3?: number | null
          total_co2e?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calculations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      calculator_usage: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      carbon_budgets: {
        Row: {
          carbon_budget_kg: number | null
          id: string
          project_id: string | null
          status: string | null
          updated_at: string | null
          variance_kg: number | null
        }
        Insert: {
          carbon_budget_kg?: number | null
          id?: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
          variance_kg?: number | null
        }
        Update: {
          carbon_budget_kg?: number | null
          id?: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
          variance_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_budgets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          co2_reduction: number | null
          description: string | null
          id: number
          title: string | null
        }
        Insert: {
          co2_reduction?: number | null
          description?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          co2_reduction?: number | null
          description?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          api_endpoint: string | null
          created_at: string | null
          description: string | null
          hierarchy_level: Database["public"]["Enums"]["data_source_level"]
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          name: string
          reliability_score: number | null
          source_type: string
          sync_frequency_hours: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string | null
          description?: string | null
          hierarchy_level: Database["public"]["Enums"]["data_source_level"]
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name: string
          reliability_score?: number | null
          source_type: string
          sync_frequency_hours?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string | null
          description?: string | null
          hierarchy_level?: Database["public"]["Enums"]["data_source_level"]
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name?: string
          reliability_score?: number | null
          source_type?: string
          sync_frequency_hours?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      epd_data: {
        Row: {
          created_at: string | null
          data_source_id: string | null
          epd_publisher: string
          epd_registration_number: string
          epd_validity_date: string
          functional_unit: string
          geographic_scope: string | null
          gwp_a1_a3: number | null
          gwp_a4: number | null
          gwp_a5: number | null
          gwp_b1_b7: number | null
          gwp_c1_c4: number | null
          gwp_d: number | null
          id: string
          lca_methodology: Database["public"]["Enums"]["lca_methodology"]
          manufacturer: string | null
          product_name: string
          reference_year: number | null
          total_gwp: number | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          created_at?: string | null
          data_source_id?: string | null
          epd_publisher: string
          epd_registration_number: string
          epd_validity_date: string
          functional_unit: string
          geographic_scope?: string | null
          gwp_a1_a3?: number | null
          gwp_a4?: number | null
          gwp_a5?: number | null
          gwp_b1_b7?: number | null
          gwp_c1_c4?: number | null
          gwp_d?: number | null
          id?: string
          lca_methodology: Database["public"]["Enums"]["lca_methodology"]
          manufacturer?: string | null
          product_name: string
          reference_year?: number | null
          total_gwp?: number | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          created_at?: string | null
          data_source_id?: string | null
          epd_publisher?: string
          epd_registration_number?: string
          epd_validity_date?: string
          functional_unit?: string
          geographic_scope?: string | null
          gwp_a1_a3?: number | null
          gwp_a4?: number | null
          gwp_a5?: number | null
          gwp_b1_b7?: number | null
          gwp_c1_c4?: number | null
          gwp_d?: number | null
          id?: string
          lca_methodology?: Database["public"]["Enums"]["lca_methodology"]
          manufacturer?: string | null
          product_name?: string
          reference_year?: number | null
          total_gwp?: number | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "epd_data_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
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
          status: Database["public"]["Enums"]["epd_status"]
          submitted_at: string | null
          submitted_by: string
          total_co2e: number | null
          updated_at: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
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
          status?: Database["public"]["Enums"]["epd_status"]
          submitted_at?: string | null
          submitted_by: string
          total_co2e?: number | null
          updated_at?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
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
          status?: Database["public"]["Enums"]["epd_status"]
          submitted_at?: string | null
          submitted_by?: string
          total_co2e?: number | null
          updated_at?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "epd_records_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "unified_materials"
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
          epd_record_id: string | null
          id: string
          stage: Database["public"]["Enums"]["epd_stage"]
        }
        Insert: {
          co2e_value: number
          created_at?: string
          data_source?: string | null
          description?: string | null
          epd_record_id?: string | null
          id?: string
          stage: Database["public"]["Enums"]["epd_stage"]
        }
        Update: {
          co2e_value?: number
          created_at?: string
          data_source?: string | null
          description?: string | null
          epd_record_id?: string | null
          id?: string
          stage?: Database["public"]["Enums"]["epd_stage"]
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
      epd_verification_history: {
        Row: {
          action: string
          created_at: string | null
          epd_record_id: string | null
          id: string
          verification_notes: string | null
          verified_by: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          epd_record_id?: string | null
          id?: string
          verification_notes?: string | null
          verified_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          epd_record_id?: string | null
          id?: string
          verification_notes?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "epd_verification_history_epd_record_id_fkey"
            columns: ["epd_record_id"]
            isOneToOne: false
            referencedRelation: "epd_records"
            referencedColumns: ["id"]
          },
        ]
      }
      green_star_certifications: {
        Row: {
          certificate_number: string
          created_at: string | null
          expiry_date: string | null
          id: string
          initiative_id: string | null
          issue_date: string
          material_id: string | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          certificate_number: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          initiative_id?: string | null
          issue_date: string
          material_id?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          certificate_number?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          initiative_id?: string | null
          issue_date?: string
          material_id?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "green_star_certifications_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "green_star_initiatives"
            referencedColumns: ["initiative_id"]
          },
          {
            foreignKeyName: "green_star_certifications_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "unified_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      green_star_initiatives: {
        Row: {
          categories: Json
          created_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          initiative_id: string
          initiative_name: string
          is_active: boolean | null
          recognition_date: string
          rpv_score: number
          updated_at: string | null
        }
        Insert: {
          categories?: Json
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          initiative_id: string
          initiative_name: string
          is_active?: boolean | null
          recognition_date: string
          rpv_score: number
          updated_at?: string | null
        }
        Update: {
          categories?: Json
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          initiative_id?: string
          initiative_name?: string
          is_active?: boolean | null
          recognition_date?: string
          rpv_score?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      green_star_projects: {
        Row: {
          achieved_credits: number | null
          achievement_level:
            | Database["public"]["Enums"]["achievement_level"]
            | null
          building_layer_costs: Json | null
          compliance_results: Json | null
          created_at: string | null
          id: string
          location: string | null
          overall_score: number | null
          products: Json | null
          project_name: string
          project_type: string | null
          recommendations: string[] | null
          submission_date: string | null
          target_rating: Database["public"]["Enums"]["achievement_level"] | null
          total_possible_credits: number | null
          total_project_cost: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved_credits?: number | null
          achievement_level?:
            | Database["public"]["Enums"]["achievement_level"]
            | null
          building_layer_costs?: Json | null
          compliance_results?: Json | null
          created_at?: string | null
          id?: string
          location?: string | null
          overall_score?: number | null
          products?: Json | null
          project_name: string
          project_type?: string | null
          recommendations?: string[] | null
          submission_date?: string | null
          target_rating?:
            | Database["public"]["Enums"]["achievement_level"]
            | null
          total_possible_credits?: number | null
          total_project_cost?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achieved_credits?: number | null
          achievement_level?:
            | Database["public"]["Enums"]["achievement_level"]
            | null
          building_layer_costs?: Json | null
          compliance_results?: Json | null
          created_at?: string | null
          id?: string
          location?: string | null
          overall_score?: number | null
          products?: Json | null
          project_name?: string
          project_type?: string | null
          recommendations?: string[] | null
          submission_date?: string | null
          target_rating?:
            | Database["public"]["Enums"]["achievement_level"]
            | null
          total_possible_credits?: number | null
          total_project_cost?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lca_metadata: {
        Row: {
          allocation_method: string | null
          assumptions: string | null
          created_at: string | null
          cut_off_criteria: string | null
          data_quality_indicators: Json | null
          id: string
          impact_categories: Json | null
          limitations: string | null
          material_id: string | null
          reference_type: string
          system_boundary: string | null
          updated_at: string | null
        }
        Insert: {
          allocation_method?: string | null
          assumptions?: string | null
          created_at?: string | null
          cut_off_criteria?: string | null
          data_quality_indicators?: Json | null
          id?: string
          impact_categories?: Json | null
          limitations?: string | null
          material_id?: string | null
          reference_type: string
          system_boundary?: string | null
          updated_at?: string | null
        }
        Update: {
          allocation_method?: string | null
          assumptions?: string | null
          created_at?: string | null
          cut_off_criteria?: string | null
          data_quality_indicators?: Json | null
          id?: string
          impact_categories?: Json | null
          limitations?: string | null
          material_id?: string | null
          reference_type?: string
          system_boundary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      material_audit_log: {
        Row: {
          action: string
          change_reason: string | null
          changed_by: string | null
          created_at: string | null
          data_source_id: string | null
          id: string
          material_id: string
          new_values: Json | null
          old_values: Json | null
          table_name: string
        }
        Insert: {
          action: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          data_source_id?: string | null
          id?: string
          material_id: string
          new_values?: Json | null
          old_values?: Json | null
          table_name: string
        }
        Update: {
          action?: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          data_source_id?: string | null
          id?: string
          material_id?: string
          new_values?: Json | null
          old_values?: Json | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_audit_log_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          id: number
          title: string
          user_id: string | null
        }
        Insert: {
          id?: never
          title: string
          user_id?: string | null
        }
        Update: {
          id?: never
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          status: string
          stripe_payment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          status: string
          stripe_payment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          achievement_badges: string[] | null
          avatar_url: string | null
          calculator_preferences: Json | null
          carbon_footprint_goals: Json | null
          company_name: string | null
          compliance_thresholds: Json | null
          created_at: string
          default_region: string | null
          favorite_materials: string[] | null
          focus_areas: string[] | null
          full_name: string | null
          had_trial: boolean | null
          id: string
          industry: string | null
          job_title: string | null
          notification_browser: boolean | null
          notification_email: boolean | null
          notification_reports: boolean | null
          preferred_units: string | null
          project_size_preference: string | null
          quick_access_tools: string[] | null
          role: string | null
          subscription_tier: string | null
          updated_at: string
          website: string | null
          years_experience: string | null
        }
        Insert: {
          achievement_badges?: string[] | null
          avatar_url?: string | null
          calculator_preferences?: Json | null
          carbon_footprint_goals?: Json | null
          company_name?: string | null
          compliance_thresholds?: Json | null
          created_at?: string
          default_region?: string | null
          favorite_materials?: string[] | null
          focus_areas?: string[] | null
          full_name?: string | null
          had_trial?: boolean | null
          id: string
          industry?: string | null
          job_title?: string | null
          notification_browser?: boolean | null
          notification_email?: boolean | null
          notification_reports?: boolean | null
          preferred_units?: string | null
          project_size_preference?: string | null
          quick_access_tools?: string[] | null
          role?: string | null
          subscription_tier?: string | null
          updated_at?: string
          website?: string | null
          years_experience?: string | null
        }
        Update: {
          achievement_badges?: string[] | null
          avatar_url?: string | null
          calculator_preferences?: Json | null
          carbon_footprint_goals?: Json | null
          company_name?: string | null
          compliance_thresholds?: Json | null
          created_at?: string
          default_region?: string | null
          favorite_materials?: string[] | null
          focus_areas?: string[] | null
          full_name?: string | null
          had_trial?: boolean | null
          id?: string
          industry?: string | null
          job_title?: string | null
          notification_browser?: boolean | null
          notification_email?: boolean | null
          notification_reports?: boolean | null
          preferred_units?: string | null
          project_size_preference?: string | null
          quick_access_tools?: string[] | null
          role?: string | null
          subscription_tier?: string | null
          updated_at?: string
          website?: string | null
          years_experience?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          bim_link: string | null
          created_at: string
          description: string | null
          end_date: string | null
          energy: Json | null
          id: string
          materials: Json | null
          name: string
          ncc_version: string | null
          region: string | null
          result: Json | null
          sqm: number | null
          start_date: string | null
          tags: string[] | null
          total: number | null
          transport: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bim_link?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          energy?: Json | null
          id?: string
          materials?: Json | null
          name: string
          ncc_version?: string | null
          region?: string | null
          result?: Json | null
          sqm?: number | null
          start_date?: string | null
          tags?: string[] | null
          total?: number | null
          transport?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bim_link?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          energy?: Json | null
          id?: string
          materials?: Json | null
          name?: string
          ncc_version?: string | null
          region?: string | null
          result?: Json | null
          sqm?: number | null
          start_date?: string | null
          tags?: string[] | null
          total?: number | null
          transport?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subcontractor_uploads: {
        Row: {
          co2e_uploaded: number | null
          data_link: string | null
          id: string
          project_id: string | null
          subbie_name: string | null
          upload_type: string | null
          uploaded_at: string | null
          verified: boolean | null
        }
        Insert: {
          co2e_uploaded?: number | null
          data_link?: string | null
          id?: string
          project_id?: string | null
          subbie_name?: string | null
          upload_type?: string | null
          uploaded_at?: string | null
          verified?: boolean | null
        }
        Update: {
          co2e_uploaded?: number | null
          data_link?: string | null
          id?: string
          project_id?: string | null
          subbie_name?: string | null
          upload_type?: string | null
          uploaded_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "subcontractor_uploads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
        }
        Relationships: []
      }
      unified_materials: {
        Row: {
          alternative_to: string | null
          applicable_standards: string | null
          building_layers:
            | Database["public"]["Enums"]["building_layer"][]
            | null
          carbon_footprint_kgco2e_kg: number | null
          carbon_footprint_kgco2e_tonne: number | null
          carbon_intensity_category: string | null
          category: string | null
          category_id: number | null
          certification_standards: string[] | null
          co2e_avg: number | null
          co2e_max: number | null
          co2e_min: number | null
          created_at: string
          data_lineage: Json | null
          data_quality_rating: number | null
          data_source_id: string | null
          description: string | null
          embodied_energy_mj_kg: number | null
          emission_scope: string | null
          end_of_life_options: string[] | null
          environmental_impact_score: number | null
          epd_publisher: string | null
          epd_registration_number: string | null
          epd_validity_date: string | null
          factor: number | null
          green_star_categories: string[] | null
          green_star_compliant: boolean | null
          green_star_rpv_score: number | null
          id: string
          last_verified_at: string | null
          lca_methodology: Database["public"]["Enums"]["lca_methodology"] | null
          lifecycle_stage: string | null
          local_availability: boolean | null
          material_type: string | null
          name: string
          ncc_requirements: string | null
          notes: string | null
          parent_material_id: string | null
          recyclability: string | null
          region: string | null
          scope1_emissions: number | null
          scope2_emissions: number | null
          scope3_emissions: number | null
          source: string | null
          source_hierarchy_level:
            | Database["public"]["Enums"]["data_source_level"]
            | null
          sustainability_notes: string | null
          sustainability_score: number | null
          sustainability_score_is_manual: boolean | null
          tags: string[] | null
          transport_emissions_kgco2e_km: number | null
          unit: string | null
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version_number: number | null
          water_usage_liters_kg: number | null
        }
        Insert: {
          alternative_to?: string | null
          applicable_standards?: string | null
          building_layers?:
            | Database["public"]["Enums"]["building_layer"][]
            | null
          carbon_footprint_kgco2e_kg?: number | null
          carbon_footprint_kgco2e_tonne?: number | null
          carbon_intensity_category?: string | null
          category?: string | null
          category_id?: number | null
          certification_standards?: string[] | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string
          data_lineage?: Json | null
          data_quality_rating?: number | null
          data_source_id?: string | null
          description?: string | null
          embodied_energy_mj_kg?: number | null
          emission_scope?: string | null
          end_of_life_options?: string[] | null
          environmental_impact_score?: number | null
          epd_publisher?: string | null
          epd_registration_number?: string | null
          epd_validity_date?: string | null
          factor?: number | null
          green_star_categories?: string[] | null
          green_star_compliant?: boolean | null
          green_star_rpv_score?: number | null
          id?: string
          last_verified_at?: string | null
          lca_methodology?:
            | Database["public"]["Enums"]["lca_methodology"]
            | null
          lifecycle_stage?: string | null
          local_availability?: boolean | null
          material_type?: string | null
          name: string
          ncc_requirements?: string | null
          notes?: string | null
          parent_material_id?: string | null
          recyclability?: string | null
          region?: string | null
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          source?: string | null
          source_hierarchy_level?:
            | Database["public"]["Enums"]["data_source_level"]
            | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          tags?: string[] | null
          transport_emissions_kgco2e_km?: number | null
          unit?: string | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version_number?: number | null
          water_usage_liters_kg?: number | null
        }
        Update: {
          alternative_to?: string | null
          applicable_standards?: string | null
          building_layers?:
            | Database["public"]["Enums"]["building_layer"][]
            | null
          carbon_footprint_kgco2e_kg?: number | null
          carbon_footprint_kgco2e_tonne?: number | null
          carbon_intensity_category?: string | null
          category?: string | null
          category_id?: number | null
          certification_standards?: string[] | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string
          data_lineage?: Json | null
          data_quality_rating?: number | null
          data_source_id?: string | null
          description?: string | null
          embodied_energy_mj_kg?: number | null
          emission_scope?: string | null
          end_of_life_options?: string[] | null
          environmental_impact_score?: number | null
          epd_publisher?: string | null
          epd_registration_number?: string | null
          epd_validity_date?: string | null
          factor?: number | null
          green_star_categories?: string[] | null
          green_star_compliant?: boolean | null
          green_star_rpv_score?: number | null
          id?: string
          last_verified_at?: string | null
          lca_methodology?:
            | Database["public"]["Enums"]["lca_methodology"]
            | null
          lifecycle_stage?: string | null
          local_availability?: boolean | null
          material_type?: string | null
          name?: string
          ncc_requirements?: string | null
          notes?: string | null
          parent_material_id?: string | null
          recyclability?: string | null
          region?: string | null
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          source?: string | null
          source_hierarchy_level?:
            | Database["public"]["Enums"]["data_source_level"]
            | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          tags?: string[] | null
          transport_emissions_kgco2e_km?: number | null
          unit?: string | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version_number?: number | null
          water_usage_liters_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "unified_materials_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unified_materials_parent_material_id_fkey"
            columns: ["parent_material_id"]
            isOneToOne: false
            referencedRelation: "unified_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_materials_backup: {
        Row: {
          alternative_to: string | null
          applicable_standards: string | null
          building_layers:
            | Database["public"]["Enums"]["building_layer"][]
            | null
          carbon_footprint_kgco2e_kg: number | null
          carbon_footprint_kgco2e_tonne: number | null
          carbon_intensity_category: string | null
          category: string | null
          category_id: number | null
          certification_standards: string[] | null
          co2e_avg: number | null
          co2e_max: number | null
          co2e_min: number | null
          created_at: string | null
          data_lineage: Json | null
          data_quality_rating: number | null
          data_source_id: string | null
          description: string | null
          embodied_energy_mj_kg: number | null
          emission_scope: string | null
          end_of_life_options: string[] | null
          environmental_impact_score: number | null
          epd_publisher: string | null
          epd_registration_number: string | null
          epd_validity_date: string | null
          factor: number | null
          green_star_categories: string[] | null
          green_star_compliant: boolean | null
          green_star_rpv_score: number | null
          id: string | null
          last_verified_at: string | null
          lca_methodology: Database["public"]["Enums"]["lca_methodology"] | null
          lifecycle_stage: string | null
          local_availability: boolean | null
          material_type: string | null
          name: string | null
          ncc_requirements: string | null
          notes: string | null
          parent_material_id: string | null
          recyclability: string | null
          region: string | null
          scope1_emissions: number | null
          scope2_emissions: number | null
          scope3_emissions: number | null
          source: string | null
          source_hierarchy_level:
            | Database["public"]["Enums"]["data_source_level"]
            | null
          sustainability_notes: string | null
          sustainability_score: number | null
          sustainability_score_is_manual: boolean | null
          tags: string[] | null
          transport_emissions_kgco2e_km: number | null
          unit: string | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version_number: number | null
          water_usage_liters_kg: number | null
        }
        Insert: {
          alternative_to?: string | null
          applicable_standards?: string | null
          building_layers?:
            | Database["public"]["Enums"]["building_layer"][]
            | null
          carbon_footprint_kgco2e_kg?: number | null
          carbon_footprint_kgco2e_tonne?: number | null
          carbon_intensity_category?: string | null
          category?: string | null
          category_id?: number | null
          certification_standards?: string[] | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string | null
          data_lineage?: Json | null
          data_quality_rating?: number | null
          data_source_id?: string | null
          description?: string | null
          embodied_energy_mj_kg?: number | null
          emission_scope?: string | null
          end_of_life_options?: string[] | null
          environmental_impact_score?: number | null
          epd_publisher?: string | null
          epd_registration_number?: string | null
          epd_validity_date?: string | null
          factor?: number | null
          green_star_categories?: string[] | null
          green_star_compliant?: boolean | null
          green_star_rpv_score?: number | null
          id?: string | null
          last_verified_at?: string | null
          lca_methodology?:
            | Database["public"]["Enums"]["lca_methodology"]
            | null
          lifecycle_stage?: string | null
          local_availability?: boolean | null
          material_type?: string | null
          name?: string | null
          ncc_requirements?: string | null
          notes?: string | null
          parent_material_id?: string | null
          recyclability?: string | null
          region?: string | null
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          source?: string | null
          source_hierarchy_level?:
            | Database["public"]["Enums"]["data_source_level"]
            | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          tags?: string[] | null
          transport_emissions_kgco2e_km?: number | null
          unit?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version_number?: number | null
          water_usage_liters_kg?: number | null
        }
        Update: {
          alternative_to?: string | null
          applicable_standards?: string | null
          building_layers?:
            | Database["public"]["Enums"]["building_layer"][]
            | null
          carbon_footprint_kgco2e_kg?: number | null
          carbon_footprint_kgco2e_tonne?: number | null
          carbon_intensity_category?: string | null
          category?: string | null
          category_id?: number | null
          certification_standards?: string[] | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string | null
          data_lineage?: Json | null
          data_quality_rating?: number | null
          data_source_id?: string | null
          description?: string | null
          embodied_energy_mj_kg?: number | null
          emission_scope?: string | null
          end_of_life_options?: string[] | null
          environmental_impact_score?: number | null
          epd_publisher?: string | null
          epd_registration_number?: string | null
          epd_validity_date?: string | null
          factor?: number | null
          green_star_categories?: string[] | null
          green_star_compliant?: boolean | null
          green_star_rpv_score?: number | null
          id?: string | null
          last_verified_at?: string | null
          lca_methodology?:
            | Database["public"]["Enums"]["lca_methodology"]
            | null
          lifecycle_stage?: string | null
          local_availability?: boolean | null
          material_type?: string | null
          name?: string | null
          ncc_requirements?: string | null
          notes?: string | null
          parent_material_id?: string | null
          recyclability?: string | null
          region?: string | null
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          source?: string | null
          source_hierarchy_level?:
            | Database["public"]["Enums"]["data_source_level"]
            | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          tags?: string[] | null
          transport_emissions_kgco2e_km?: number | null
          unit?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version_number?: number | null
          water_usage_liters_kg?: number | null
        }
        Relationships: []
      }
      user_calculation_history: {
        Row: {
          calculation_data: Json
          calculator_type: string
          carbon_footprint: number | null
          compliance_status: string | null
          created_at: string | null
          id: string
          improvement_suggestions: string[] | null
          results: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calculation_data: Json
          calculator_type: string
          carbon_footprint?: number | null
          compliance_status?: string | null
          created_at?: string | null
          id?: string
          improvement_suggestions?: string[] | null
          results: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calculation_data?: Json
          calculator_type?: string
          carbon_footprint?: number | null
          compliance_status?: string | null
          created_at?: string | null
          id?: string
          improvement_suggestions?: string[] | null
          results?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_calculation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_compliance_alerts: {
        Row: {
          action_required: boolean | null
          alert_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_standard: string | null
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_required?: boolean | null
          alert_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_standard?: string | null
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_required?: boolean | null
          alert_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_standard?: string | null
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_compliance_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_material_favorites: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          material_id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          material_id: string
          notes?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          material_id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_material_favorites_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "unified_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_material_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      verification_records: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          expiry_date: string | null
          id: string
          material_id: string | null
          reference_type: string
          updated_at: string | null
          verification_date: string | null
          verification_notes: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_by: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          material_id?: string | null
          reference_type: string
          updated_at?: string | null
          verification_date?: string | null
          verification_notes?: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_by?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          material_id?: string | null
          reference_type?: string
          updated_at?: string | null
          verification_date?: string | null
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_by?: string | null
        }
        Relationships: []
      }
      verifiers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      material_sustainability_ranking: {
        Row: {}
        Relationships: []
      }
    }
    Functions: {
      analyze_material_duplicates: {
        Args: Record<PropertyKey, never>
        Returns: {
          duplicate_group_name: string
          total_records: number
          records_to_keep: number
          records_to_delete: number
          category: string
          epd_numbers: string[]
          sample_ids: string[]
        }[]
      }
      calculate_project_carbon_footprint: {
        Args: { project_uuid: string }
        Returns: number
      }
      calculate_sustainability_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_new_duplicates: {
        Args: Record<PropertyKey, never>
        Returns: {
          duplicate_name: string
          duplicate_count: number
          created_recently: boolean
        }[]
      }
      execute_material_deduplication: {
        Args: { dry_run?: boolean; batch_size?: number }
        Returns: {
          action: string
          material_name: string
          records_processed: number
          records_deleted: number
          backup_created: boolean
        }[]
      }
      find_sustainable_material_alternatives: {
        Args: {
          material_type: string
          max_carbon_footprint?: number
          region?: string
        }
        Returns: {
          id: string
          name: string
          description: string
          carbon_footprint_kgco2e_kg: number
          sustainability_score: number
          recyclability: string
          sustainability_notes: string
        }[]
      }
      get_best_material_data: {
        Args: { material_name: string }
        Returns: {
          id: string
          name: string
          carbon_footprint_kgco2e_kg: number
          source_level: Database["public"]["Enums"]["data_source_level"]
          verification_status: Database["public"]["Enums"]["verification_status"]
          data_quality_rating: number
          epd_registration_number: string
        }[]
      }
      get_project_carbon_intensity: {
        Args: { project_uuid: string }
        Returns: {
          project_id: string
          project_name: string
          total_co2e: number
          co2e_per_sqm: number
          comparison_to_avg: number
        }[]
      }
      get_user_projects: {
        Args: { user_uuid: string }
        Returns: {
          id: string
          name: string
          description: string
          created_at: string
          updated_at: string
          total: number
          sqm: number
          region: string
          tags: string[]
        }[]
      }
      validate_deduplication_results: {
        Args: Record<PropertyKey, never>
        Returns: {
          validation_check: string
          status: string
          details: Json
        }[]
      }
      validate_unified_materials_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_materials: number
          materials_with_carbon_data: number
          materials_with_categories: number
          data_quality_summary: Json
        }[]
      }
    }
    Enums: {
      achievement_level: "None" | "Good Practice" | "Best Practice"
      building_layer: "Structure" | "Envelope" | "Systems" | "Finishes"
      category_type:
        | "Responsible"
        | "Healthy"
        | "Positive"
        | "Circular"
        | "Leadership"
      data_source_level:
        | "level_1_verified_epd"
        | "level_2_peer_reviewed"
        | "level_3_industry_average"
        | "level_4_estimated"
      epd_stage:
        | "A1"
        | "A2"
        | "A3"
        | "A4"
        | "A5"
        | "B1"
        | "B2"
        | "B3"
        | "B4"
        | "B5"
        | "B6"
        | "B7"
        | "C1"
        | "C2"
        | "C3"
        | "C4"
        | "D"
      epd_status:
        | "draft"
        | "submitted_for_review"
        | "verified"
        | "published"
        | "archived"
      lca_methodology:
        | "iso_14040_14044"
        | "en_15804"
        | "iso_21930"
        | "cradle_to_gate"
        | "cradle_to_grave"
        | "cradle_to_cradle"
        | "other"
        | "EN_15804"
      verification_status:
        | "verified"
        | "pending_verification"
        | "unverified"
        | "expired"
        | "invalid"
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
    Enums: {
      achievement_level: ["None", "Good Practice", "Best Practice"],
      building_layer: ["Structure", "Envelope", "Systems", "Finishes"],
      category_type: [
        "Responsible",
        "Healthy",
        "Positive",
        "Circular",
        "Leadership",
      ],
      data_source_level: [
        "level_1_verified_epd",
        "level_2_peer_reviewed",
        "level_3_industry_average",
        "level_4_estimated",
      ],
      epd_stage: [
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "C1",
        "C2",
        "C3",
        "C4",
        "D",
      ],
      epd_status: [
        "draft",
        "submitted_for_review",
        "verified",
        "published",
        "archived",
      ],
      lca_methodology: [
        "iso_14040_14044",
        "en_15804",
        "iso_21930",
        "cradle_to_gate",
        "cradle_to_grave",
        "cradle_to_cradle",
        "other",
        "EN_15804",
      ],
      verification_status: [
        "verified",
        "pending_verification",
        "unverified",
        "expired",
        "invalid",
      ],
    },
  },
} as const
