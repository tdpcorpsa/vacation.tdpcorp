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
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          key_hash: string
          last_used_at: string | null
          name: string
          plain_key: string | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          last_used_at?: string | null
          name: string
          plain_key?: string | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          last_used_at?: string | null
          name?: string
          plain_key?: string | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      apps: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          perms: Json | null
          subdomain: string | null
          update_at: string | null
          updated_by: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          perms?: Json | null
          subdomain?: string | null
          update_at?: string | null
          updated_by?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          perms?: Json | null
          subdomain?: string | null
          update_at?: string | null
          updated_by?: string | null
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_superuser: boolean
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_superuser?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_superuser?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_app_perms: {
        Row: {
          app_id: string
          created_at: string | null
          id: string
          perms: Json
          role_id: string
          updated_at: string | null
        }
        Insert: {
          app_id: string
          created_at?: string | null
          id: string
          perms: Json
          role_id: string
          updated_at?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string | null
          id?: string
          perms?: Json
          role_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'role_app_perms_app_id_fkey'
            columns: ['app_id']
            isOneToOne: false
            referencedRelation: 'apps'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'role_app_perms_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_roles_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      users_view: {
        Row: {
          address: string | null
          avatar_url: string | null
          banned_until: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          is_superuser: boolean | null
          last_name: string | null
          last_sign_in_at: string | null
          phone: string | null
          roles: Json | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      validate_api_key: {
        Args: { in_key: string }
        Returns: {
          api_key_id: string
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  vacation: {
    Tables: {
      employees: {
        Row: {
          created_at: string
          hire_date: string | null
          id: string
          labor_regime_id: string | null
          manager_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          hire_date?: string | null
          id: string
          labor_regime_id?: string | null
          manager_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          hire_date?: string | null
          id?: string
          labor_regime_id?: string | null
          manager_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'employees_labor_regime_id_fkey'
            columns: ['labor_regime_id']
            isOneToOne: false
            referencedRelation: 'labor_regime'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'employees_manager_id_fkey'
            columns: ['manager_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
        ]
      }
      labor_regime: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          days: number
          policies: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          days: number
          policies?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          days?: number
          policies?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      vacation_periods: {
        Row: {
          available_days: number
          created_at: string
          employee_id: string
          end_date: string
          id: string
          period_label: string
          start_date: string
          total_days: number
          updated_at: string
        }
        Insert: {
          available_days: number
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          period_label: string
          start_date: string
          total_days?: number
          updated_at?: string
        }
        Update: {
          available_days?: number
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          period_label?: string
          start_date?: string
          total_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vacation_periods_employee_id_fkey'
            columns: ['employee_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
        ]
      }
      vacation_requests: {
        Row: {
          created_at: string
          created_by: string
          decided_at: string | null
          decided_by: string | null
          employee_id: string
          end_date: string
          id: string
          request_note: string | null
          response_note: string | null
          start_date: string
          status: Database['vacation']['Enums']['request_status']
          submitted_at: string | null
          total_days: number
          updated_at: string
          vacation_period_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          decided_at?: string | null
          decided_by?: string | null
          employee_id: string
          end_date: string
          id?: string
          request_note?: string | null
          response_note?: string | null
          start_date: string
          status: Database['vacation']['Enums']['request_status']
          submitted_at?: string | null
          total_days: number
          updated_at?: string
          vacation_period_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          decided_at?: string | null
          decided_by?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          request_note?: string | null
          response_note?: string | null
          start_date?: string
          status?: Database['vacation']['Enums']['request_status']
          submitted_at?: string | null
          total_days?: number
          updated_at?: string
          vacation_period_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vacation_requests_employee_id_fkey'
            columns: ['employee_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vacation_requests_vacation_period_id_fkey'
            columns: ['vacation_period_id']
            isOneToOne: false
            referencedRelation: 'vacation_periods'
            referencedColumns: ['id']
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
      request_status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
  vacation: {
    Enums: {
      request_status: ['PENDING', 'APPROVED', 'REJECTED'],
    },
  },
} as const
