import { ApiProperty } from '@nestjs/swagger';
import { CreateQuoteItemDto } from './create-quote-item.dto';

export class CreateQuoteDto {
  @ApiProperty({
    description: 'Customer identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId: string;

  @ApiProperty({
    description: 'List of quote items',
    type: [CreateQuoteItemDto],
  })
  quoteItems: CreateQuoteItemDto[];
}

