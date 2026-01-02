import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { productService } from '../services/product.service';
import { CreateProductRequest, UpdateProductRequest } from '../types/product.types';
import { businessLogger } from '../utils/logger';

export async function productRoutes(fastify: FastifyInstance) {
  // Create product
  fastify.post<{ Body: CreateProductRequest }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'price', 'stock'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            price: { type: 'number', minimum: 0 },
            stock: { type: 'integer', minimum: 0 },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              price: { type: 'number' },
              stock: { type: 'number' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const startTime = Date.now();
      businessLogger.info({
        operation: 'createProduct',
        productName: request.body.name,
        price: request.body.price,
        stock: request.body.stock,
      }, 'Creating new product');

      try {
        const product = await productService.createProduct(request.body);
        const duration = Date.now() - startTime;
        
        businessLogger.info({
          operation: 'createProduct',
          productId: product.id,
          duration,
        }, 'Product created successfully');

        reply.status(201).send(product);
      } catch (error) {
        const duration = Date.now() - startTime;
        businessLogger.error({
          operation: 'createProduct',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration,
        }, 'Failed to create product');

        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get all products
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const startTime = Date.now();
    businessLogger.info({
      operation: 'getAllProducts',
    }, 'Fetching all products');

    try {
      const products = await productService.getAllProducts();
      const duration = Date.now() - startTime;
      
      businessLogger.info({
        operation: 'getAllProducts',
        productCount: products.length,
        duration,
      }, 'Products fetched successfully');

      reply.send(products);
    } catch (error) {
      const duration = Date.now() - startTime;
      businessLogger.error({
        operation: 'getAllProducts',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to fetch products');

      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get product by ID
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^\\d+$' },
          },
          required: ['id'],
        },
      },
    },
    async (request, reply) => {
      const startTime = Date.now();
      const productId = parseInt(request.params.id);
      
      businessLogger.info({
        operation: 'getProductById',
        productId,
      }, 'Fetching product by ID');

      try {
        const product = await productService.getProductById(productId);
        const duration = Date.now() - startTime;
        
        if (!product) {
          businessLogger.warn({
            operation: 'getProductById',
            productId,
            duration,
          }, 'Product not found');
          return reply.status(404).send({ error: 'Product not found' });
        }
        
        businessLogger.info({
          operation: 'getProductById',
          productId,
          duration,
        }, 'Product fetched successfully');
        
        reply.send(product);
      } catch (error) {
        const duration = Date.now() - startTime;
        businessLogger.error({
          operation: 'getProductById',
          productId,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration,
        }, 'Failed to fetch product');
        
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Update product
  fastify.put<{ Body: UpdateProductRequest; Params: { id: string } }>(
    '/:id',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            price: { type: 'number', minimum: 0 },
            stock: { type: 'integer', minimum: 0 },
          },
        },
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^\\d+$' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              price: { type: 'number' },
              stock: { type: 'number' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const startTime = Date.now();
      const id = parseInt(request.params.id);
      
      businessLogger.info({
        operation: 'updateProduct',
        productId: id,
        updateData: request.body,
      }, 'Updating product');

      try {
        const product = await productService.updateProduct(id, request.body);
        const duration = Date.now() - startTime;
        
        if (!product) {
          businessLogger.warn({
            operation: 'updateProduct',
            productId: id,
            duration,
          }, 'Product not found for update');
          return reply.status(404).send({ error: 'Product not found' });
        }
        
        businessLogger.info({
          operation: 'updateProduct',
          productId: id,
          duration,
        }, 'Product updated successfully');
        
        reply.send(product);
      } catch (error) {
        const duration = Date.now() - startTime;
        businessLogger.error({
          operation: 'updateProduct',
          productId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration,
        }, 'Failed to update product');
        
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Delete product
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^\\d+$' },
          },
        },
      },
    },
    async (request, reply) => {
      const startTime = Date.now();
      const id = parseInt(request.params.id);
      
      businessLogger.info({
        operation: 'deleteProduct',
        productId: id,
      }, 'Deleting product');

      try {
        const deleted = await productService.deleteProduct(id);
        const duration = Date.now() - startTime;
        
        if (!deleted) {
          businessLogger.warn({
            operation: 'deleteProduct',
            productId: id,
            duration,
          }, 'Product not found for deletion');
          return reply.status(404).send({ error: 'Product not found' });
        }
        
        businessLogger.info({
          operation: 'deleteProduct',
          productId: id,
          duration,
        }, 'Product deleted successfully');
        
        reply.status(204).send();
      } catch (error) {
        const duration = Date.now() - startTime;
        businessLogger.error({
          operation: 'deleteProduct',
          productId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration,
        }, 'Failed to delete product');
        
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}
