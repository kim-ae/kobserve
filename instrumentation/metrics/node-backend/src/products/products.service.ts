import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating new product: ${createProductDto.name}`, 'ProductsService');
    
    try {
      const product = this.productRepository.create(createProductDto);
      const savedProduct = await this.productRepository.save(product);
      const usinessEvent = {
          event: 'PRODUCT_CREATED',
          productId: savedProduct.id,
          productName: savedProduct.name,
          price: savedProduct.price,
          stock: savedProduct.stock,
      }
      this.logger.log(usinessEvent);
      
      this.logger.log(`Product created successfully with ID: ${savedProduct.id}`, 'ProductsService');
      return savedProduct;
    } catch (error) {
      this.logger.error(`Failed to create product: ${createProductDto.name}`, error.stack, 'ProductsService');
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    this.logger.log('Fetching all products', 'ProductsService');
    
    try {
      const products = await this.productRepository.find();
      this.logger.log(`Retrieved ${products.length} products`, 'ProductsService');
      return products;
    } catch (error) {
      this.logger.error('Failed to fetch products', error.stack, 'ProductsService');
      throw error;
    }
  }

  async findOne(id: number): Promise<Product> {
    this.logger.log(`Fetching product with ID: ${id}`, 'ProductsService');
    
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        this.logger.warn(`Product not found with ID: ${id}`, 'ProductsService');
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      this.logger.log(`Product found: ${product.name} (ID: ${id})`, 'ProductsService');
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch product with ID: ${id}`, error.stack, 'ProductsService');
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    this.logger.log(`Updating product with ID: ${id}`, 'ProductsService');
    
    try {
      const product = await this.findOne(id);
      const oldValues = { ...product };
      
      Object.assign(product, updateProductDto);
      const updatedProduct = await this.productRepository.save(product);
      const usinessEvent = {
        event: 'PRODUCT_UPDATED',
        productId: id,
        oldValues,
        newValues: updatedProduct,
      }
      this.logger.log(usinessEvent);
      
      this.logger.log(`Product updated successfully: ${updatedProduct.name} (ID: ${id})`, 'ProductsService');
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Failed to update product with ID: ${id}`, error.stack, 'ProductsService');
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Deleting product with ID: ${id}`, 'ProductsService');
    
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      
      const usinessEvent = {
        event: 'PRODUCT_DELETED',
        productId: id,
        productName: product.name,
      }
      this.logger.log(usinessEvent);
      
      this.logger.log(`Product deleted successfully: ${product.name} (ID: ${id})`, 'ProductsService');
    } catch (error) {
      this.logger.error(`Failed to delete product with ID: ${id}`, error.stack, 'ProductsService');
      throw error;
    }
  }
}
