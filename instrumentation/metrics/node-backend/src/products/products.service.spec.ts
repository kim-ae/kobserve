import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 99.99,
        stock: 10,
      };

      const expectedProduct = { id: 1, ...createProductDto };
      mockRepository.create.mockReturnValue(expectedProduct);
      mockRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(expectedProduct);
      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedProduct);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [
        { id: 1, name: 'Product 1', price: 99.99, stock: 10 },
        { id: 2, name: 'Product 2', price: 149.99, stock: 5 },
      ];

      mockRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.findAll();

      expect(result).toEqual(expectedProducts);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const expectedProduct = { id: 1, name: 'Test Product', price: 99.99, stock: 10 };
      mockRepository.findOne.mockResolvedValue(expectedProduct);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const existingProduct = { id: 1, name: 'Old Name', price: 99.99, stock: 10 };
      const updateProductDto: UpdateProductDto = { name: 'New Name' };
      const updatedProduct = { ...existingProduct, ...updateProductDto };

      mockRepository.findOne.mockResolvedValue(existingProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productToRemove = { id: 1, name: 'Test Product', price: 99.99, stock: 10 };
      mockRepository.findOne.mockResolvedValue(productToRemove);
      mockRepository.remove.mockResolvedValue(productToRemove);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(productToRemove);
    });
  });
});
