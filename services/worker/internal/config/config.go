package config

import (
	"os"
	"strconv"
)

// Config armazena as configurações da aplicação
type Config struct {
	// Worker
	LogLevel      string
	RetryAttempts int
	RetryDelay    int

	// API
	APIBaseURL string

	// RabbitMQ
	RabbitMQHost       string
	RabbitMQPort       int
	RabbitMQUser       string
	RabbitMQPassword   string
	RabbitMQVHost      string
	RabbitMQQueue      string
}

// Load carrega as configurações das variáveis de ambiente
func Load() *Config {
	return &Config{
		// Worker
		LogLevel:      getEnv("WORKER_LOG_LEVEL", "info"),
		RetryAttempts: getEnvAsInt("WORKER_RETRY_ATTEMPTS", 3),
		RetryDelay:    getEnvAsInt("WORKER_RETRY_DELAY", 5),

		// API
		APIBaseURL: getEnv("API_BASE_URL", "http://localhost:3000"),

		// RabbitMQ
		RabbitMQHost:     getEnv("RABBITMQ_HOST", "localhost"),
		RabbitMQPort:     getEnvAsInt("RABBITMQ_PORT", 5672),
		RabbitMQUser:     getEnv("RABBITMQ_USER", "admin"),
		RabbitMQPassword: getEnv("RABBITMQ_PASSWORD", "admin123"),
		RabbitMQVHost:    getEnv("RABBITMQ_VHOST", "/"),
		RabbitMQQueue:    getEnv("RABBITMQ_QUEUE", "weather-data"),
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return defaultValue
	}
	return value
}
