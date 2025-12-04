import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../../application';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { Roles, CurrentUser } from '../../shared/decorators';
import { UserRole, User } from '../../core/domain/entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/users';

/**
 * Controller de usuários (rotas protegidas por JWT)
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get('me')
  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDTO) {
    const { email, password, name, role, avatar } = dto;
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new Error('Email já cadastrado');
    }
    return this.usersService.findByEmail(email);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
  }
}
