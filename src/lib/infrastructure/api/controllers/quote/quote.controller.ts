import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateQuoteDto } from '../../../../application/dto/quote/create-quote.dto';
import { QuoteResponseDto } from '../../../../application/dto/quote/quote-response.dto';
import { CreateQuoteUseCase } from '../../../../application/use-cases/create-quote.use-case';

@Controller('api/v1/quotes')
export class QuoteController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<QuoteResponseDto> {
    return await this.createQuoteUseCase.execute(createQuoteDto);
  }
}

