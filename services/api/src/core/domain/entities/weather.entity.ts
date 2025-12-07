export interface WeatherData {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  temperature: number; // Celsius
  humidity: number; // Percentage
  windSpeed: number; // km/h
  windDirection: number; // Degrees
  precipitation: number; // mm
  pressure: number; // hPa
  cloudCover: number; // Percentage
  weatherCode: number; // WMO code
  timestamp: Date;
  source: string; // e.g., 'open-meteo'
  createdAt: Date;
}

export interface CreateWeatherDataDTO {
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  pressure: number;
  cloudCover: number;
  weatherCode: number;
  timestamp?: Date;
  source?: string;
}

export interface WeatherQueryParams {
  location?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface WeatherStatistics {
  location: string;
  avgTemperature: number;
  minTemperature: number;
  maxTemperature: number;
  avgHumidity: number;
  avgWindSpeed: number;
  totalPrecipitation: number;
  dataPoints: number;
  period: {
    start: Date;
    end: Date;
  };
}
