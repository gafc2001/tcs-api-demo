import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { QuoteAggregate } from '../../domain/aggregate/quote.aggregate';
import { QuoteItemEntity } from '../../domain/entities/quote-item.entity';
import type { QuoteRepository } from '../../domain/repositories/quote.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { EmailMessagingPort } from '../../domain/ports/email-messaging.port';
import type { FileStoragePort } from '../../domain/ports/file-storage.port';
import { CreateQuoteDto } from '../dto/quote/create-quote.dto';
import { QuoteResponseDto } from '../dto/quote/quote-response.dto';

@Injectable()
export class CreateQuoteUseCase {
  constructor(
    @Inject('QuoteRepository')
    private readonly quoteRepository: QuoteRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('EmailMessagingPort')
    private readonly emailMessagingPort: EmailMessagingPort,
    @Inject('FileStoragePort')
    private readonly fileStoragePort: FileStoragePort,
  ) {}

  async execute(createQuoteDto: CreateQuoteDto): Promise<QuoteResponseDto> {
    const customer = await this.userRepository.findById(
      createQuoteDto.customerId,
    );
    if (!customer) {
      throw new NotFoundException(
        `Customer with id ${createQuoteDto.customerId} not found`,
      );
    }

    const quoteId = randomUUID();
    const quote = new QuoteAggregate(quoteId, createQuoteDto.customerId, 0, true);
    const products: Array<{ product: any; item: QuoteItemEntity }> = [];

    for (const itemDto of createQuoteDto.quoteItems) {
      const product = await this.productRepository.findById(itemDto.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with id ${itemDto.productId} not found`,
        );
      }

      const quoteItemId = randomUUID();
      const quoteItem = new QuoteItemEntity(
        quoteItemId,
        quoteId,
        itemDto.productId,
        itemDto.quantity,
        itemDto.price,
      );

      quote.addItem(quoteItem, product);
      products.push({ product, item: quoteItem });
    }

    const savedQuote = await this.quoteRepository.save(quote);

    const fileContent = this.generateQuoteFileContent(customer.getName(), products);
    const fileName = `cotizacion-${quoteId}.txt`;
    await this.fileStoragePort.saveFileAsync(fileName, fileContent);

    await this.emailMessagingPort.sendEmailAsync({
      to: customer.getEmail(),
      subject: `Cotización ${quoteId}`,
      message: `Su cotización ha sido creada exitosamente. Total: $${savedQuote.getTotalAmount()}`,
    });

    return this.toResponseDto(savedQuote);
  }

  private generateQuoteFileContent(
    customerName: string,
    products: Array<{ product: any; item: QuoteItemEntity }>,
  ): Buffer {
    const lines: string[] = [];
    lines.push('COTIZACIÓN');
    lines.push(customerName);
    
    products.forEach(({ product, item }) => {
      const itemDetail = `${product.getName()} - ${item.getQuantity()} - $${item.getPrice()}`;
      lines.push(itemDetail);
    });

    const content = lines.join('\n');
    return Buffer.from(content);
  }

  private toResponseDto(quote: QuoteAggregate): QuoteResponseDto {
    return {
      id: quote.getId(),
      customerId: quote.getCustomerId(),
      totalAmount: quote.getTotalAmount(),
      status: quote.getStatus(),
      quoteItems: quote.getQuoteItems().map((item) => ({
        id: item.getId(),
        productId: item.getProductId(),
        quantity: item.getQuantity(),
        price: item.getPrice(),
      })),
    };
  }
}

