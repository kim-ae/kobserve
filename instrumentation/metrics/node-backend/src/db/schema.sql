CREATE DATABASE product_service;

\c product_service

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Create index on price for range queries
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO products (name, price, stock) VALUES
  ('Laptop', 999.99, 50),
  ('Mouse', 29.99, 100),
  ('Keyboard', 79.99, 75),
  ('Monitor', 299.99, 25),
  ('Headphones', 149.99, 60)
ON CONFLICT DO NOTHING;
