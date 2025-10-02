/*
  # Add Customer Status Field

  1. Changes
    - Add `is_active` column to customers table
    - Default value is true (active)
    - Allows filtering active/inactive customers
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE customers ADD COLUMN is_active boolean DEFAULT true NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_customers_is_active ON customers(is_active);
