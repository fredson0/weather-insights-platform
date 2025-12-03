export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // Hash
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}
