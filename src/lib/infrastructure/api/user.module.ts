import { Module } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [UserController],
  providers: [CreateUserUseCase],
})
export class UserModule {}

