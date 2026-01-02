// Product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
}

// Create product request interface
export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
}

// Update product request interface
export type UpdateProductRequest = Partial<CreateProductRequest>;

// Product response interface
export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}
