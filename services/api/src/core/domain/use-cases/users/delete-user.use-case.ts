import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  async execute(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new Error('User not found');
    }
  }
}
