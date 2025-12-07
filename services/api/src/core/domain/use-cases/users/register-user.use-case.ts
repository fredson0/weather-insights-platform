import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository.interface';

export class RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new this.userModel({
      ...dto,
      password: hashedPassword,
      role: dto.role || 'user',
    });

    const savedUser = await user.save();

    return {
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      password: savedUser.password,
      role: savedUser.role,
      isActive: savedUser.isActive ?? true,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
}
