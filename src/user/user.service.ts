import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/request/create-user-request.dto';
import { UserRepository } from './user.repository';
import { hash } from 'bcrypt';
import { UserResponse } from './dto/response/user-response.dto';
import { User } from './entities/user.entity';

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
    };
  }
}
