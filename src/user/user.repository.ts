import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly user: Model<User>,
  ) {}

  async insertOne(data: Partial<User>): Promise<User> {
    const user = new this.user(data);
    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.user.findOne({ email });
  }

  async findOneById(id: string): Promise<User> {
    return this.user.findById(id);
  }
}
