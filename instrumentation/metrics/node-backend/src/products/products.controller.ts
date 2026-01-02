import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    this.logger.log(`Creating product: ${createProductDto.name}`, 'ProductsController');
    this.logger.debug("Trying to create product: " + JSON.stringify(createProductDto));
    try {
      const product = await this.productsService.create(createProductDto);
      this.logger.log(`Product created successfully: ${product.name} (ID: ${product.id})`, 'ProductsController');
      return product;
    } catch (error) {
      this.logger.error(`Failed to create product: ${createProductDto.name}`, error.stack, 'ProductsController');
      throw error;
    }
  }

  @Get()
  async findAll() {
    this.logger.log('Fetching all products', 'ProductsController');
    
    try {
      const products = await this.productsService.findAll();
      this.logger.log(`Retrieved ${products.length} products`, 'ProductsController');
      return products;
    } catch (error) {
      this.logger.error('Failed to fetch all products', error.stack, 'ProductsController');
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Fetching product with ID: ${id}`, 'ProductsController');
    
    try {
      const product = await this.productsService.findOne(id);
      this.logger.log(`Product retrieved: ${product.name} (ID: ${id})`, 'ProductsController');
      return product;
    } catch (error) {
      this.logger.error(`Failed to fetch product with ID: ${id}`, error.stack, 'ProductsController');
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    this.logger.log(`Updating product with ID: ${id}`, 'ProductsController');
    
    try {
      const product = await this.productsService.update(id, updateProductDto);
      this.logger.log(`Product updated successfully: ${product.name} (ID: ${id})`, 'ProductsController');
      return product;
    } catch (error) {
      this.logger.error(`Failed to update product with ID: ${id}`, error.stack, 'ProductsController');
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Deleting product with ID: ${id}`, 'ProductsController');
    
    try {
      await this.productsService.remove(id);
      this.logger.log(`Product deleted successfully (ID: ${id})`, 'ProductsController');
    } catch (error) {
      this.logger.error(`Failed to delete product with ID: ${id}`, error.stack, 'ProductsController');
      throw error;
    }
  }
}
