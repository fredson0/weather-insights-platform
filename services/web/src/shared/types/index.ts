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
  accessToken: string;
  user: User;
}

// Weather Types
export interface WeatherData {
  id: string;
  location: string;
  latitude?: number;
  longitude?: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  precipitation: number;
  pressure?: number;
  cloudCover?: number;
  weatherCode?: number;
  condition: string;
  source?: string;
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
  description: string;
  type: 'weather_analysis' | 'trend_prediction' | 'anomaly_detection' | 'recommendation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
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
