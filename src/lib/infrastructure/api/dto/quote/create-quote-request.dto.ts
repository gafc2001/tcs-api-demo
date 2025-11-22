import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuoteItemRequest } from './create-quote-item-request.dto';

export class CreateQuoteRequest {
  @ApiProperty({
    description: 'Customer identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'List of quote items',
    type: [CreateQuoteItemRequest],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemRequest)
  quoteItems: CreateQuoteItemRequest[];
}

