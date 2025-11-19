export interface Customer {
  id: string;
  nombre_cliente: string;
  email: string;
  tipo_instalacion: 'Fibra' | 'Antena';
  direccion: string;
  telefono: string;
  ubicacion_region: string;
  referencia_domicilio: string;
  referencia_foto_url?: string;
  folio_foto_url?: string;
  ip_asignada: string;
  megas_contratados: number;
  fecha_instalacion: string;
  metodo_pago: 'Efectivo' | 'Tarjeta';
  folio_fibra_migracion: string;
  notas?: string;
  estado_pago: 'Pagado' | 'Pendiente' | 'Vencido';
  fecha_ultimo_pago?: string;
  fecha_vencimiento?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentReminder {
  id: string;
  customer_id: string;
  reminder_date: string;
  sent: boolean;
  message: string;
  created_at: string;
}