import { ApiProperty } from '@nestjs/swagger';
import { QuoteItemResponseDto } from './quote-item-response.dto';

export class QuoteResponseDto {
  @ApiProperty({
    description: 'Quote unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Customer identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId: string;

  @ApiProperty({
    description: 'Total amount of the quote',
    example: 10000.00,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Quote status',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'List of quote items',
    type: [QuoteItemResponseDto],
  })
  quoteItems: QuoteItemResponseDto[];
}

