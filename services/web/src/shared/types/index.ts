// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Weather Types
export interface WeatherData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
  timestamp: string;
  createdAt: string;
}

export interface WeatherStats {
  avgTemperature: number;
  avgHumidity: number;
  avgWindSpeed: number;
  totalRecords: number;
}

// Insight Types
export interface Insight {
  id: string;
  title: string;
  content: string;
  type: 'prediction' | 'analysis' | 'recommendation';
  weatherDataId: string;
  createdAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
