package models

import "time"

// WeatherData representa dados climáticos recebidos do Python Collector
// Deve match com o formato enviado pelo Python (WeatherData.to_dict())
type WeatherData struct {
	Location      string    `json:"location"`
	Temperature   float64   `json:"temperature"`
	Humidity      int       `json:"humidity"`
	WindSpeed     float64   `json:"windSpeed"`
	Precipitation float64   `json:"precipitation"`
	Condition     string    `json:"condition"`
	Timestamp     time.Time `json:"timestamp"`
}
