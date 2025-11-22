import { UserEntity } from '../../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.typeorm.entity';

export class UserMapper {
  static toDomain(entity: UserTypeOrmEntity): UserEntity {
    return new UserEntity(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
    );
  }

  static toTypeOrm(domain: UserEntity): Partial<UserTypeOrmEntity> {
    return {
      id: domain.getId(),
      name: domain.getName(),
      email: domain.getEmail(),
      password: domain.getPassword(),
    };
  }
}
