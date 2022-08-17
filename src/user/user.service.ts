import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserRequest } from './dto/request/create-user-request.dto';
import { UserRepository } from './user.repository';
import { hash, compare } from 'bcryptjs';
import { UserResponse } from './dto/response/user-response.dto';
import { User } from './entities/user.entity';
import { CoinBaseAuth } from './entities/coinbase-auth.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    createUserRequest: CreateUserRequest,
  ): Promise<UserResponse> {
    await this.validateCreateUserRequest(createUserRequest);

    return this.buildResponse(
      await this.userRepository.insertOne({
        ...createUserRequest,
        password: await hash(createUserRequest.password, 10),
      }),
    );
  }

  async updateUser(userId: string, data: Partial<User>): Promise<UserResponse> {
    const user = await this.userRepository.updateOne(userId, data);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return this.buildResponse(user);
  }

  private async validateCreateUserRequest(
    createUserRequest: CreateUserRequest,
  ): Promise<void> {
    const user = await this.userRepository.findByEmail(createUserRequest.email);
    if (user) {
      throw new BadRequestException(
        `User ${createUserRequest.email} already exists`,
      );
    }
  }

  private buildResponse(user: User): UserResponse {
    return {
      _id: user._id,
      email: user.email,
      isCoinBaseAuthorized: !!user.coinbase_auth,
    };
  }

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User does not exist by email: ${email}`);
    }

    const passwordIsValid = await compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are invalid.');
    }

    return this.buildResponse(user);
  }

  async getUserById(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException(`User does not exist by id: ${userId}`);
    }

    return this.buildResponse(user);
  }

  async getCoinAuth(userId: string): Promise<CoinBaseAuth> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User does not exist by id: ${userId}`);
    }

    if (!user.coinbase_auth) {
      throw new UnauthorizedException(
        'User with id ${userId} is not authorized with a coinbase auth',
      );
    }

    return user.coinbase_auth;
  }
}
