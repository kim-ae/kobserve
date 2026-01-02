import { database } from '../utils/database';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/product.types';
import { dbLogger } from '../utils/logger';

export class ProductService {
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const startTime = Date.now();
    dbLogger.info({
      operation: 'createProduct',
      productName: data.name,
      price: data.price,
      stock: data.stock,
    }, 'Creating product in database');

    const query = `
      INSERT INTO products (name, price, stock, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, name, price, stock, created_at, updated_at
    `;
    
    try {
      const result = await database.query(query, [data.name, data.price, data.stock]);
      const duration = Date.now() - startTime;
      
      dbLogger.info({
        operation: 'createProduct',
        productId: result.rows[0].id,
        duration,
      }, 'Product created successfully in database');
      
      return result.rows[0];
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.error({
        operation: 'createProduct',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to create product in database');
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    const startTime = Date.now();
    dbLogger.info({
      operation: 'getAllProducts',
    }, 'Fetching all products from database');

    const query = `
      SELECT id, name, price, stock, created_at, updated_at
      FROM products
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await database.query(query);
      const duration = Date.now() - startTime;
      
      dbLogger.info({
        operation: 'getAllProducts',
        productCount: result.rows.length,
        duration,
      }, 'Products fetched successfully from database');
      
      return result.rows;
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.error({
        operation: 'getAllProducts',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to fetch products from database');
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    const startTime = Date.now();
    dbLogger.info({
      operation: 'getProductById',
      productId: id,
    }, 'Fetching product by ID from database');

    const query = `
      SELECT id, name, price, stock, created_at, updated_at
      FROM products
      WHERE id = $1
    `;
    
    try {
      const result = await database.query(query, [id]);
      const duration = Date.now() - startTime;
      
      if (result.rows[0]) {
        dbLogger.info({
          operation: 'getProductById',
          productId: id,
          duration,
        }, 'Product found in database');
      } else {
        dbLogger.warn({
          operation: 'getProductById',
          productId: id,
          duration,
        }, 'Product not found in database');
      }
      
      return result.rows[0] || null;
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.error({
        operation: 'getProductById',
        productId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to fetch product from database');
      throw error;
    }
  }

  async updateProduct(id: number, data: UpdateProductRequest): Promise<Product | null> {
    const startTime = Date.now();
    dbLogger.info({
      operation: 'updateProduct',
      productId: id,
      updateFields: Object.keys(data),
    }, 'Updating product in database');

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.price !== undefined) {
      fields.push(`price = $${paramCount++}`);
      values.push(data.price);
    }
    if (data.stock !== undefined) {
      fields.push(`stock = $${paramCount++}`);
      values.push(data.stock);
    }

    if (fields.length === 0) {
      dbLogger.info({
        operation: 'updateProduct',
        productId: id,
      }, 'No fields to update, fetching current product');
      return this.getProductById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, price, stock, created_at, updated_at
    `;
    
    try {
      const result = await database.query(query, values);
      const duration = Date.now() - startTime;
      
      if (result.rows[0]) {
        dbLogger.info({
          operation: 'updateProduct',
          productId: id,
          duration,
        }, 'Product updated successfully in database');
      } else {
        dbLogger.warn({
          operation: 'updateProduct',
          productId: id,
          duration,
        }, 'Product not found for update in database');
      }
      
      return result.rows[0] || null;
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.error({
        operation: 'updateProduct',
        productId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to update product in database');
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    const startTime = Date.now();
    dbLogger.info({
      operation: 'deleteProduct',
      productId: id,
    }, 'Deleting product from database');

    const query = 'DELETE FROM products WHERE id = $1';
    
    try {
      const result = await database.query(query, [id]);
      const duration = Date.now() - startTime;
      const deleted = result.rowCount > 0;
      
      if (deleted) {
        dbLogger.info({
          operation: 'deleteProduct',
          productId: id,
          duration,
        }, 'Product deleted successfully from database');
      } else {
        dbLogger.warn({
          operation: 'deleteProduct',
          productId: id,
          duration,
        }, 'Product not found for deletion in database');
      }
      
      return deleted;
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.error({
        operation: 'deleteProduct',
        productId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to delete product from database');
      throw error;
    }
  }

  async getProductCount(): Promise<number> {
    const startTime = Date.now();
    dbLogger.info({
      operation: 'getProductCount',
    }, 'Getting product count from database');

    const query = 'SELECT COUNT(*) FROM products';
    
    try {
      const result = await database.query(query);
      const count = parseInt(result.rows[0].count);
      const duration = Date.now() - startTime;
      
      dbLogger.info({
        operation: 'getProductCount',
        count,
        duration,
      }, 'Product count retrieved successfully from database');
      
      return count;
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.error({
        operation: 'getProductCount',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to get product count from database');
      throw error;
    }
  }
}

export const productService = new ProductService();
