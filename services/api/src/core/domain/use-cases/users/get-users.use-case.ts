import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  async execute(): Promise<any[]> {
    const users = await this.userModel.find().select('-password');
    
    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
