import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteRepository } from '../../../domain/repositories/quote.repository';
import { QuoteAggregate } from '../../../domain/aggregate/quote.aggregate';
import { QuoteTypeOrmEntity } from '../entities/quote.typeorm.entity';
import { QuoteMapper } from '../mappers/quote.mapper';

@Injectable()
export class QuoteTypeOrmRepository implements QuoteRepository {
  constructor(
    @InjectRepository(QuoteTypeOrmEntity)
    private readonly repository: Repository<QuoteTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<QuoteAggregate | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['quoteItems', 'quoteItems.product', 'customer'],
    });
    return entity ? QuoteMapper.toDomain(entity) : null;
  }

  async save(quote: QuoteAggregate): Promise<QuoteAggregate> {
    const entityData = QuoteMapper.toTypeOrm(quote);
    const entity = this.repository.create(entityData);
    const savedEntity = await this.repository.save(entity);
    return QuoteMapper.toDomain(savedEntity);
  }
}
