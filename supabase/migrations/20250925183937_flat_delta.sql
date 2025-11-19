/*
  # Update customers table with email field

  1. Changes
    - Add email field to customers table
    - Update column names for photo fields
    - Add indexes for better performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add email field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'email'
  ) THEN
    ALTER TABLE customers ADD COLUMN email text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Rename photo columns for clarity
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'ine_foto_url'
  ) THEN
    ALTER TABLE customers RENAME COLUMN ine_foto_url TO referencia_foto_url;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'comprobante_domiciliario_url'
  ) THEN
    ALTER TABLE customers RENAME COLUMN comprobante_domiciliario_url TO folio_foto_url;
  END IF;
END $$;

-- Add index for email searches
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);