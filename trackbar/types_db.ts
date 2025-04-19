export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
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
  pgmq: {
    Tables: {
      a_game_store_queue: {
        Row: {
          archived_at: string
          enqueued_at: string
          message: Json | null
          msg_id: number
          read_ct: number
          vt: string
        }
        Insert: {
          archived_at?: string
          enqueued_at?: string
          message?: Json | null
          msg_id: number
          read_ct?: number
          vt: string
        }
        Update: {
          archived_at?: string
          enqueued_at?: string
          message?: Json | null
          msg_id?: number
          read_ct?: number
          vt?: string
        }
        Relationships: []
      }
      meta: {
        Row: {
          created_at: string
          is_partitioned: boolean
          is_unlogged: boolean
          queue_name: string
        }
        Insert: {
          created_at?: string
          is_partitioned: boolean
          is_unlogged: boolean
          queue_name: string
        }
        Update: {
          created_at?: string
          is_partitioned?: boolean
          is_unlogged?: boolean
          queue_name?: string
        }
        Relationships: []
      }
      q_game_store_queue: {
        Row: {
          enqueued_at: string
          message: Json | null
          msg_id: number
          read_ct: number
          vt: string
        }
        Insert: {
          enqueued_at?: string
          message?: Json | null
          msg_id?: never
          read_ct?: number
          vt: string
        }
        Update: {
          enqueued_at?: string
          message?: Json | null
          msg_id?: never
          read_ct?: number
          vt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _belongs_to_pgmq: {
        Args: {
          table_name: string
        }
        Returns: boolean
      }
      _ensure_pg_partman_installed: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      _get_partition_col: {
        Args: {
          partition_interval: string
        }
        Returns: string
      }
      _get_pg_partman_major_version: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      _get_pg_partman_schema: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      archive:
        | {
            Args: {
              queue_name: string
              msg_id: number
            }
            Returns: boolean
          }
        | {
            Args: {
              queue_name: string
              msg_ids: number[]
            }
            Returns: number[]
          }
      convert_archive_partitioned: {
        Args: {
          table_name: string
          partition_interval?: string
          retention_interval?: string
          leading_partition?: number
        }
        Returns: undefined
      }
      create: {
        Args: {
          queue_name: string
        }
        Returns: undefined
      }
      create_non_partitioned: {
        Args: {
          queue_name: string
        }
        Returns: undefined
      }
      create_partitioned: {
        Args: {
          queue_name: string
          partition_interval?: string
          retention_interval?: string
        }
        Returns: undefined
      }
      create_unlogged: {
        Args: {
          queue_name: string
        }
        Returns: undefined
      }
      delete:
        | {
            Args: {
              queue_name: string
              msg_id: number
            }
            Returns: boolean
          }
        | {
            Args: {
              queue_name: string
              msg_ids: number[]
            }
            Returns: number[]
          }
      detach_archive: {
        Args: {
          queue_name: string
        }
        Returns: undefined
      }
      drop_queue: {
        Args: {
          queue_name: string
          partitioned?: boolean
        }
        Returns: boolean
      }
      format_table_name: {
        Args: {
          queue_name: string
          prefix: string
        }
        Returns: string
      }
      list_queues: {
        Args: Record<PropertyKey, never>
        Returns: Database["pgmq"]["CompositeTypes"]["queue_record"][]
      }
      metrics: {
        Args: {
          queue_name: string
        }
        Returns: Database["pgmq"]["CompositeTypes"]["metrics_result"]
      }
      metrics_all: {
        Args: Record<PropertyKey, never>
        Returns: Database["pgmq"]["CompositeTypes"]["metrics_result"][]
      }
      pop: {
        Args: {
          queue_name: string
        }
        Returns: Database["pgmq"]["CompositeTypes"]["message_record"][]
      }
      purge_queue: {
        Args: {
          queue_name: string
        }
        Returns: number
      }
      read: {
        Args: {
          queue_name: string
          vt: number
          qty: number
        }
        Returns: Database["pgmq"]["CompositeTypes"]["message_record"][]
      }
      read_with_poll: {
        Args: {
          queue_name: string
          vt: number
          qty: number
          max_poll_seconds?: number
          poll_interval_ms?: number
        }
        Returns: Database["pgmq"]["CompositeTypes"]["message_record"][]
      }
      send: {
        Args: {
          queue_name: string
          msg: Json
          delay?: number
        }
        Returns: number[]
      }
      send_batch: {
        Args: {
          queue_name: string
          msgs: Json[]
          delay?: number
        }
        Returns: number[]
      }
      set_vt: {
        Args: {
          queue_name: string
          msg_id: number
          vt: number
        }
        Returns: Database["pgmq"]["CompositeTypes"]["message_record"][]
      }
      validate_queue_name: {
        Args: {
          queue_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      message_record: {
        msg_id: number | null
        read_ct: number | null
        enqueued_at: string | null
        vt: string | null
        message: Json | null
      }
      metrics_result: {
        queue_name: string | null
        queue_length: number | null
        newest_msg_age_sec: number | null
        oldest_msg_age_sec: number | null
        total_messages: number | null
        scrape_time: string | null
      }
      queue_record: {
        queue_name: string | null
        is_partitioned: boolean | null
        is_unlogged: boolean | null
        created_at: string | null
      }
    }
  }
  public: {
    Tables: {
      covers: {
        Row: {
          game_id: number | null
          height: number | null
          id: number
          url: string
          width: number | null
        }
        Insert: {
          game_id?: number | null
          height?: number | null
          id?: number
          url: string
          width?: number | null
        }
        Update: {
          game_id?: number | null
          height?: number | null
          id?: number
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "covers_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: true
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_modes: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      game_to_genres: {
        Row: {
          game_id: number
          genre_id: number
        }
        Insert: {
          game_id: number
          genre_id: number
        }
        Update: {
          game_id?: number
          genre_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_to_genres_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_to_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      game_to_modes: {
        Row: {
          game_id: number
          mode_id: number
        }
        Insert: {
          game_id: number
          mode_id: number
        }
        Update: {
          game_id?: number
          mode_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_to_modes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_to_modes_mode_id_fkey"
            columns: ["mode_id"]
            isOneToOne: false
            referencedRelation: "game_modes"
            referencedColumns: ["id"]
          },
        ]
      }
      game_to_platforms: {
        Row: {
          game_id: number
          platform_id: number
        }
        Insert: {
          game_id: number
          platform_id: number
        }
        Update: {
          game_id?: number
          platform_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_to_platforms_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_to_platforms_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_to_types: {
        Row: {
          game_id: number
          type_id: number
        }
        Insert: {
          game_id: number
          type_id: number
        }
        Update: {
          game_id?: number
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_to_types_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_to_types_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "types"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          first_release_date: string | null
          id: number
          involved_companies: string | null
          is_popular: boolean | null
          keywords: string | null
          name: string
          similar_games: number[] | null
          slug: string
          storyline: string | null
          summary: string | null
          total_rating: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_release_date?: string | null
          id?: number
          involved_companies?: string | null
          is_popular?: boolean | null
          keywords?: string | null
          name: string
          similar_games?: number[] | null
          slug: string
          storyline?: string | null
          summary?: string | null
          total_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_release_date?: string | null
          id?: number
          involved_companies?: string | null
          is_popular?: boolean | null
          keywords?: string | null
          name?: string
          similar_games?: number[] | null
          slug?: string
          storyline?: string | null
          summary?: string | null
          total_rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      genres: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      ignored_platform_games: {
        Row: {
          created_at: string | null
          id: string
          platform_game_id: string
          platform_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform_game_id: string
          platform_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform_game_id?: string
          platform_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      platforms: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      screenshots: {
        Row: {
          game_id: number | null
          height: number | null
          id: number
          url: string
          width: number | null
        }
        Insert: {
          game_id?: number | null
          height?: number | null
          id?: number
          url: string
          width?: number | null
        }
        Update: {
          game_id?: number | null
          height?: number | null
          id?: number
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "screenshots_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      types: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id?: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
      user_games: {
        Row: {
          achievements_completed: number | null
          achievements_total: number | null
          created_at: string | null
          game_id: number | null
          id: string
          platform_id: number | null
          playtime_minutes: number | null
          rating: number | null
          review: string | null
          source: Database["public"]["Enums"]["game_source"]
          status: Database["public"]["Enums"]["game_status"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievements_completed?: number | null
          achievements_total?: number | null
          created_at?: string | null
          game_id?: number | null
          id?: string
          platform_id?: number | null
          playtime_minutes?: number | null
          rating?: number | null
          review?: string | null
          source: Database["public"]["Enums"]["game_source"]
          status: Database["public"]["Enums"]["game_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievements_completed?: number | null
          achievements_total?: number | null
          created_at?: string | null
          game_id?: number | null
          id?: string
          platform_id?: number | null
          playtime_minutes?: number | null
          rating?: number | null
          review?: string | null
          source?: Database["public"]["Enums"]["game_source"]
          status?: Database["public"]["Enums"]["game_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_games_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_platform_connections: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          platform_name: string
          platform_user_id: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          platform_name: string
          platform_user_id: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          platform_name?: string
          platform_user_id?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      website_types: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id?: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          game_id: number | null
          id: number
          trusted: boolean | null
          type_id: number | null
          url: string
        }
        Insert: {
          game_id?: number | null
          id?: number
          trusted?: boolean | null
          type_id?: number | null
          url: string
        }
        Update: {
          game_id?: number | null
          id?: number
          trusted?: boolean | null
          type_id?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "websites_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "websites_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "website_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      archive_game_message: {
        Args: {
          p_queue_name: string
          p_msg_id: number
        }
        Returns: undefined
      }
      check_queue_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          queue_name: string
          active_messages: number
          archived_messages: number
          deadletter_messages: number
        }[]
      }
      dequeue_games: {
        Args: {
          p_queue_name: string
          p_count?: number
          p_visibility_timeout?: number
        }
        Returns: {
          msg_id: number
          read_ct: number
          enqueued_at: string
          vt: string
          message: Json
        }[]
      }
      enqueue_game: {
        Args: {
          p_queue_name: string
          p_message: Json
        }
        Returns: number
      }
      get_user_by_username: {
        Args: {
          p_username: string
        }
        Returns: Json
      }
      process_game_queue: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      trigger_process_game_queue: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      game_source: "steam" | "gog" | "manual"
      game_status:
        | "finished"
        | "playing"
        | "dropped"
        | "online"
        | "want_to_play"
        | "backlog"
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

