/*
  # Crear tabla de clientes para Skyweb ISP

  ## Descripción
  Esta migración crea el esquema completo para el sistema de gestión de clientes ISP Skyweb,
  incluyendo la tabla de clientes, recordatorios de pago y todas las políticas de seguridad necesarias.

  ## Tablas Nuevas
  
  ### `customers`
  Tabla principal que almacena toda la información de clientes del ISP
  - `id` (uuid, primary key) - Identificador único del cliente
  - `nombre_cliente` (text) - Nombre completo del cliente
  - `email` (text) - Correo electrónico del cliente
  - `tipo_instalacion` (text) - Tipo de instalación: 'Fibra' o 'Antena'
  - `direccion` (text) - Dirección física del cliente
  - `telefono` (text) - Número de teléfono de contacto
  - `ubicacion_region` (text) - Región o zona donde se ubica el cliente
  - `referencia_domicilio` (text) - Referencia adicional para ubicar el domicilio
  - `referencia_foto_url` (text, opcional) - URL de foto de referencia del domicilio
  - `folio_foto_url` (text, opcional) - URL de foto del folio
  - `ip_asignada` (text) - Dirección IP asignada al cliente
  - `megas_contratados` (integer) - Velocidad del plan en megabits
  - `fecha_instalacion` (date) - Fecha en que se realizó la instalación
  - `metodo_pago` (text) - Método de pago: 'Efectivo' o 'Tarjeta'
  - `folio_fibra_migracion` (text) - Folio de fibra o migración
  - `notas` (text, opcional) - Notas adicionales sobre el cliente
  - `estado_pago` (text) - Estado del pago: 'Pagado', 'Pendiente' o 'Vencido'
  - `fecha_ultimo_pago` (timestamptz, opcional) - Fecha del último pago recibido
  - `fecha_vencimiento` (timestamptz, opcional) - Fecha de vencimiento del próximo pago
  - `created_at` (timestamptz) - Fecha de creación del registro
  - `updated_at` (timestamptz) - Fecha de última actualización
  
  ### `payment_reminders`
  Tabla para almacenar recordatorios de pago enviados
  - `id` (uuid, primary key) - Identificador único del recordatorio
  - `customer_id` (uuid, foreign key) - Referencia al cliente
  - `reminder_date` (timestamptz) - Fecha en que se envió el recordatorio
  - `sent` (boolean) - Indica si el recordatorio fue enviado
  - `message` (text) - Contenido del mensaje enviado
  - `created_at` (timestamptz) - Fecha de creación del registro

  ## Seguridad (RLS)
  
  ### Políticas para `customers`
  - Acceso público para lectura (SELECT) - Permite ver todos los clientes
  - Acceso público para inserción (INSERT) - Permite agregar nuevos clientes
  - Acceso público para actualización (UPDATE) - Permite modificar clientes existentes
  - Acceso público para eliminación (DELETE) - Permite eliminar clientes
  
  ### Políticas para `payment_reminders`
  - Acceso público para lectura (SELECT) - Permite ver recordatorios
  - Acceso público para inserción (INSERT) - Permite crear recordatorios
  
  ## Índices
  - Índice en `customers.email` para búsquedas rápidas por email
  - Índice en `customers.telefono` para búsquedas rápidas por teléfono
  - Índice en `customers.ip_asignada` para búsquedas rápidas por IP
  - Índice en `customers.estado_pago` para filtrado eficiente por estado
  - Índice en `payment_reminders.customer_id` para relación con clientes
  
  ## Notas Importantes
  - Las políticas RLS están configuradas para acceso público ya que este es un sistema interno
  - Los timestamps utilizan zona horaria para registrar correctamente los eventos
  - Se incluyen valores por defecto para optimizar la inserción de datos
*/

-- Crear la tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_cliente text NOT NULL,
  email text NOT NULL,
  tipo_instalacion text NOT NULL CHECK (tipo_instalacion IN ('Fibra', 'Antena')),
  direccion text NOT NULL,
  telefono text NOT NULL,
  ubicacion_region text NOT NULL,
  referencia_domicilio text NOT NULL,
  referencia_foto_url text,
  folio_foto_url text,
  ip_asignada text NOT NULL,
  megas_contratados integer NOT NULL DEFAULT 0,
  fecha_instalacion date NOT NULL DEFAULT CURRENT_DATE,
  metodo_pago text NOT NULL CHECK (metodo_pago IN ('Efectivo', 'Tarjeta')),
  folio_fibra_migracion text NOT NULL DEFAULT '',
  notas text,
  estado_pago text NOT NULL DEFAULT 'Pendiente' CHECK (estado_pago IN ('Pagado', 'Pendiente', 'Vencido')),
  fecha_ultimo_pago timestamptz,
  fecha_vencimiento timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear la tabla de recordatorios de pago
CREATE TABLE IF NOT EXISTS payment_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  reminder_date timestamptz NOT NULL DEFAULT now(),
  sent boolean NOT NULL DEFAULT false,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_telefono ON customers(telefono);
CREATE INDEX IF NOT EXISTS idx_customers_ip_asignada ON customers(ip_asignada);
CREATE INDEX IF NOT EXISTS idx_customers_estado_pago ON customers(estado_pago);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_customer_id ON payment_reminders(customer_id);

-- Habilitar Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

-- Políticas para customers (acceso público para sistema interno)
CREATE POLICY "Permitir lectura pública de clientes"
  ON customers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción pública de clientes"
  ON customers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de clientes"
  ON customers
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir eliminación pública de clientes"
  ON customers
  FOR DELETE
  TO public
  USING (true);

-- Políticas para payment_reminders
CREATE POLICY "Permitir lectura pública de recordatorios"
  ON payment_reminders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción pública de recordatorios"
  ON payment_reminders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en customers
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();