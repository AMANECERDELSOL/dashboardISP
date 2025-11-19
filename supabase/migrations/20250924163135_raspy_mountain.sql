/*
  # Create customers table for ISP management system

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `nombre_cliente` (text, customer name)
      - `tipo_instalacion` (text, installation type: Fibra or Antena)
      - `direccion` (text, address)
      - `telefono` (text, phone number)
      - `ubicacion_region` (text, location/region)
      - `referencia_domicilio` (text, home reference)
      - `ine_foto_url` (text, INE photo URL)
      - `comprobante_domiciliario_url` (text, address proof photo URL)
      - `ip_asignada` (text, assigned IP)
      - `megas_contratados` (integer, contracted MB)
      - `fecha_instalacion` (date, installation date)
      - `metodo_pago` (text, payment method: Efectivo or Tarjeta)
      - `folio_fibra_migracion` (text, fiber/migration folio)
      - `notas` (text, optional notes)
      - `estado_pago` (text, payment status: Pagado, Pendiente, Vencido)
      - `fecha_ultimo_pago` (timestamptz, last payment date)
      - `fecha_vencimiento` (timestamptz, due date)
      - `created_at` (timestamptz, creation date)
      - `updated_at` (timestamptz, update date)

  2. Security
    - Enable RLS on `customers` table
    - Add policy for authenticated users to manage all customer data
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_cliente text NOT NULL,
  tipo_instalacion text NOT NULL CHECK (tipo_instalacion IN ('Fibra', 'Antena')),
  direccion text NOT NULL,
  telefono text NOT NULL,
  ubicacion_region text NOT NULL,
  referencia_domicilio text DEFAULT '',
  ine_foto_url text,
  comprobante_domiciliario_url text,
  ip_asignada text NOT NULL,
  megas_contratados integer NOT NULL,
  fecha_instalacion date NOT NULL,
  metodo_pago text NOT NULL CHECK (metodo_pago IN ('Efectivo', 'Tarjeta')),
  folio_fibra_migracion text NOT NULL,
  notas text DEFAULT '',
  estado_pago text NOT NULL DEFAULT 'Pendiente' CHECK (estado_pago IN ('Pagado', 'Pendiente', 'Vencido')),
  fecha_ultimo_pago timestamptz,
  fecha_vencimiento timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage all customer data
CREATE POLICY "Enable all operations for authenticated users"
  ON customers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to read customers (for public interfaces if needed)
CREATE POLICY "Enable read for anonymous users"
  ON customers
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_nombre ON customers (nombre_cliente);
CREATE INDEX IF NOT EXISTS idx_customers_telefono ON customers (telefono);
CREATE INDEX IF NOT EXISTS idx_customers_ip ON customers (ip_asignada);
CREATE INDEX IF NOT EXISTS idx_customers_estado_pago ON customers (estado_pago);
CREATE INDEX IF NOT EXISTS idx_customers_fecha_instalacion ON customers (fecha_instalacion);