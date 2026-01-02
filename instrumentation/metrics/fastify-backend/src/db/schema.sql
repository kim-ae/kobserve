-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO products (name, price, stock) VALUES
  ('Sample Product 1', 29.99, 100),
  ('Sample Product 2', 49.99, 50),
  ('Sample Product 3', 19.99, 200)
ON CONFLICT (id) DO NOTHING;
