export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          created_at: string
          user_id: string
          project_id: string
          action: string
          details: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          project_id: string
          action: string
          details?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          project_id?: string
          action?: string
          details?: Json
        }
      }
      credits: {
        Row: {
          id: string
          created_at: string
          user_id: string
          amount: number
          type: string
          description: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          amount: number
          type: string
          description: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string
        }
      }
      files: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          size: number
          type: string
          path: string
          project_id: string
          user_id: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          size: number
          type: string
          path: string
          project_id: string
          user_id: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          size?: number
          type?: string
          path?: string
          project_id?: string
          user_id?: string
          metadata?: Json
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          status: string
          type: string
          data: Json
          result: Json | null
          error: string | null
          user_id: string
          project_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          status: string
          type: string
          data: Json
          result?: Json | null
          error?: string | null
          user_id: string
          project_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          status?: string
          type?: string
          data?: Json
          result?: Json | null
          error?: string | null
          user_id?: string
          project_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string
          full_name: string
          avatar_url: string | null
          website: string | null
          settings: Json
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username: string
          full_name: string
          avatar_url?: string | null
          website?: string | null
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string
          full_name?: string
          avatar_url?: string | null
          website?: string | null
          settings?: Json
        }
      }
      project_members: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          user_id: string
          role: string
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          user_id?: string
          role?: string
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          user_id: string
          settings: Json
          last_opened: string
          favorite: boolean
          template_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          user_id: string
          settings?: Json
          last_opened?: string
          favorite?: boolean
          template_type?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          user_id?: string
          settings?: Json
          last_opened?: string
          favorite?: boolean
          template_type?: string
        }
      }
      templates: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          type: string
          user_id: string
          is_public: boolean
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          type: string
          user_id: string
          is_public?: boolean
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          type?: string
          user_id?: string
          is_public?: boolean
          content?: string
        }
      }
      template_versions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          template_id: string
          version: number
          content: string
          description: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          template_id: string
          version: number
          content: string
          description: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          template_id?: string
          version?: number
          content?: string
          description?: string
          user_id?: string
        }
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
  }
}
