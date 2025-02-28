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
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          points: number
          requirements: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          points?: number
          requirements: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          points?: number
          requirements?: string
          title?: string
        }
        Relationships: []
      }
      kana_learning_sessions: {
        Row: {
          accuracy: number | null
          characters_studied: string[]
          completed: boolean | null
          created_at: string | null
          end_time: string | null
          id: string
          kana_type: string
          start_time: string | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          characters_studied?: string[]
          completed?: boolean | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          kana_type: string
          start_time?: string | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          characters_studied?: string[]
          completed?: boolean | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          kana_type?: string
          start_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kana_learning_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_settings: {
        Row: {
          display_furigana: boolean | null
          email_notifications: boolean | null
          id: string
          notifications_enabled: boolean | null
          preferred_study_time: string | null
          prior_knowledge: string | null
          study_reminder_frequency: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          display_furigana?: boolean | null
          email_notifications?: boolean | null
          id: string
          notifications_enabled?: boolean | null
          preferred_study_time?: string | null
          prior_knowledge?: string | null
          study_reminder_frequency?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          display_furigana?: boolean | null
          email_notifications?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          preferred_study_time?: string | null
          prior_knowledge?: string | null
          study_reminder_frequency?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_settings_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_goal_minutes: number | null
          full_name: string | null
          id: string
          learning_goal: string | null
          learning_level: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_goal_minutes?: number | null
          full_name?: string | null
          id: string
          learning_goal?: string | null
          learning_level?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_goal_minutes?: number | null
          full_name?: string | null
          id?: string
          learning_goal?: string | null
          learning_level?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed: boolean | null
          duration_minutes: number
          id: string
          module: string
          notes: string | null
          performance_score: number | null
          session_date: string
          topics: string[]
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          duration_minutes: number
          id?: string
          module: string
          notes?: string | null
          performance_score?: number | null
          session_date?: string
          topics: string[]
          user_id: string
        }
        Update: {
          completed?: boolean | null
          duration_minutes?: number
          id?: string
          module?: string
          notes?: string | null
          performance_score?: number | null
          session_date?: string
          topics?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_kana_progress: {
        Row: {
          character_id: string
          id: string
          last_practiced: string | null
          mistake_count: number
          proficiency: number
          review_due: string | null
          total_practice_count: number
          user_id: string
        }
        Insert: {
          character_id: string
          id?: string
          last_practiced?: string | null
          mistake_count?: number
          proficiency?: number
          review_due?: string | null
          total_practice_count?: number
          user_id: string
        }
        Update: {
          character_id?: string
          id?: string
          last_practiced?: string | null
          mistake_count?: number
          proficiency?: number
          review_due?: string | null
          total_practice_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_kana_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
