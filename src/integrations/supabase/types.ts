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
          created_at: string | null
          description: string
          icon: string | null
          id: string
          name: string
          points: number | null
          required_progress: number
          requirements: string | null
          title: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          name: string
          points?: number | null
          required_progress: number
          requirements?: string | null
          title?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          name?: string
          points?: number | null
          required_progress?: number
          requirements?: string | null
          title?: string | null
        }
        Relationships: []
      }
      kana_characters: {
        Row: {
          character: string
          created_at: string | null
          examples: Json | null
          id: string
          mnemonic: string | null
          romaji: string
          sound_file: string | null
          stroke_count: number
          stroke_order: string[]
          type: string
        }
        Insert: {
          character: string
          created_at?: string | null
          examples?: Json | null
          id?: string
          mnemonic?: string | null
          romaji: string
          sound_file?: string | null
          stroke_count: number
          stroke_order: string[]
          type: string
        }
        Update: {
          character?: string
          created_at?: string | null
          examples?: Json | null
          id?: string
          mnemonic?: string | null
          romaji?: string
          sound_file?: string | null
          stroke_count?: number
          stroke_order?: string[]
          type?: string
        }
        Relationships: []
      }
      kana_group_characters: {
        Row: {
          character_id: string
          created_at: string | null
          group_id: string
          id: string
          sequence_order: number
        }
        Insert: {
          character_id: string
          created_at?: string | null
          group_id: string
          id?: string
          sequence_order: number
        }
        Update: {
          character_id?: string
          created_at?: string | null
          group_id?: string
          id?: string
          sequence_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "kana_group_characters_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "kana_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kana_group_characters_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "kana_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      kana_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      kana_learning_sessions: {
        Row: {
          accuracy: number | null
          characters_studied: string[]
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          end_time: string | null
          id: string
          kana_type: string
          start_time: string | null
          streak: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          characters_studied?: string[]
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          kana_type: string
          start_time?: string | null
          streak?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          characters_studied?: string[]
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          kana_type?: string
          start_time?: string | null
          streak?: number | null
          updated_at?: string | null
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          daily_goal_minutes: number | null
          display_name: string | null
          full_name: string | null
          id: string
          learning_goal: string | null
          learning_level: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          daily_goal_minutes?: number | null
          display_name?: string | null
          full_name?: string | null
          id: string
          learning_goal?: string | null
          learning_level?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          daily_goal_minutes?: number | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          learning_goal?: string | null
          learning_level?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed: boolean | null
          created_at: string | null
          duration_minutes: number
          id: string
          module: string
          notes: string | null
          performance_score: number | null
          session_date: string
          start_time: string | null
          topics: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          module: string
          notes?: string | null
          performance_score?: number | null
          session_date: string
          start_time?: string | null
          topics?: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          module?: string
          notes?: string | null
          performance_score?: number | null
          session_date?: string
          start_time?: string | null
          topics?: string[]
          updated_at?: string | null
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
          created_at: string | null
          current_progress: number
          id: string
          unlocked_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          current_progress?: number
          id?: string
          unlocked_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          current_progress?: number
          id?: string
          unlocked_at?: string | null
          updated_at?: string | null
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
          consecutive_correct: number
          created_at: string | null
          id: string
          last_practiced: string | null
          mastery_level: number
          mistake_count: number
          proficiency: number
          review_due: string | null
          total_practice_count: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          character_id: string
          consecutive_correct?: number
          created_at?: string | null
          id?: string
          last_practiced?: string | null
          mastery_level?: number
          mistake_count?: number
          proficiency?: number
          review_due?: string | null
          total_practice_count?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          character_id?: string
          consecutive_correct?: number
          created_at?: string | null
          id?: string
          last_practiced?: string | null
          mastery_level?: number
          mistake_count?: number
          proficiency?: number
          review_due?: string | null
          total_practice_count?: number
          updated_at?: string | null
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
      user_learning_streaks: {
        Row: {
          activity_count: number
          created_at: string | null
          date: string
          id: string
          user_id: string
        }
        Insert: {
          activity_count?: number
          created_at?: string | null
          date: string
          id?: string
          user_id: string
        }
        Update: {
          activity_count?: number
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          daily_goal: number | null
          daily_goal_minutes: number | null
          display_furigana: boolean | null
          id: string
          notifications_enabled: boolean | null
          preferred_study_time: string | null
          prior_knowledge: string | null
          reminder_time: string | null
          study_reminder: boolean | null
          theme: string | null
          updated_at: string | null
          weekly_goal_days: number | null
        }
        Insert: {
          created_at?: string | null
          daily_goal?: number | null
          daily_goal_minutes?: number | null
          display_furigana?: boolean | null
          id: string
          notifications_enabled?: boolean | null
          preferred_study_time?: string | null
          prior_knowledge?: string | null
          reminder_time?: string | null
          study_reminder?: boolean | null
          theme?: string | null
          updated_at?: string | null
          weekly_goal_days?: number | null
        }
        Update: {
          created_at?: string | null
          daily_goal?: number | null
          daily_goal_minutes?: number | null
          display_furigana?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          preferred_study_time?: string | null
          prior_knowledge?: string | null
          reminder_time?: string | null
          study_reminder?: boolean | null
          theme?: string | null
          updated_at?: string | null
          weekly_goal_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_id_fkey"
            columns: ["id"]
            isOneToOne: true
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
