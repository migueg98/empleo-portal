export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          additional_comments: string | null
          age: number
          availability: string
          consent_given: boolean
          created_at: string
          cv_url: string | null
          email: string
          estado: string
          estado_interno: string
          full_name: string
          id: string
          job_id: string
          phone: string
          position_experience: string
          sector_experience: string
          selected_positions: string[] | null
          updated_at: string
        }
        Insert: {
          additional_comments?: string | null
          age: number
          availability: string
          consent_given?: boolean
          created_at?: string
          cv_url?: string | null
          email: string
          estado?: string
          estado_interno?: string
          full_name: string
          id?: string
          job_id: string
          phone: string
          position_experience: string
          sector_experience: string
          selected_positions?: string[] | null
          updated_at?: string
        }
        Update: {
          additional_comments?: string | null
          age?: number
          availability?: string
          consent_given?: boolean
          created_at?: string
          cv_url?: string | null
          email?: string
          estado?: string
          estado_interno?: string
          full_name?: string
          id?: string
          job_id?: string
          phone?: string
          position_experience?: string
          sector_experience?: string
          selected_positions?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          business: string
          city: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          sector: string
          sector_id: number
          title: string
          updated_at: string
        }
        Insert: {
          business: string
          city?: string
          created_at?: string
          description: string
          id: string
          is_active?: boolean
          sector: string
          sector_id: number
          title: string
          updated_at?: string
        }
        Update: {
          business?: string
          city?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          sector?: string
          sector_id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      candidate_applications: {
        Row: {
          created_at: string | null
          email: string | null
          estado_publico: string | null
          full_name: string | null
          id: string | null
          job_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          estado_publico?: never
          full_name?: string | null
          id?: string | null
          job_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          estado_publico?: never
          full_name?: string | null
          id?: string | null
          job_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs_with_sectors: {
        Row: {
          business: string | null
          city: string | null
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          sector: string | null
          sector_id: number | null
          sector_name: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
