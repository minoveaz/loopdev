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
    PostgrestVersion: "14.1"
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
  public: {
    Tables: {
      brand_context_versions: {
        Row: {
          brand_id: string
          created_at: string
          created_by: string | null
          id: string
          organization_id: string
          published_at: string | null
          snapshot: Json
          status: string
          version_number: number
        }
        Insert: {
          brand_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id: string
          published_at?: string | null
          snapshot?: Json
          status?: string
          version_number: number
        }
        Update: {
          brand_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id?: string
          published_at?: string | null
          snapshot?: Json
          status?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "brand_context_versions_brand_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "brand_context_versions_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          identity: Json | null
          logo_url: string | null
          logos: Json | null
          name: string
          organization_id: string
          palette: Json | null
          rules_engine: Json | null
          status: string
          typography: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          identity?: Json | null
          logo_url?: string | null
          logos?: Json | null
          name: string
          organization_id: string
          palette?: Json | null
          rules_engine?: Json | null
          status?: string
          typography?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          identity?: Json | null
          logo_url?: string | null
          logos?: Json | null
          name?: string
          organization_id?: string
          palette?: Json | null
          rules_engine?: Json | null
          status?: string
          typography?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_price_books: {
        Row: {
          brand_id: string | null
          created_at: string
          currency: string
          id: string
          name: string
          organization_id: string
          segment: string | null
          status: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          currency: string
          id?: string
          name: string
          organization_id: string
          segment?: string | null
          status?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          name?: string
          organization_id?: string
          segment?: string | null
          status?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_price_books_brand_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "catalog_price_books_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_price_entries: {
        Row: {
          billing_period: string
          created_at: string
          currency: string
          id: string
          metadata: Json
          min_quantity: number
          organization_id: string
          price_book_id: string
          product_id: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          billing_period?: string
          created_at?: string
          currency: string
          id?: string
          metadata?: Json
          min_quantity?: number
          organization_id: string
          price_book_id: string
          product_id: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          min_quantity?: number
          organization_id?: string
          price_book_id?: string
          product_id?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_price_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_price_entries_price_book_id_fkey"
            columns: ["price_book_id"]
            isOneToOne: false
            referencedRelation: "catalog_price_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_price_entries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_products: {
        Row: {
          brand_id: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name: string
          organization_id: string
          parent_product_id: string | null
          provider_id: string | null
          sku: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          organization_id: string
          parent_product_id?: string | null
          provider_id?: string | null
          sku: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          organization_id?: string
          parent_product_id?: string | null
          provider_id?: string | null
          sku?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_products_brand_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "catalog_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_products_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_entity_links: {
        Row: {
          communication_id: string
          communication_type: string
          created_at: string
          external_entity_id: string
          external_entity_type: string
          id: string
          relationship_type: string
          workspace_id: string
        }
        Insert: {
          communication_id: string
          communication_type: string
          created_at?: string
          external_entity_id: string
          external_entity_type: string
          id?: string
          relationship_type: string
          workspace_id: string
        }
        Update: {
          communication_id?: string
          communication_type?: string
          created_at?: string
          external_entity_id?: string
          external_entity_type?: string
          id?: string
          relationship_type?: string
          workspace_id?: string
        }
        Relationships: []
      }
      communications_ai_feedback: {
        Row: {
          action: string
          contact_category: string
          created_at: string
          detected_fields: string[]
          event_date: string
          id: string
          suggestion_pattern: string
          workspace_id: string
        }
        Insert: {
          action: string
          contact_category: string
          created_at?: string
          detected_fields?: string[]
          event_date?: string
          id?: string
          suggestion_pattern: string
          workspace_id: string
        }
        Update: {
          action?: string
          contact_category?: string
          created_at?: string
          detected_fields?: string[]
          event_date?: string
          id?: string
          suggestion_pattern?: string
          workspace_id?: string
        }
        Relationships: []
      }
      communications_ai_suggestions: {
        Row: {
          client_reference: string
          contact_id: string
          created_at: string
          fields: Json
          id: string
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          client_reference: string
          contact_id: string
          created_at?: string
          fields?: Json
          id?: string
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          client_reference?: string
          contact_id?: string
          created_at?: string
          fields?: Json
          id?: string
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_ai_suggestions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "communications_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_attachments: {
        Row: {
          created_at: string
          file_size: number | null
          id: string
          media_type: string
          message_id: string
          mime_type: string | null
          provider_media_id: string | null
          storage_path: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          id?: string
          media_type: string
          message_id: string
          mime_type?: string | null
          provider_media_id?: string | null
          storage_path?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          id?: string
          media_type?: string
          message_id?: string
          mime_type?: string | null
          provider_media_id?: string | null
          storage_path?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "communications_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_channels: {
        Row: {
          channel_type: string
          consent_source: string | null
          consent_status: string
          contact_id: string
          created_at: string
          id: string
          is_official: boolean
          is_primary: boolean
          phone_e164: string
          provider: string
          provider_account_id: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          channel_type?: string
          consent_source?: string | null
          consent_status?: string
          contact_id: string
          created_at?: string
          id?: string
          is_official?: boolean
          is_primary?: boolean
          phone_e164: string
          provider?: string
          provider_account_id?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          channel_type?: string
          consent_source?: string | null
          consent_status?: string
          contact_id?: string
          created_at?: string
          id?: string
          is_official?: boolean
          is_primary?: boolean
          phone_e164?: string
          provider?: string
          provider_account_id?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_channels_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "communications_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_contacts: {
        Row: {
          birthdate: string | null
          consent_source: string | null
          consent_status: string
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          metadata: Json
          phone_e164: string
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          birthdate?: string | null
          consent_source?: string | null
          consent_status?: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          metadata?: Json
          phone_e164: string
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          birthdate?: string | null
          consent_source?: string | null
          consent_status?: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          metadata?: Json
          phone_e164?: string
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      communications_conversation_imports: {
        Row: {
          contact_id: string
          error_code: string | null
          file_name: string
          id: string
          imported_at: string
          migration_id: string | null
          mime_type: string
          parsed_text: string | null
          status: string
          storage_path: string | null
          summary: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          contact_id: string
          error_code?: string | null
          file_name: string
          id?: string
          imported_at?: string
          migration_id?: string | null
          mime_type: string
          parsed_text?: string | null
          status?: string
          storage_path?: string | null
          summary?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          contact_id?: string
          error_code?: string | null
          file_name?: string
          id?: string
          imported_at?: string
          migration_id?: string | null
          mime_type?: string
          parsed_text?: string | null
          status?: string
          storage_path?: string | null
          summary?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_conversation_imports_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "communications_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_conversation_imports_migration_id_fkey"
            columns: ["migration_id"]
            isOneToOne: false
            referencedRelation: "communications_migrations"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_conversations: {
        Row: {
          assigned_user_id: string | null
          campaign: string | null
          channel_id: string
          channel_type: string
          contact_id: string
          created_at: string
          external_conversation_id: string | null
          id: string
          last_message_at: string | null
          metadata: Json
          provider: string
          provider_account_id: string | null
          referrer_code: string | null
          source: string | null
          status: string
          updated_at: string
          window_expires_at: string | null
          workspace_id: string
        }
        Insert: {
          assigned_user_id?: string | null
          campaign?: string | null
          channel_id: string
          channel_type?: string
          contact_id: string
          created_at?: string
          external_conversation_id?: string | null
          id?: string
          last_message_at?: string | null
          metadata?: Json
          provider?: string
          provider_account_id?: string | null
          referrer_code?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          window_expires_at?: string | null
          workspace_id: string
        }
        Update: {
          assigned_user_id?: string | null
          campaign?: string | null
          channel_id?: string
          channel_type?: string
          contact_id?: string
          created_at?: string
          external_conversation_id?: string | null
          id?: string
          last_message_at?: string | null
          metadata?: Json
          provider?: string
          provider_account_id?: string | null
          referrer_code?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          window_expires_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_conversations_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "communications_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "communications_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_events: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          created_at: string
          event_type: string
          id: string
          payload: Json
          workspace_id: string
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          workspace_id: string
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          workspace_id?: string
        }
        Relationships: []
      }
      communications_internal_notes: {
        Row: {
          author_id: string | null
          body: string
          conversation_id: string
          created_at: string
          id: string
          message_id: string | null
          workspace_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          message_id?: string | null
          workspace_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_internal_notes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "communications_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_internal_notes_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "communications_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_message_statuses: {
        Row: {
          created_at: string
          id: string
          message_id: string
          provider_timestamp: string | null
          raw_event_id: string | null
          status: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          provider_timestamp?: string | null
          raw_event_id?: string | null
          status: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          provider_timestamp?: string | null
          raw_event_id?: string | null
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_message_statuses_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "communications_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_message_statuses_raw_event_id_fkey"
            columns: ["raw_event_id"]
            isOneToOne: false
            referencedRelation: "communications_webhook_events"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_messages: {
        Row: {
          body: string | null
          conversation_id: string
          created_at: string
          direction: string
          external_message_id: string | null
          failure_code: string | null
          id: string
          media_reference: string | null
          message_type: string
          metadata: Json
          provider_timestamp: string | null
          reply_to_message_id: string | null
          status: string
          template_language: string | null
          template_name: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          body?: string | null
          conversation_id: string
          created_at?: string
          direction: string
          external_message_id?: string | null
          failure_code?: string | null
          id?: string
          media_reference?: string | null
          message_type: string
          metadata?: Json
          provider_timestamp?: string | null
          reply_to_message_id?: string | null
          status: string
          template_language?: string | null
          template_name?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          body?: string | null
          conversation_id?: string
          created_at?: string
          direction?: string
          external_message_id?: string | null
          failure_code?: string | null
          id?: string
          media_reference?: string | null
          message_type?: string
          metadata?: Json
          provider_timestamp?: string | null
          reply_to_message_id?: string | null
          status?: string
          template_language?: string | null
          template_name?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "communications_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "communications_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_migrations: {
        Row: {
          agent_notified_at: string | null
          consent_status: string
          contact_id: string
          created_at: string
          failure_code: string | null
          id: string
          metadata: Json
          migrated_at: string | null
          official_channel_id: string | null
          personal_channel_id: string | null
          status: string
          template_id: string | null
          template_sent_at: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          agent_notified_at?: string | null
          consent_status?: string
          contact_id: string
          created_at?: string
          failure_code?: string | null
          id?: string
          metadata?: Json
          migrated_at?: string | null
          official_channel_id?: string | null
          personal_channel_id?: string | null
          status?: string
          template_id?: string | null
          template_sent_at?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          agent_notified_at?: string | null
          consent_status?: string
          contact_id?: string
          created_at?: string
          failure_code?: string | null
          id?: string
          metadata?: Json
          migrated_at?: string | null
          official_channel_id?: string | null
          personal_channel_id?: string | null
          status?: string
          template_id?: string | null
          template_sent_at?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_migrations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "communications_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_migrations_official_channel_id_fkey"
            columns: ["official_channel_id"]
            isOneToOne: false
            referencedRelation: "communications_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_migrations_personal_channel_id_fkey"
            columns: ["personal_channel_id"]
            isOneToOne: false
            referencedRelation: "communications_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_migrations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communications_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_templates: {
        Row: {
          category: string | null
          created_at: string
          id: string
          language: string
          metadata: Json
          name: string
          provider: string
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          language: string
          metadata?: Json
          name: string
          provider?: string
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          language?: string
          metadata?: Json
          name?: string
          provider?: string
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      communications_webhook_events: {
        Row: {
          error_code: string | null
          event_type: string
          id: string
          payload_hash: string
          processed_at: string | null
          processing_status: string
          provider: string
          provider_event_id: string | null
          raw_payload: Json
          received_at: string
          retry_count: number
          workspace_id: string
        }
        Insert: {
          error_code?: string | null
          event_type: string
          id?: string
          payload_hash: string
          processed_at?: string | null
          processing_status?: string
          provider?: string
          provider_event_id?: string | null
          raw_payload: Json
          received_at?: string
          retry_count?: number
          workspace_id: string
        }
        Update: {
          error_code?: string | null
          event_type?: string
          id?: string
          payload_hash?: string
          processed_at?: string | null
          processing_status?: string
          provider?: string
          provider_event_id?: string | null
          raw_payload?: Json
          received_at?: string
          retry_count?: number
          workspace_id?: string
        }
        Relationships: []
      }
      content_briefs: {
        Row: {
          audience: string | null
          brand_id: string
          brand_version_id: string | null
          call_to_action: string | null
          campaign_id: string | null
          created_at: string
          created_by: string | null
          id: string
          locale: string
          name: string
          objective: string
          organization_id: string
          updated_at: string
          updated_by: string | null
          workspace_id: string | null
        }
        Insert: {
          audience?: string | null
          brand_id: string
          brand_version_id?: string | null
          call_to_action?: string | null
          campaign_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          locale?: string
          name: string
          objective: string
          organization_id: string
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string | null
        }
        Update: {
          audience?: string | null
          brand_id?: string
          brand_version_id?: string | null
          call_to_action?: string | null
          campaign_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          locale?: string
          name?: string
          objective?: string
          organization_id?: string
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_briefs_brand_id_organization_id_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "content_briefs_brand_version_id_fkey"
            columns: ["brand_version_id"]
            isOneToOne: false
            referencedRelation: "brand_context_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_briefs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaign_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_briefs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_briefs_workspace_id_organization_id_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      content_generation_jobs: {
        Row: {
          brand_id: string | null
          brand_version_id: string | null
          brief_id: string | null
          completed_at: string | null
          content_item_id: string | null
          created_at: string
          created_by: string | null
          id: string
          input_hash: string
          model: string
          organization_id: string
          provider: string
          status: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          brand_id?: string | null
          brand_version_id?: string | null
          brief_id?: string | null
          completed_at?: string | null
          content_item_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          input_hash: string
          model: string
          organization_id: string
          provider: string
          status: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          brand_id?: string | null
          brand_version_id?: string | null
          brief_id?: string | null
          completed_at?: string | null
          content_item_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          input_hash?: string
          model?: string
          organization_id?: string
          provider?: string
          status?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_generation_jobs_brand_id_organization_id_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "content_generation_jobs_brand_version_id_fkey"
            columns: ["brand_version_id"]
            isOneToOne: false
            referencedRelation: "brand_context_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_generation_jobs_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "content_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_generation_jobs_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_generation_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_generation_jobs_workspace_id_organization_id_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      content_items: {
        Row: {
          brand_id: string
          brand_version_id: string | null
          brief_id: string | null
          campaign_id: string | null
          created_at: string
          created_by: string | null
          current_version: number
          id: string
          locale: string
          organization_id: string
          status: string
          title: string
          type: string
          updated_at: string
          updated_by: string | null
          workspace_id: string | null
        }
        Insert: {
          brand_id: string
          brand_version_id?: string | null
          brief_id?: string | null
          campaign_id?: string | null
          created_at?: string
          created_by?: string | null
          current_version?: number
          id?: string
          locale?: string
          organization_id: string
          status?: string
          title: string
          type: string
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string | null
        }
        Update: {
          brand_id?: string
          brand_version_id?: string | null
          brief_id?: string | null
          campaign_id?: string | null
          created_at?: string
          created_by?: string | null
          current_version?: number
          id?: string
          locale?: string
          organization_id?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_brand_id_organization_id_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "content_items_brand_version_id_fkey"
            columns: ["brand_version_id"]
            isOneToOne: false
            referencedRelation: "brand_context_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "content_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaign_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_workspace_id_organization_id_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      content_versions: {
        Row: {
          body: string
          brand_id: string
          change_summary: string | null
          content_item_id: string
          created_at: string
          created_by: string | null
          id: string
          organization_id: string
          version: number
          workspace_id: string | null
        }
        Insert: {
          body: string
          brand_id: string
          change_summary?: string | null
          content_item_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id: string
          version: number
          workspace_id?: string | null
        }
        Update: {
          body?: string
          brand_id?: string
          change_summary?: string | null
          content_item_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id?: string
          version?: number
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_brand_id_organization_id_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "content_versions_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_versions_workspace_id_organization_id_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          actor_user_id: string | null
          created_at: string
          details: string | null
          id: string
          lead_id: string
          metadata: Json
          occurred_at: string
          organization_id: string
          summary: string
          type: string
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          lead_id: string
          metadata?: Json
          occurred_at?: string
          organization_id: string
          summary: string
          type: string
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          lead_id?: string
          metadata?: Json
          occurred_at?: string
          organization_id?: string
          summary?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_audit_events: {
        Row: {
          action: string
          actor_user_id: string | null
          after_state: Json | null
          before_state: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json
          organization_id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json
          organization_id: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_audit_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_companies: {
        Row: {
          created_at: string
          email: string | null
          id: string
          legal_name: string | null
          name: string
          organization_id: string
          phone: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          name: string
          organization_id: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          name?: string
          organization_id?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_companies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contact_companies: {
        Row: {
          company_id: string
          contact_id: string
          created_at: string
          is_primary: boolean
          organization_id: string
          role: string
          updated_at: string
        }
        Insert: {
          company_id: string
          contact_id: string
          created_at?: string
          is_primary?: boolean
          organization_id: string
          role?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          contact_id?: string
          created_at?: string
          is_primary?: boolean
          organization_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contact_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contact_companies_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contact_companies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contact_consents: {
        Row: {
          channel: string
          contact_id: string
          created_at: string
          granted_at: string | null
          id: string
          organization_id: string
          purpose: string
          source: string | null
          status: string
          updated_at: string
          withdrawn_at: string | null
        }
        Insert: {
          channel: string
          contact_id: string
          created_at?: string
          granted_at?: string | null
          id?: string
          organization_id: string
          purpose: string
          source?: string | null
          status: string
          updated_at?: string
          withdrawn_at?: string | null
        }
        Update: {
          channel?: string
          contact_id?: string
          created_at?: string
          granted_at?: string | null
          id?: string
          organization_id?: string
          purpose?: string
          source?: string | null
          status?: string
          updated_at?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_contact_consents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contact_consents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          email_normalized: string | null
          first_name: string
          id: string
          last_name: string | null
          organization_id: string
          phone: string | null
          phone_normalized: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          email_normalized?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          organization_id: string
          phone?: string | null
          phone_normalized?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          email_normalized?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          organization_id?: string
          phone?: string | null
          phone_normalized?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_attributions: {
        Row: {
          campaign: string | null
          captured_at: string
          content: string | null
          id: string
          lead_id: string
          medium: string | null
          organization_id: string
          source: string
          term: string | null
        }
        Insert: {
          campaign?: string | null
          captured_at?: string
          content?: string | null
          id?: string
          lead_id: string
          medium?: string | null
          organization_id: string
          source: string
          term?: string | null
        }
        Update: {
          campaign?: string | null
          captured_at?: string
          content?: string | null
          id?: string
          lead_id?: string
          medium?: string | null
          organization_id?: string
          source?: string
          term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_attributions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_attributions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          assigned_to_user_id: string | null
          brand_id: string | null
          campaign: string | null
          contact_id: string
          created_at: string
          id: string
          organization_id: string
          source: string
          external_lead_id: string | null
          stage: string
          status: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          assigned_to_user_id?: string | null
          brand_id?: string | null
          campaign?: string | null
          contact_id: string
          created_at?: string
          id?: string
          organization_id: string
          source?: string
          external_lead_id?: string | null
          stage?: string
          status?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          assigned_to_user_id?: string | null
          brand_id?: string | null
          campaign?: string | null
          contact_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          source?: string
          external_lead_id?: string | null
          stage?: string
          status?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_brand_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "crm_leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_workspace_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      crm_notes: {
        Row: {
          author_user_id: string
          body: string
          contact_id: string | null
          created_at: string
          id: string
          lead_id: string | null
          opportunity_id: string | null
          organization_id: string
          updated_at: string
          visibility: string
        }
        Insert: {
          author_user_id: string
          body: string
          contact_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          organization_id: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          author_user_id?: string
          body?: string
          contact_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          organization_id?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_notes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_opportunities: {
        Row: {
          amount: number | null
          created_at: string
          currency: string
          expected_close_at: string | null
          id: string
          lead_id: string
          name: string
          organization_id: string
          probability: number | null
          stage: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string
          expected_close_at?: string | null
          id?: string
          lead_id: string
          name: string
          organization_id: string
          probability?: number | null
          stage?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string
          expected_close_at?: string | null
          id?: string
          lead_id?: string
          name?: string
          organization_id?: string
          probability?: number | null
          stage?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_opportunities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_workspace_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      crm_opportunity_products: {
        Row: {
          created_at: string
          currency: string
          id: string
          metadata: Json
          opportunity_id: string
          organization_id: string
          price_entry_id: string | null
          product_id: string
          quantity: number
          quote_id: string | null
          total_price: number | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          opportunity_id: string
          organization_id: string
          price_entry_id?: string | null
          product_id: string
          quantity?: number
          quote_id?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          opportunity_id?: string
          organization_id?: string
          price_entry_id?: string | null
          product_id?: string
          quantity?: number
          quote_id?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_opportunity_products_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunity_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunity_products_price_entry_id_fkey"
            columns: ["price_entry_id"]
            isOneToOne: false
            referencedRelation: "catalog_price_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunity_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipeline_stages: {
        Row: {
          created_at: string
          id: string
          is_terminal: boolean
          key: string
          label: string
          organization_id: string
          position: number
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_terminal?: boolean
          key: string
          label: string
          organization_id: string
          position: number
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_terminal?: boolean
          key?: string
          label?: string
          organization_id?: string
          position?: number
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_pipeline_stages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_pipeline_stages_workspace_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      crm_related_people: {
        Row: {
          contact_id: string
          created_at: string
          date_of_birth: string | null
          first_name: string
          id: string
          is_contactable: boolean
          last_name: string | null
          organization_id: string
          role: string
          updated_at: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          date_of_birth?: string | null
          first_name: string
          id?: string
          is_contactable?: boolean
          last_name?: string | null
          organization_id: string
          role: string
          updated_at?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          id?: string
          is_contactable?: boolean
          last_name?: string | null
          organization_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_related_people_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_related_people_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tasks: {
        Row: {
          assigned_to_user_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          lead_id: string
          organization_id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to_user_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id: string
          organization_id: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to_user_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string
          organization_id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaign_publications: {
        Row: {
          account_handle: string | null
          brand_id: string
          campaign_id: string
          canonical_campaign_id: string | null
          content_id: string | null
          created_at: string
          external_post_id: string | null
          id: string
          link_id: string | null
          notes: string | null
          organization_id: string
          platform: string
          publication_url: string
          published_at: string | null
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          account_handle?: string | null
          brand_id: string
          campaign_id: string
          canonical_campaign_id?: string | null
          content_id?: string | null
          created_at?: string
          external_post_id?: string | null
          id?: string
          link_id?: string | null
          notes?: string | null
          organization_id: string
          platform: string
          publication_url: string
          published_at?: string | null
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          account_handle?: string | null
          brand_id?: string
          campaign_id?: string
          canonical_campaign_id?: string | null
          content_id?: string | null
          created_at?: string
          external_post_id?: string | null
          id?: string
          link_id?: string | null
          notes?: string | null
          organization_id?: string
          platform?: string
          publication_url?: string
          published_at?: string | null
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaign_publications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_campaign_publications_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "marketing_link_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_campaign_publications_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "marketing_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_publications_brand_organization_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "marketing_publications_canonical_campaign_fkey"
            columns: ["canonical_campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaign_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_publications_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_publications_workspace_organization_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      marketing_campaign_records: {
        Row: {
          assets: Json
          brand_id: string
          brand_version_id: string | null
          budget: number | null
          copies: Json
          created_at: string
          created_by: string | null
          currency: string
          ends_at: string | null
          id: string
          legacy_id: string | null
          name: string
          objective: string
          organization_id: string
          platforms: string[]
          starts_at: string | null
          status: string
          updated_at: string
          updated_by: string | null
          workspace_id: string
        }
        Insert: {
          assets?: Json
          brand_id: string
          brand_version_id?: string | null
          budget?: number | null
          copies?: Json
          created_at?: string
          created_by?: string | null
          currency?: string
          ends_at?: string | null
          id?: string
          legacy_id?: string | null
          name: string
          objective?: string
          organization_id: string
          platforms?: string[]
          starts_at?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          workspace_id: string
        }
        Update: {
          assets?: Json
          brand_id?: string
          brand_version_id?: string | null
          budget?: number | null
          copies?: Json
          created_at?: string
          created_by?: string | null
          currency?: string
          ends_at?: string | null
          id?: string
          legacy_id?: string | null
          name?: string
          objective?: string
          organization_id?: string
          platforms?: string[]
          starts_at?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaign_records_brand_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "marketing_campaign_records_brand_version_fkey"
            columns: ["brand_version_id"]
            isOneToOne: false
            referencedRelation: "brand_context_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_campaign_records_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_campaign_records_workspace_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          assets: Json | null
          automatic_platforms: string[] | null
          automatic_platforms_configured: boolean | null
          brand_id: string
          content_types: string[] | null
          copies: Json | null
          created_at: string | null
          id: string
          name: string
          objective: string | null
          organization_id: string
          platforms: string[] | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          assets?: Json | null
          automatic_platforms?: string[] | null
          automatic_platforms_configured?: boolean | null
          brand_id: string
          content_types?: string[] | null
          copies?: Json | null
          created_at?: string | null
          id: string
          name: string
          objective?: string | null
          organization_id: string
          platforms?: string[] | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          assets?: Json | null
          automatic_platforms?: string[] | null
          automatic_platforms_configured?: boolean | null
          brand_id?: string
          content_types?: string[] | null
          copies?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          objective?: string | null
          organization_id?: string
          platforms?: string[] | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_brand_organization_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "marketing_campaigns_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_campaigns_workspace_organization_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      marketing_link_clicks: {
        Row: {
          brand_id: string
          browser: string | null
          clicked_at: string
          country_code: string | null
          device: string | null
          id: string
          landing_url: string | null
          language: string | null
          link_id: string
          operating_system: string | null
          organization_id: string
          redirect_status: string
          referrer: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          workspace_id: string
        }
        Insert: {
          brand_id: string
          browser?: string | null
          clicked_at?: string
          country_code?: string | null
          device?: string | null
          id?: string
          landing_url?: string | null
          language?: string | null
          link_id: string
          operating_system?: string | null
          organization_id: string
          redirect_status?: string
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          workspace_id: string
        }
        Update: {
          brand_id?: string
          browser?: string | null
          clicked_at?: string
          country_code?: string | null
          device?: string | null
          id?: string
          landing_url?: string | null
          language?: string | null
          link_id?: string
          operating_system?: string | null
          organization_id?: string
          redirect_status?: string
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_link_clicks_brand_organization_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "marketing_link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "marketing_link_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "marketing_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_link_clicks_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_link_clicks_workspace_organization_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      marketing_links: {
        Row: {
          active: boolean
          brand_id: string
          campaign_id: string | null
          canonical_campaign_id: string | null
          channel: string
          content_id: string | null
          created_at: string
          id: string
          message: string
          name: string
          organization_id: string
          phone: string
          placement: string | null
          slug: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          active?: boolean
          brand_id: string
          campaign_id?: string | null
          canonical_campaign_id?: string | null
          channel?: string
          content_id?: string | null
          created_at?: string
          id: string
          message: string
          name: string
          organization_id: string
          phone: string
          placement?: string | null
          slug: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          active?: boolean
          brand_id?: string
          campaign_id?: string | null
          canonical_campaign_id?: string | null
          channel?: string
          content_id?: string | null
          created_at?: string
          id?: string
          message?: string
          name?: string
          organization_id?: string
          phone?: string
          placement?: string | null
          slug?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_links_brand_organization_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "marketing_links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_links_canonical_campaign_fkey"
            columns: ["canonical_campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaign_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_links_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_links_workspace_organization_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      oauth_connections: {
        Row: {
          brand_id: string
          created_at: string
          created_by: string
          credential_ref: string
          display_name: string | null
          expires_at: string | null
          external_account_id: string
          id: string
          organization_id: string
          provider: string
          scopes: string[]
          updated_at: string
          workspace_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          created_by: string
          credential_ref: string
          display_name?: string | null
          expires_at?: string | null
          external_account_id: string
          id?: string
          organization_id: string
          provider: string
          scopes?: string[]
          updated_at?: string
          workspace_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          created_by?: string
          credential_ref?: string
          display_name?: string | null
          expires_at?: string | null
          external_account_id?: string
          id?: string
          organization_id?: string
          provider?: string
          scopes?: string[]
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_connections_brand_organization_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "oauth_connections_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oauth_connections_workspace_organization_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      oauth_states: {
        Row: {
          brand_id: string
          created_at: string
          expires_at: string
          organization_id: string
          provider: string
          state_hash: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          expires_at?: string
          organization_id: string
          provider: string
          state_hash: string
          user_id: string
          workspace_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          expires_at?: string
          organization_id?: string
          provider?: string
          state_hash?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_states_brand_organization_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "oauth_states_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oauth_states_workspace_organization_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      organization_memberships: {
        Row: {
          created_at: string
          organization_id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          legacy_tenant_id: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          legacy_tenant_id?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          legacy_tenant_id?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_legacy_tenant_id_fkey"
            columns: ["legacy_tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string
          key: string
          scope: string
        }
        Insert: {
          created_at?: string
          description: string
          key: string
          scope?: string
        }
        Update: {
          created_at?: string
          description?: string
          key?: string
          scope?: string
        }
        Relationships: []
      }
      platform_administrators: {
        Row: {
          created_at: string
          created_by: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      quant_assets: {
        Row: {
          category: string
          created_at: string | null
          is_active: boolean | null
          name: string
          providers: string[] | null
          symbol: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          is_active?: boolean | null
          name: string
          providers?: string[] | null
          symbol: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          is_active?: boolean | null
          name?: string
          providers?: string[] | null
          symbol?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quant_audit_logs: {
        Row: {
          bot_id: string
          created_at: string | null
          event_type: string
          id: string
          logic_snapshot: Json | null
          organization_id: string
          pair: string
          pnl_pct: number | null
          price: number
          side: string | null
          tenant_id: string | null
        }
        Insert: {
          bot_id: string
          created_at?: string | null
          event_type: string
          id?: string
          logic_snapshot?: Json | null
          organization_id: string
          pair: string
          pnl_pct?: number | null
          price: number
          side?: string | null
          tenant_id?: string | null
        }
        Update: {
          bot_id?: string
          created_at?: string | null
          event_type?: string
          id?: string
          logic_snapshot?: Json | null
          organization_id?: string
          pair?: string
          pnl_pct?: number | null
          price?: number
          side?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quant_audit_logs_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "quant_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_book_metrics: {
        Row: {
          depth_usdt: number
          imbalance_pct: number
          metadata: Json | null
          mid_price: number
          pair: string
          spread_pct: number
          timestamp: string
        }
        Insert: {
          depth_usdt: number
          imbalance_pct: number
          metadata?: Json | null
          mid_price: number
          pair: string
          spread_pct: number
          timestamp: string
        }
        Update: {
          depth_usdt?: number
          imbalance_pct?: number
          metadata?: Json | null
          mid_price?: number
          pair?: string
          spread_pct?: number
          timestamp?: string
        }
        Relationships: []
      }
      quant_bots: {
        Row: {
          avg_pnl_pct: number | null
          base_investment_usdt: number
          created_at: string | null
          current_action: string | null
          current_entry_price: number | null
          current_pnl_pct: number | null
          current_pnl_usdt: number | null
          current_position_max_price: number | null
          current_position_min_price: number | null
          current_position_opened_at: string | null
          current_position_side: string | null
          exchange_id: string | null
          id: string
          last_atr: number | null
          last_exit_targets: Json | null
          last_logic_snapshot: Json | null
          last_metrics_update: string | null
          last_price: number | null
          last_sentiment: string | null
          last_sma: number | null
          losing_trades: number | null
          name: string
          organization_id: string
          pair: string
          pending_command: string | null
          price_history_1h: Json | null
          risk_profile: Json
          signal_strength: number | null
          status: string
          strategy_id: string | null
          tenant_id: string
          total_trades: number | null
          trailing_stop_distance: number | null
          updated_at: string | null
          use_initial_range_filter: boolean | null
          use_market_regime_filter: boolean | null
          winning_trades: number | null
        }
        Insert: {
          avg_pnl_pct?: number | null
          base_investment_usdt: number
          created_at?: string | null
          current_action?: string | null
          current_entry_price?: number | null
          current_pnl_pct?: number | null
          current_pnl_usdt?: number | null
          current_position_max_price?: number | null
          current_position_min_price?: number | null
          current_position_opened_at?: string | null
          current_position_side?: string | null
          exchange_id?: string | null
          id?: string
          last_atr?: number | null
          last_exit_targets?: Json | null
          last_logic_snapshot?: Json | null
          last_metrics_update?: string | null
          last_price?: number | null
          last_sentiment?: string | null
          last_sma?: number | null
          losing_trades?: number | null
          name: string
          organization_id: string
          pair: string
          pending_command?: string | null
          price_history_1h?: Json | null
          risk_profile?: Json
          signal_strength?: number | null
          status?: string
          strategy_id?: string | null
          tenant_id: string
          total_trades?: number | null
          trailing_stop_distance?: number | null
          updated_at?: string | null
          use_initial_range_filter?: boolean | null
          use_market_regime_filter?: boolean | null
          winning_trades?: number | null
        }
        Update: {
          avg_pnl_pct?: number | null
          base_investment_usdt?: number
          created_at?: string | null
          current_action?: string | null
          current_entry_price?: number | null
          current_pnl_pct?: number | null
          current_pnl_usdt?: number | null
          current_position_max_price?: number | null
          current_position_min_price?: number | null
          current_position_opened_at?: string | null
          current_position_side?: string | null
          exchange_id?: string | null
          id?: string
          last_atr?: number | null
          last_exit_targets?: Json | null
          last_logic_snapshot?: Json | null
          last_metrics_update?: string | null
          last_price?: number | null
          last_sentiment?: string | null
          last_sma?: number | null
          losing_trades?: number | null
          name?: string
          organization_id?: string
          pair?: string
          pending_command?: string | null
          price_history_1h?: Json | null
          risk_profile?: Json
          signal_strength?: number | null
          status?: string
          strategy_id?: string | null
          tenant_id?: string
          total_trades?: number | null
          trailing_stop_distance?: number | null
          updated_at?: string | null
          use_initial_range_filter?: boolean | null
          use_market_regime_filter?: boolean | null
          winning_trades?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_bot_strategy"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "quant_strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_bots_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "quant_exchanges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_bots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_bots_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_exchanges: {
        Row: {
          api_key: string
          api_secret: string
          created_at: string | null
          exchange_provider: string
          id: string
          is_active: boolean | null
          is_paper: boolean | null
          last_error_message: string | null
          last_verified_at: string | null
          name: string
          organization_id: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          api_key: string
          api_secret: string
          created_at?: string | null
          exchange_provider?: string
          id?: string
          is_active?: boolean | null
          is_paper?: boolean | null
          last_error_message?: string | null
          last_verified_at?: string | null
          name: string
          organization_id: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string
          api_secret?: string
          created_at?: string | null
          exchange_provider?: string
          id?: string
          is_active?: boolean | null
          is_paper?: boolean | null
          last_error_message?: string | null
          last_verified_at?: string | null
          name?: string
          organization_id?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quant_exchanges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_exchanges_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_market_config: {
        Row: {
          created_at: string | null
          fetch_interval: string | null
          id: string
          is_active: boolean | null
          last_backfill_at: string | null
          pair: string
          retention_days: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fetch_interval?: string | null
          id?: string
          is_active?: boolean | null
          last_backfill_at?: string | null
          pair: string
          retention_days?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fetch_interval?: string | null
          id?: string
          is_active?: boolean | null
          last_backfill_at?: string | null
          pair?: string
          retention_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quant_market_history: {
        Row: {
          close: number
          created_at: string | null
          environment: Database["public"]["Enums"]["trading_environment"]
          high: number
          id: string
          latency_ms: number | null
          low: number
          open: number
          pair: string
          provider: string | null
          timeframe: string
          timestamp: string
          volume: number
        }
        Insert: {
          close: number
          created_at?: string | null
          environment?: Database["public"]["Enums"]["trading_environment"]
          high: number
          id?: string
          latency_ms?: number | null
          low: number
          open: number
          pair: string
          provider?: string | null
          timeframe: string
          timestamp: string
          volume: number
        }
        Update: {
          close?: number
          created_at?: string | null
          environment?: Database["public"]["Enums"]["trading_environment"]
          high?: number
          id?: string
          latency_ms?: number | null
          low?: number
          open?: number
          pair?: string
          provider?: string | null
          timeframe?: string
          timestamp?: string
          volume?: number
        }
        Relationships: []
      }
      quant_orders: {
        Row: {
          average_fill_price: number | null
          bot_id: string | null
          created_at: string | null
          error_message: string | null
          exchange_order_id: string | null
          fee_amount: number | null
          fee_currency: string | null
          fee_usdt: number | null
          filled_quantity: number | null
          id: string
          organization_id: string
          pnl_pct: number | null
          price: number | null
          quantity: number
          side: string
          signal_id: string | null
          signal_source: string | null
          status: string
          tenant_id: string
          type: string
        }
        Insert: {
          average_fill_price?: number | null
          bot_id?: string | null
          created_at?: string | null
          error_message?: string | null
          exchange_order_id?: string | null
          fee_amount?: number | null
          fee_currency?: string | null
          fee_usdt?: number | null
          filled_quantity?: number | null
          id?: string
          organization_id: string
          pnl_pct?: number | null
          price?: number | null
          quantity: number
          side: string
          signal_id?: string | null
          signal_source?: string | null
          status: string
          tenant_id: string
          type: string
        }
        Update: {
          average_fill_price?: number | null
          bot_id?: string | null
          created_at?: string | null
          error_message?: string | null
          exchange_order_id?: string | null
          fee_amount?: number | null
          fee_currency?: string | null
          fee_usdt?: number | null
          filled_quantity?: number | null
          id?: string
          organization_id?: string
          pnl_pct?: number | null
          price?: number | null
          quantity?: number
          side?: string
          signal_id?: string | null
          signal_source?: string | null
          status?: string
          tenant_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quant_orders_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "quant_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_orders_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "quant_signals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_positions: {
        Row: {
          average_price: number
          bot_id: string | null
          created_at: string | null
          entry_price: number
          id: string
          last_updated: string | null
          organization_id: string
          pair: string
          rebuys_count: number | null
          tenant_id: string
          total_invested_usdt: number
          total_quantity: number
          unrealized_pnl_pct: number | null
          unrealized_pnl_usdt: number | null
        }
        Insert: {
          average_price: number
          bot_id?: string | null
          created_at?: string | null
          entry_price: number
          id?: string
          last_updated?: string | null
          organization_id: string
          pair: string
          rebuys_count?: number | null
          tenant_id: string
          total_invested_usdt: number
          total_quantity: number
          unrealized_pnl_pct?: number | null
          unrealized_pnl_usdt?: number | null
        }
        Update: {
          average_price?: number
          bot_id?: string | null
          created_at?: string | null
          entry_price?: number
          id?: string
          last_updated?: string | null
          organization_id?: string
          pair?: string
          rebuys_count?: number | null
          tenant_id?: string
          total_invested_usdt?: number
          total_quantity?: number
          unrealized_pnl_pct?: number | null
          unrealized_pnl_usdt?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quant_positions_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: true
            referencedRelation: "quant_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_positions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_positions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_risk_settings: {
        Row: {
          alert_threshold_pct: number | null
          id: string
          kill_switch_active: boolean | null
          max_concurrent_bots: number | null
          max_daily_loss_usdt: number | null
          max_total_exposure_usdt: number | null
          organization_id: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          alert_threshold_pct?: number | null
          id?: string
          kill_switch_active?: boolean | null
          max_concurrent_bots?: number | null
          max_daily_loss_usdt?: number | null
          max_total_exposure_usdt?: number | null
          organization_id: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          alert_threshold_pct?: number | null
          id?: string
          kill_switch_active?: boolean | null
          max_concurrent_bots?: number | null
          max_daily_loss_usdt?: number | null
          max_total_exposure_usdt?: number | null
          organization_id?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quant_risk_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_risk_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_signals: {
        Row: {
          bot_id: string | null
          created_at: string | null
          environment: Database["public"]["Enums"]["trading_environment"]
          id: string
          metadata: Json
          organization_id: string
          pair: string
          price: number
          side: string
          status: string
          tenant_id: string
        }
        Insert: {
          bot_id?: string | null
          created_at?: string | null
          environment?: Database["public"]["Enums"]["trading_environment"]
          id?: string
          metadata?: Json
          organization_id: string
          pair: string
          price: number
          side: string
          status?: string
          tenant_id: string
        }
        Update: {
          bot_id?: string | null
          created_at?: string | null
          environment?: Database["public"]["Enums"]["trading_environment"]
          id?: string
          metadata?: Json
          organization_id?: string
          pair?: string
          price?: number
          side?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quant_signals_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "quant_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_signals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_strategies: {
        Row: {
          cooldown_minutes: number | null
          core_id: string
          created_at: string | null
          daily_loss_limit: number | null
          description: string | null
          exchange_id: string | null
          id: string
          max_exposure: number
          max_positions: number
          mode: string
          name: string
          organization_id: string
          pairs: string[] | null
          parameters: Json | null
          size_per_trade: number
          status: string
          stop_loss: number
          take_profit: number
          tenant_id: string
          trading_style: string | null
          trailing_stop: number | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          cooldown_minutes?: number | null
          core_id?: string
          created_at?: string | null
          daily_loss_limit?: number | null
          description?: string | null
          exchange_id?: string | null
          id?: string
          max_exposure?: number
          max_positions?: number
          mode: string
          name: string
          organization_id: string
          pairs?: string[] | null
          parameters?: Json | null
          size_per_trade?: number
          status?: string
          stop_loss?: number
          take_profit?: number
          tenant_id: string
          trading_style?: string | null
          trailing_stop?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          cooldown_minutes?: number | null
          core_id?: string
          created_at?: string | null
          daily_loss_limit?: number | null
          description?: string | null
          exchange_id?: string | null
          id?: string
          max_exposure?: number
          max_positions?: number
          mode?: string
          name?: string
          organization_id?: string
          pairs?: string[] | null
          parameters?: Json | null
          size_per_trade?: number
          status?: string
          stop_loss?: number
          take_profit?: number
          tenant_id?: string
          trading_style?: string | null
          trailing_stop?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quant_strategies_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "quant_exchanges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_strategies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quant_strategies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_system_health: {
        Row: {
          component_id: string
          last_heartbeat: string | null
          metadata: Json | null
          status: string | null
        }
        Insert: {
          component_id: string
          last_heartbeat?: string | null
          metadata?: Json | null
          status?: string | null
        }
        Update: {
          component_id?: string
          last_heartbeat?: string | null
          metadata?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_key: string
          role: string
        }
        Insert: {
          created_at?: string
          permission_key: string
          role: string
        }
        Update: {
          created_at?: string
          permission_key?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["key"]
          },
        ]
      }
      social_profiles: {
        Row: {
          brand_id: string
          id: string
          organization_id: string
          platform: string
          updated_at: string | null
          url: string
          username: string | null
          workspace_id: string
        }
        Insert: {
          brand_id: string
          id?: string
          organization_id: string
          platform: string
          updated_at?: string | null
          url: string
          username?: string | null
          workspace_id: string
        }
        Update: {
          brand_id?: string
          id?: string
          organization_id?: string
          platform?: string
          updated_at?: string | null
          url?: string
          username?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_profiles_brand_organization_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "social_profiles_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_profiles_workspace_organization_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      strategy_backtest_results: {
        Row: {
          avg_loss: number | null
          avg_win: number | null
          created_at: string | null
          end_date: string
          final_capital: number
          id: string
          initial_capital: number
          losing_trades: number
          max_drawdown: number
          organization_id: string
          profit_factor: number
          sharpe_ratio: number | null
          start_date: string
          status: string | null
          strategy_id: string
          total_return: number
          total_trades: number
          trades: Json | null
          win_rate: number
          winning_trades: number
        }
        Insert: {
          avg_loss?: number | null
          avg_win?: number | null
          created_at?: string | null
          end_date: string
          final_capital: number
          id?: string
          initial_capital: number
          losing_trades: number
          max_drawdown: number
          organization_id: string
          profit_factor: number
          sharpe_ratio?: number | null
          start_date: string
          status?: string | null
          strategy_id: string
          total_return: number
          total_trades: number
          trades?: Json | null
          win_rate: number
          winning_trades: number
        }
        Update: {
          avg_loss?: number | null
          avg_win?: number | null
          created_at?: string | null
          end_date?: string
          final_capital?: number
          id?: string
          initial_capital?: number
          losing_trades?: number
          max_drawdown?: number
          organization_id?: string
          profit_factor?: number
          sharpe_ratio?: number | null
          start_date?: string
          status?: string | null
          strategy_id?: string
          total_return?: number
          total_trades?: number
          trades?: Json | null
          win_rate?: number
          winning_trades?: number
        }
        Relationships: [
          {
            foreignKeyName: "strategy_backtest_results_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_backtest_results_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "quant_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      workspace_brands: {
        Row: {
          brand_id: string
          created_at: string
          organization_id: string
          workspace_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          organization_id: string
          workspace_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          organization_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_brands_brand_id_organization_id_fkey"
            columns: ["brand_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "workspace_brands_workspace_id_organization_id_fkey"
            columns: ["workspace_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      workspaces: {
        Row: {
          configuration: Json
          created_at: string
          id: string
          name: string
          organization_id: string
          slug: string
          status: string
          suite_key: string
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          id?: string
          name: string
          organization_id: string
          slug: string
          status?: string
          suite_key: string
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          slug?: string
          status?: string
          suite_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      marketing_link_stats: {
        Row: {
          clicks: number | null
          id: string | null
          last_clicked_at: string | null
          slug: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_access_workspace: {
        Args: { target_workspace_id: string }
        Returns: boolean
      }
      can_manage_workspace: {
        Args: { target_workspace_id: string }
        Returns: boolean
      }
      can_view_legacy_tenant: {
        Args: { target_tenant_id: string }
        Returns: boolean
      }
      consume_oauth_state: {
        Args: { p_provider: string; p_state_hash: string }
        Returns: boolean
      }
      decrypt_api_key: {
        Args: { encrypted_text: string; secret_key: string }
        Returns: string
      }
      delete_oauth_connection: {
        Args: { p_external_account_id: string; p_provider: string }
        Returns: boolean
      }
      encrypt_api_key: {
        Args: { plaintext: string; secret_key: string }
        Returns: string
      }
      get_my_marketing_role: { Args: never; Returns: string }
      has_any_organization_permission: {
        Args: { required_permission: string }
        Returns: boolean
      }
      has_marketing_role: { Args: { required_role: string }; Returns: boolean }
      has_organization_permission: {
        Args: { required_permission: string; target_organization_id: string }
        Returns: boolean
      }
      has_organization_role: {
        Args: { allowed_roles: string[]; target_organization_id: string }
        Returns: boolean
      }
      has_platform_role: { Args: { required_role: string }; Returns: boolean }
      is_organization_member: {
        Args: { target_organization_id: string }
        Returns: boolean
      }
      is_platform_administrator: { Args: never; Returns: boolean }
      register_oauth_state: {
        Args: { p_provider: string; p_state_hash: string }
        Returns: undefined
      }
      store_oauth_connection_secret: {
        Args: {
          p_access_token: string
          p_display_name: string
          p_expires_at: string
          p_external_account_id: string
          p_provider: string
          p_refresh_token: string
          p_scopes: string[]
        }
        Returns: string
      }
    }
    Enums: {
      trading_environment: "testnet" | "production"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      trading_environment: ["testnet", "production"],
    },
  },
} as const
