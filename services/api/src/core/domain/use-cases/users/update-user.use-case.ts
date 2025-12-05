import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<any> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true }
    ).select('-password');
    
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
