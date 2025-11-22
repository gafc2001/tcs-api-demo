import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from '../src/lib/application/use-cases/create-user.use-case';
import { UserEntity } from '../src/lib/domain/entities/user.entity';
import type { UserRepository } from '../src/lib/domain/repositories/user.repository';
import { CreateUserDto } from '../src/lib/application/dto/user/create-user.dto';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get('UserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecurePassword123',
      };

      const savedUser = new UserEntity(
        'user-id-123',
        createUserDto.name,
        createUserDto.email,
        createUserDto.password,
      );

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(savedUser);

      // Act
      const result = await useCase.execute(createUserDto);

      // Assert
      expect(result).toEqual({
        id: 'user-id-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          getName: expect.any(Function),
          getEmail: expect.any(Function),
        }),
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'SecurePassword123',
      };

      const existingUser = new UserEntity(
        'existing-id',
        'Existing User',
        'existing@example.com',
        'password',
      );

      userRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        'User with email existing@example.com already exists',
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'existing@example.com',
      );
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should generate a unique UUID for the new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'SecurePassword123',
      };

      const savedUser = new UserEntity(
        'generated-uuid',
        createUserDto.name,
        createUserDto.email,
        createUserDto.password,
      );

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(savedUser);

      // Act
      await useCase.execute(createUserDto);

      // Assert
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          getId: expect.any(Function),
        }),
      );
      const savedUserArg = userRepository.save.mock.calls[0][0] as UserEntity;
      expect(savedUserArg.getId()).toBeTruthy();
      expect(typeof savedUserArg.getId()).toBe('string');
    });

    it('should not include password in the response DTO', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecretPassword123',
      };

      const savedUser = new UserEntity(
        'user-id',
        createUserDto.name,
        createUserDto.email,
        createUserDto.password,
      );

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(savedUser);

      // Act
      const result = await useCase.execute(createUserDto);

      // Assert
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });
});

