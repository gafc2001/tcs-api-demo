import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from '../src/lib/application/use-cases/create-product.use-case';
import { ProductEntity } from '../src/lib/domain/entities/product.entity';
import type { ProductRepository } from '../src/lib/domain/repositories/product.repository';
import { CreateProductDto } from '../src/lib/application/dto/product/create-product.dto';
import { PRODUCT_TYPE } from '../src/lib/domain/enums/product-type.enum';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productRepository: jest.Mocked<ProductRepository>;

  const mockProductRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: 'ProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    productRepository = module.get('ProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a premium product successfully', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'Premium Product',
        productType: PRODUCT_TYPE.PREMIUM,
        description: 'A premium quality product',
        price: 10000.50,
      };

      const savedProduct = new ProductEntity(
        'product-id-123',
        createProductDto.name,
        createProductDto.productType,
        createProductDto.description || '',
        createProductDto.price,
      );

      productRepository.save.mockResolvedValue(savedProduct);

      // Act
      const result = await useCase.execute(createProductDto);

      // Assert
      expect(result).toEqual({
        id: 'product-id-123',
        name: 'Premium Product',
        productType: PRODUCT_TYPE.PREMIUM,
        description: 'A premium quality product',
        price: 10000.50,
      });
      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          getName: expect.any(Function),
          getProductType: expect.any(Function),
          getPrice: expect.any(Function),
        }),
      );
    });

    it('should create a basic product successfully', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'Basic Product',
        productType: PRODUCT_TYPE.BASIC,
        description: 'A basic product',
        price: 500.00,
      };

      const savedProduct = new ProductEntity(
        'product-id-456',
        createProductDto.name,
        createProductDto.productType,
        createProductDto.description || '',
        createProductDto.price,
      );

      productRepository.save.mockResolvedValue(savedProduct);

      // Act
      const result = await useCase.execute(createProductDto);

      // Assert
      expect(result).toEqual({
        id: 'product-id-456',
        name: 'Basic Product',
        productType: PRODUCT_TYPE.BASIC,
        description: 'A basic product',
        price: 500.00,
      });
      expect(productRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create a product with empty description when description is not provided', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'Product Without Description',
        productType: PRODUCT_TYPE.BASIC,
        price: 1000.00,
      };

      const savedProduct = new ProductEntity(
        'product-id-789',
        createProductDto.name,
        createProductDto.productType,
        '',
        createProductDto.price,
      );

      productRepository.save.mockResolvedValue(savedProduct);

      // Act
      const result = await useCase.execute(createProductDto);

      // Assert
      expect(result.description).toBe('');
      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          getDescription: expect.any(Function),
        }),
      );
      const savedProductArg = productRepository.save.mock.calls[0][0] as ProductEntity;
      expect(savedProductArg.getDescription()).toBe('');
    });

    it('should generate a unique UUID for the new product', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        productType: PRODUCT_TYPE.PREMIUM,
        description: 'Test product',
        price: 5000.00,
      };

      const savedProduct = new ProductEntity(
        'generated-uuid',
        createProductDto.name,
        createProductDto.productType,
        createProductDto.description || '',
        createProductDto.price,
      );

      productRepository.save.mockResolvedValue(savedProduct);

      // Act
      await useCase.execute(createProductDto);

      // Assert
      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          getId: expect.any(Function),
        }),
      );
      const savedProductArg = productRepository.save.mock.calls[0][0] as ProductEntity;
      expect(savedProductArg.getId()).toBeTruthy();
      expect(typeof savedProductArg.getId()).toBe('string');
    });

    it('should create a product with zero price', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'Free Product',
        productType: PRODUCT_TYPE.BASIC,
        description: 'A free product',
        price: 0,
      };

      const savedProduct = new ProductEntity(
        'product-id-zero',
        createProductDto.name,
        createProductDto.productType,
        createProductDto.description || '',
        createProductDto.price,
      );

      productRepository.save.mockResolvedValue(savedProduct);

      // Act
      const result = await useCase.execute(createProductDto);

      // Assert
      expect(result.price).toBe(0);
      expect(productRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should map all product properties correctly in the response DTO', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'Complete Product',
        productType: PRODUCT_TYPE.PREMIUM,
        description: 'Complete product description',
        price: 15000.75,
      };

      const savedProduct = new ProductEntity(
        'complete-product-id',
        createProductDto.name,
        createProductDto.productType,
        createProductDto.description || '',
        createProductDto.price,
      );

      productRepository.save.mockResolvedValue(savedProduct);

      // Act
      const result = await useCase.execute(createProductDto);

      // Assert
      expect(result.id).toBe('complete-product-id');
      expect(result.name).toBe('Complete Product');
      expect(result.productType).toBe(PRODUCT_TYPE.PREMIUM);
      expect(result.description).toBe('Complete product description');
      expect(result.price).toBe(15000.75);
    });
  });
});

