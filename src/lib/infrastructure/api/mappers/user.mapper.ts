import { CreateUserRequest } from '../dto/user/create-user-request.dto';
import { CreateUserDto } from '../../../application/dto/user/create-user.dto';

export class UserMapper {
  static toCreateUserDto(request: CreateUserRequest): CreateUserDto {
    return {
      name: request.name,
      email: request.email,
      password: request.password,
    };
  }
}

