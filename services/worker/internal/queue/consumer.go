package queue

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/fredson0/gdash-weather-worker/internal/api"
	"github.com/fredson0/gdash-weather-worker/internal/config"
	"github.com/fredson0/gdash-weather-worker/internal/models"
)

// Consumer gerencia o consumo de mensagens do RabbitMQ
type Consumer struct {
	conn          *amqp.Connection
	channel       *amqp.Channel
	queue         string
	retryAttempts int
	retryDelay    time.Duration
}

// NewConsumer cria um novo consumer
func NewConsumer(cfg *config.Config) (*Consumer, error) {
	url := fmt.Sprintf("amqp://%s:%s@%s:%d/",
		cfg.RabbitMQUser,
		cfg.RabbitMQPassword,
		cfg.RabbitMQHost,
		cfg.RabbitMQPort,
	)

	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, fmt.Errorf("❌ Falha ao conectar no RabbitMQ: %w", err)
	}

	channel, err := conn.Channel()
	if err != nil {
		conn.Close()
		return nil, fmt.Errorf("❌ Falha ao abrir canal: %w", err)
	}

	// Configurar QoS - processa 1 mensagem por vez
	err = channel.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		channel.Close()
		conn.Close()
		return nil, fmt.Errorf("❌ Falha ao configurar QoS: %w", err)
	}

	// Declarar queue (deve match com a criada pelo Python)
	_, err = channel.QueueDeclare(
		cfg.RabbitMQQueue, // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	if err != nil {
		channel.Close()
		conn.Close()
		return nil, fmt.Errorf("❌ Falha ao declarar queue: %w", err)
	}

	log.Printf("✅ Conectado ao RabbitMQ %s:%d - Queue: %s", cfg.RabbitMQHost, cfg.RabbitMQPort, cfg.RabbitMQQueue)

	return &Consumer{
		conn:          conn,
		channel:       channel,
		queue:         cfg.RabbitMQQueue,
		retryAttempts: cfg.RetryAttempts,
		retryDelay:    time.Duration(cfg.RetryDelay) * time.Second,
	}, nil
}

// Start inicia o consumo de mensagens
func (c *Consumer) Start(apiClient *api.Client) error {
	msgs, err := c.channel.Consume(
		c.queue, // queue
		"",      // consumer tag
		false,   // auto-ack (false = controle manual)
		false,   // exclusive
		false,   // no-local
		false,   // no-wait
		nil,     // args
	)
	if err != nil {
		return fmt.Errorf("❌ Falha ao registrar consumer: %w", err)
	}

	log.Printf("⏳ Aguardando mensagens na fila: %s", c.queue)

	for msg := range msgs {
		log.Printf("📨 Mensagem recebida: %s", string(msg.Body))

		// Parsear JSON da mensagem
		var weatherData models.WeatherData
		err := json.Unmarshal(msg.Body, &weatherData)
		if err != nil {
			log.Printf("❌ Erro ao parsear JSON: %v", err)
			msg.Nack(false, false) // Não reenvia (mensagem inválida)
			continue
		}

		log.Printf("🌡️  Dados: %s - Temp: %.1f°C, Umidade: %d%%",
			weatherData.Location,
			weatherData.Temperature,
			weatherData.Humidity,
		)

		// Tentar enviar para API com retry
		err = c.sendWithRetry(apiClient, msg.Body)
		if err != nil {
			log.Printf("❌ Falha após %d tentativas: %v", c.retryAttempts, err)
			msg.Nack(false, true) // Reenvia para fila
		} else {
			log.Println("✅ Mensagem processada e enviada para API com sucesso")
			msg.Ack(false) // Confirma processamento
		}
	}

	return nil
}

// sendWithRetry tenta enviar dados com retry
func (c *Consumer) sendWithRetry(apiClient *api.Client, data []byte) error {
	var lastErr error

	for attempt := 1; attempt <= c.retryAttempts; attempt++ {
		err := apiClient.SendWeatherData(data)
		if err == nil {
			if attempt > 1 {
				log.Printf("✅ Sucesso na tentativa %d", attempt)
			}
			return nil
		}

		lastErr = err

		if attempt < c.retryAttempts {
			log.Printf("⚠️  Tentativa %d/%d falhou: %v. Tentando novamente em %v...",
				attempt, c.retryAttempts, err, c.retryDelay)
			time.Sleep(c.retryDelay)
		}
	}

	return fmt.Errorf("após %d tentativas: %w", c.retryAttempts, lastErr)
}

// Close fecha a conexão com RabbitMQ
func (c *Consumer) Close() error {
	if c.channel != nil {
		c.channel.Close()
	}
	if c.conn != nil {
		return c.conn.Close()
	}
	log.Println("🔌 Conexão com RabbitMQ fechada")
	return nil
}
