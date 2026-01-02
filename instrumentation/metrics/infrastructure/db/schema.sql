CREATE DATABASE product_service;

CREATE DATABASE sales_service;

\c product_service

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

\c sales_service

CREATE TABLE IF NOT EXISTS price_cut (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    max_items_per_customer INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_purchase (
    id BIGSERIAL PRIMARY KEY,
    price_cut_id BIGINT NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    purchase_date TIMESTAMP NOT NULL,
    FOREIGN KEY (price_cut_id) REFERENCES price_cut(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_price_cut_product_id ON price_cut(product_id);
CREATE INDEX IF NOT EXISTS idx_customer_purchase_price_cut_id ON customer_purchase(price_cut_id);
CREATE INDEX IF NOT EXISTS idx_customer_purchase_customer_id ON customer_purchase(customer_id);

-- Add constraints
ALTER TABLE price_cut
    ADD CONSTRAINT check_sale_price_positive CHECK (sale_price > 0),
    ADD CONSTRAINT check_dates CHECK (end_date > start_date),
    ADD CONSTRAINT check_max_items CHECK (max_items_per_customer > 0);

ALTER TABLE customer_purchase
    ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0); 