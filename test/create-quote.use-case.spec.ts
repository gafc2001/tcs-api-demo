import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CreateQuoteUseCase } from '../src/lib/application/use-cases/create-quote.use-case';
import { QuoteAggregate } from '../src/lib/domain/aggregate/quote.aggregate';
import { UserEntity } from '../src/lib/domain/entities/user.entity';
import { ProductEntity } from '../src/lib/domain/entities/product.entity';
import { QuoteItemEntity } from '../src/lib/domain/entities/quote-item.entity';
import type { QuoteRepository } from '../src/lib/domain/repositories/quote.repository';
import type { ProductRepository } from '../src/lib/domain/repositories/product.repository';
import type { UserRepository } from '../src/lib/domain/repositories/user.repository';
import type { EmailMessagingPort } from '../src/lib/domain/ports/email-messaging.port';
import type { FileStoragePort } from '../src/lib/domain/ports/file-storage.port';
import { CreateQuoteDto } from '../src/lib/application/dto/quote/create-quote.dto';
import { PRODUCT_TYPE } from '../src/lib/domain/enums/product-type.enum';

describe('CreateQuoteUseCase', () => {
  let useCase: CreateQuoteUseCase;
  let quoteRepository: jest.Mocked<QuoteRepository>;
  let productRepository: jest.Mocked<ProductRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let emailMessagingPort: jest.Mocked<EmailMessagingPort>;
  let fileStoragePort: jest.Mocked<FileStoragePort>;

  const mockQuoteRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mockProductRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  const mockEmailMessagingPort = {
    sendEmailAsync: jest.fn(),
  };

  const mockFileStoragePort = {
    saveFileAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateQuoteUseCase,
        {
          provide: 'QuoteRepository',
          useValue: mockQuoteRepository,
        },
        {
          provide: 'ProductRepository',
          useValue: mockProductRepository,
        },
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'EmailMessagingPort',
          useValue: mockEmailMessagingPort,
        },
        {
          provide: 'FileStoragePort',
          useValue: mockFileStoragePort,
        },
      ],
    }).compile();

    useCase = module.get<CreateQuoteUseCase>(CreateQuoteUseCase);
    quoteRepository = module.get('QuoteRepository');
    productRepository = module.get('ProductRepository');
    userRepository = module.get('UserRepository');
    emailMessagingPort = module.get('EmailMessagingPort');
    fileStoragePort = module.get('FileStoragePort');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a quote successfully with basic product', async () => {
      // Arrange
      const customerId = 'customer-id-123';
      const productId = 'product-id-123';
      const customer = new UserEntity(
        customerId,
        'John Doe',
        'john.doe@example.com',
        'password',
      );

      const product = new ProductEntity(
        productId,
        'Basic Product',
        PRODUCT_TYPE.BASIC,
        'A basic product',
        1000.00,
      );

      const createQuoteDto: CreateQuoteDto = {
        customerId,
        quoteItems: [
          {
            productId,
            quantity: 2,
            price: 1000.00,
          },
        ],
      };

      const savedQuote = new QuoteAggregate('quote-id-123', customerId, 2000.00, true);
      const quoteItem = new QuoteItemEntity(
        'item-id-123',
        'quote-id-123',
        productId,
        2,
        1000.00,
      );
      savedQuote.restoreItems([quoteItem]);

      userRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(product);
      quoteRepository.save.mockResolvedValue(savedQuote);
      fileStoragePort.saveFileAsync.mockResolvedValue('file-url');
      emailMessagingPort.sendEmailAsync.mockResolvedValue();

      // Act
      const result = await useCase.execute(createQuoteDto);

      // Assert
      expect(result).toEqual({
        id: 'quote-id-123',
        customerId,
        totalAmount: 2000.00,
        status: true,
        quoteItems: [
          {
            id: 'item-id-123',
            productId,
            quantity: 2,
            price: 1000.00,
          },
        ],
      });
      expect(userRepository.findById).toHaveBeenCalledWith(customerId);
      expect(productRepository.findById).toHaveBeenCalledWith(productId);
      expect(quoteRepository.save).toHaveBeenCalledTimes(1);
      expect(fileStoragePort.saveFileAsync).toHaveBeenCalledTimes(1);
      expect(fileStoragePort.saveFileAsync).toHaveBeenCalledWith(
        expect.stringMatching(/^cotizacion-.*\.txt$/),
        expect.any(Buffer),
      );
      expect(emailMessagingPort.sendEmailAsync).toHaveBeenCalledTimes(1);
      expect(emailMessagingPort.sendEmailAsync).toHaveBeenCalledWith({
        to: 'john.doe@example.com',
        subject: expect.stringMatching(/^Cotización .+$/),
        message: 'Su cotización ha sido creada exitosamente. Total: $2000',
      });
    });

    it('should create a quote successfully with premium product', async () => {
      // Arrange
      const customerId = 'customer-id-456';
      const productId = 'product-id-456';
      const customer = new UserEntity(
        customerId,
        'Jane Doe',
        'jane.doe@example.com',
        'password',
      );

      const product = new ProductEntity(
        productId,
        'Premium Product',
        PRODUCT_TYPE.PREMIUM,
        'A premium product',
        5000.00,
      );

      const createQuoteDto: CreateQuoteDto = {
        customerId,
        quoteItems: [
          {
            productId,
            quantity: 1,
            price: 5000.00,
          },
        ],
      };

      const savedQuote = new QuoteAggregate('quote-id-456', customerId, 5000.00, true);
      const quoteItem = new QuoteItemEntity(
        'item-id-456',
        'quote-id-456',
        productId,
        1,
        5000.00,
      );
      savedQuote.restoreItems([quoteItem]);

      userRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(product);
      quoteRepository.save.mockResolvedValue(savedQuote);
      fileStoragePort.saveFileAsync.mockResolvedValue('file-url');
      emailMessagingPort.sendEmailAsync.mockResolvedValue();

      // Act
      const result = await useCase.execute(createQuoteDto);

      // Assert
      expect(result.totalAmount).toBe(5000.00);
      expect(fileStoragePort.saveFileAsync).toHaveBeenCalled();
      expect(emailMessagingPort.sendEmailAsync).toHaveBeenCalled();
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      // Arrange
      const createQuoteDto: CreateQuoteDto = {
        customerId: 'non-existent-customer',
        quoteItems: [
          {
            productId: 'product-id',
            quantity: 1,
            price: 1000.00,
          },
        ],
      };

      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(createQuoteDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.execute(createQuoteDto)).rejects.toThrow(
        'Customer with id non-existent-customer not found',
      );
      expect(userRepository.findById).toHaveBeenCalledWith('non-existent-customer');
      expect(productRepository.findById).not.toHaveBeenCalled();
      expect(quoteRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when product does not exist', async () => {
      // Arrange
      const customerId = 'customer-id-123';
      const productId = 'non-existent-product';
      const customer = new UserEntity(
        customerId,
        'John Doe',
        'john.doe@example.com',
        'password',
      );

      const createQuoteDto: CreateQuoteDto = {
        customerId,
        quoteItems: [
          {
            productId,
            quantity: 1,
            price: 1000.00,
          },
        ],
      };

      userRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(createQuoteDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.execute(createQuoteDto)).rejects.toThrow(
        'Product with id non-existent-product not found',
      );
      expect(userRepository.findById).toHaveBeenCalledWith(customerId);
      expect(productRepository.findById).toHaveBeenCalledWith(productId);
      expect(quoteRepository.save).not.toHaveBeenCalled();
    });

    it('should create a quote with multiple items', async () => {
      // Arrange
      const customerId = 'customer-id-789';
      const productId1 = 'product-id-1';
      const productId2 = 'product-id-2';
      const customer = new UserEntity(
        customerId,
        'Multiple Products Customer',
        'multiple@example.com',
        'password',
      );

      const product1 = new ProductEntity(
        productId1,
        'Product 1',
        PRODUCT_TYPE.BASIC,
        'First product',
        1000.00,
      );

      const product2 = new ProductEntity(
        productId2,
        'Product 2',
        PRODUCT_TYPE.BASIC,
        'Second product',
        2000.00,
      );

      const createQuoteDto: CreateQuoteDto = {
        customerId,
        quoteItems: [
          {
            productId: productId1,
            quantity: 2,
            price: 1000.00,
          },
          {
            productId: productId2,
            quantity: 1,
            price: 2000.00,
          },
        ],
      };

      const savedQuote = new QuoteAggregate('quote-id-789', customerId, 4000.00, true);
      const quoteItem1 = new QuoteItemEntity(
        'item-id-1',
        'quote-id-789',
        productId1,
        2,
        1000.00,
      );
      const quoteItem2 = new QuoteItemEntity(
        'item-id-2',
        'quote-id-789',
        productId2,
        1,
        2000.00,
      );
      savedQuote.restoreItems([quoteItem1, quoteItem2]);

      userRepository.findById.mockResolvedValue(customer);
      productRepository.findById
        .mockResolvedValueOnce(product1)
        .mockResolvedValueOnce(product2);
      quoteRepository.save.mockResolvedValue(savedQuote);
      fileStoragePort.saveFileAsync.mockResolvedValue('file-url');
      emailMessagingPort.sendEmailAsync.mockResolvedValue();

      // Act
      const result = await useCase.execute(createQuoteDto);

      // Assert
      expect(result.quoteItems).toHaveLength(2);
      expect(result.totalAmount).toBe(4000.00);
      expect(productRepository.findById).toHaveBeenCalledTimes(2);
      expect(productRepository.findById).toHaveBeenNthCalledWith(1, productId1);
      expect(productRepository.findById).toHaveBeenNthCalledWith(2, productId2);
    });

    it('should generate quote file content correctly', async () => {
      // Arrange
      const customerId = 'customer-id-file';
      const productId = 'product-id-file';
      const customer = new UserEntity(
        customerId,
        'File Test Customer',
        'file@example.com',
        'password',
      );

      const product = new ProductEntity(
        productId,
        'Test Product',
        PRODUCT_TYPE.BASIC,
        'Test description',
        1500.00,
      );

      const createQuoteDto: CreateQuoteDto = {
        customerId,
        quoteItems: [
          {
            productId,
            quantity: 3,
            price: 1500.00,
          },
        ],
      };

      const savedQuote = new QuoteAggregate('quote-id-file', customerId, 4500.00, true);
      const quoteItem = new QuoteItemEntity(
        'item-id-file',
        'quote-id-file',
        productId,
        3,
        1500.00,
      );
      savedQuote.restoreItems([quoteItem]);

      userRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(product);
      quoteRepository.save.mockResolvedValue(savedQuote);
      fileStoragePort.saveFileAsync.mockResolvedValue('file-url');
      emailMessagingPort.sendEmailAsync.mockResolvedValue();

      // Act
      await useCase.execute(createQuoteDto);

      // Assert
      expect(fileStoragePort.saveFileAsync).toHaveBeenCalledWith(
        expect.stringMatching(/^cotizacion-.*\.txt$/),
        expect.any(Buffer),
      );
      const fileContent = fileStoragePort.saveFileAsync.mock.calls[0][1] as Buffer;
      const contentString = fileContent.toString();
      expect(contentString).toContain('COTIZACIÓN');
      expect(contentString).toContain('File Test Customer');
      expect(contentString).toContain('Test Product - 3 - $1500');
    });

    it('should send email with correct total amount', async () => {
      // Arrange
      const customerId = 'customer-id-email';
      const productId = 'product-id-email';
      const customer = new UserEntity(
        customerId,
        'Email Test Customer',
        'email@example.com',
        'password',
      );

      const product = new ProductEntity(
        productId,
        'Email Product',
        PRODUCT_TYPE.BASIC,
        'Product for email test',
        2500.00,
      );

      const createQuoteDto: CreateQuoteDto = {
        customerId,
        quoteItems: [
          {
            productId,
            quantity: 2,
            price: 2500.00,
          },
        ],
      };

      const savedQuote = new QuoteAggregate('quote-id-email', customerId, 5000.00, true);
      const quoteItem = new QuoteItemEntity(
        'item-id-email',
        'quote-id-email',
        productId,
        2,
        2500.00,
      );
      savedQuote.restoreItems([quoteItem]);

      userRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(product);
      quoteRepository.save.mockResolvedValue(savedQuote);
      fileStoragePort.saveFileAsync.mockResolvedValue('file-url');
      emailMessagingPort.sendEmailAsync.mockResolvedValue();

      // Act
      await useCase.execute(createQuoteDto);

      // Assert
      expect(emailMessagingPort.sendEmailAsync).toHaveBeenCalledWith({
        to: 'email@example.com',
        subject: expect.stringMatching(/^Cotización .+$/),
        message: 'Su cotización ha sido creada exitosamente. Total: $5000',
      });
    });
  });
});

