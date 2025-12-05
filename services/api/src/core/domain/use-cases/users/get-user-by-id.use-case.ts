import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  async execute(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
