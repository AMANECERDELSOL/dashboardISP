/*
  # Create payment reminders table

  1. New Tables
    - `payment_reminders`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers)
      - `reminder_date` (date, date when reminder should be sent)
      - `sent` (boolean, whether reminder was sent)
      - `message` (text, reminder message content)
      - `created_at` (timestamptz, creation date)

  2. Security
    - Enable RLS on `payment_reminders` table
    - Add policy for authenticated users to manage all reminder data
*/

CREATE TABLE IF NOT EXISTS payment_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  reminder_date date NOT NULL,
  sent boolean DEFAULT false,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage all reminder data
CREATE POLICY "Enable all operations for authenticated users on reminders"
  ON payment_reminders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_reminders_customer_id ON payment_reminders (customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_date ON payment_reminders (reminder_date);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_sent ON payment_reminders (sent);