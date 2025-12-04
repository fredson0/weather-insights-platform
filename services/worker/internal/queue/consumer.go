package queue

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/fredson0/gdash-weather-worker/internal/config"
)

// Consumer gerencia o consumo de mensagens do RabbitMQ
type Consumer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	queue   string
}

// NewConsumer cria um novo consumer
func NewConsumer(cfg *config.Config) (*Consumer, error) {
	// TODO: Implementar conexão com RabbitMQ
	// url := fmt.Sprintf("amqp://%s:%s@%s:%d%s",
	//     cfg.RabbitMQUser,
	//     cfg.RabbitMQPassword,
	//     cfg.RabbitMQHost,
	//     cfg.RabbitMQPort,
	//     cfg.RabbitMQVHost,
	// )

	// conn, err := amqp.Dial(url)
	// if err != nil {
	//     return nil, fmt.Errorf("falha ao conectar no RabbitMQ: %w", err)
	// }

	// channel, err := conn.Channel()
	// if err != nil {
	//     conn.Close()
	//     return nil, fmt.Errorf("falha ao abrir canal: %w", err)
	// }

	// // Declarar queue
	// _, err = channel.QueueDeclare(
	//     cfg.RabbitMQQueue, // name
	//     true,              // durable
	//     false,             // delete when unused
	//     false,             // exclusive
	//     false,             // no-wait
	//     nil,               // arguments
	// )
	// if err != nil {
	//     channel.Close()
	//     conn.Close()
	//     return nil, fmt.Errorf("falha ao declarar queue: %w", err)
	// }

	// log.Printf("✅ Conectado ao RabbitMQ: %s:%d", cfg.RabbitMQHost, cfg.RabbitMQPort)

	// return &Consumer{
	//     conn:    conn,
	//     channel: channel,
	//     queue:   cfg.RabbitMQQueue,
	// }, nil

	// Placeholder - remover quando implementar
	return &Consumer{}, nil
}

// Start inicia o consumo de mensagens
func (c *Consumer) Start(apiClient interface{}) {
	// TODO: Implementar consumo de mensagens
	// msgs, err := c.channel.Consume(
	//     c.queue, // queue
	//     "",      // consumer
	//     false,   // auto-ack (false para controle manual)
	//     false,   // exclusive
	//     false,   // no-local
	//     false,   // no-wait
	//     nil,     // args
	// )
	// if err != nil {
	//     log.Fatalf("Falha ao registrar consumer: %v", err)
	// }

	// log.Printf("⏳ Aguardando mensagens na fila: %s", c.queue)

	// for msg := range msgs {
	//     log.Printf("📨 Mensagem recebida: %s", msg.Body)
	    
	//     // TODO: Processar mensagem e enviar para API
	//     // err := apiClient.SendWeatherData(msg.Body)
	//     // if err != nil {
	//     //     log.Printf("❌ Erro ao processar mensagem: %v", err)
	//     //     msg.Nack(false, true) // Reenviar para fila
	//     // } else {
	//     //     log.Println("✅ Mensagem processada com sucesso")
	//     //     msg.Ack(false)
	//     // }
	// }

	log.Println("Consumer implementado - adicione a lógica de processamento")
}

// Close fecha a conexão
func (c *Consumer) Close() {
	if c.channel != nil {
		c.channel.Close()
	}
	if c.conn != nil {
		c.conn.Close()
	}
	log.Println("Conexão com RabbitMQ fechada")
}
