package models

import "time"

// Location representa uma localização geográfica
type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timezone  string  `json:"timezone"`
}

// WeatherData representa dados climáticos
type WeatherData struct {
	Temperature              float64 `json:"temperature"`
	Humidity                 int     `json:"humidity"`
	WindSpeed                float64 `json:"windSpeed"`
	Condition                string  `json:"condition"`
	PrecipitationProbability int     `json:"precipitationProbability"`
}

// WeatherLog representa um log completo de dados climáticos
type WeatherLog struct {
	Location  Location    `json:"location"`
	Data      WeatherData `json:"data"`
	Timestamp time.Time   `json:"timestamp"`
	Source    string      `json:"source"`
}
