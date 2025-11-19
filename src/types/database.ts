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
      customers: {
        Row: {
          id: string
          nombre_cliente: string
          email: string
          tipo_instalacion: 'Fibra' | 'Antena'
          direccion: string
          telefono: string
          ubicacion_region: string
          referencia_domicilio: string
          referencia_foto_url: string | null
          folio_foto_url: string | null
          ip_asignada: string
          megas_contratados: number
          fecha_instalacion: string
          metodo_pago: 'Efectivo' | 'Tarjeta'
          folio_fibra_migracion: string
          notas: string | null
          estado_pago: 'Pagado' | 'Pendiente' | 'Vencido'
          fecha_ultimo_pago: string | null
          fecha_vencimiento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre_cliente: string
          email: string
          tipo_instalacion: 'Fibra' | 'Antena'
          direccion: string
          telefono: string
          ubicacion_region: string
          referencia_domicilio: string
          referencia_foto_url?: string | null
          folio_foto_url?: string | null
          ip_asignada: string
          megas_contratados: number
          fecha_instalacion: string
          metodo_pago: 'Efectivo' | 'Tarjeta'
          folio_fibra_migracion: string
          notas?: string | null
          estado_pago?: 'Pagado' | 'Pendiente' | 'Vencido'
          fecha_ultimo_pago?: string | null
          fecha_vencimiento?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre_cliente?: string
          email?: string
          tipo_instalacion?: 'Fibra' | 'Antena'
          direccion?: string
          telefono?: string
          ubicacion_region?: string
          referencia_domicilio?: string
          referencia_foto_url?: string | null
          folio_foto_url?: string | null
          ip_asignada?: string
          megas_contratados?: number
          fecha_instalacion?: string
          metodo_pago?: 'Efectivo' | 'Tarjeta'
          folio_fibra_migracion?: string
          notas?: string | null
          estado_pago?: 'Pagado' | 'Pendiente' | 'Vencido'
          fecha_ultimo_pago?: string | null
          fecha_vencimiento?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_reminders: {
        Row: {
          id: string
          customer_id: string
          reminder_date: string
          sent: boolean
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          reminder_date?: string
          sent?: boolean
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          reminder_date?: string
          sent?: boolean
          message?: string
          created_at?: string
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
