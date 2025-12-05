package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/fredson0/gdash-weather-worker/internal/api"
	"github.com/fredson0/gdash-weather-worker/internal/config"
	"github.com/fredson0/gdash-weather-worker/internal/queue"
)

func main() {
	// Carregar variáveis de ambiente do .env
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  Arquivo .env não encontrado, usando variáveis de sistema")
	}

	log.Println("🚀 Iniciando GDASH Weather Worker...")

	// Carregar configuração
	cfg := config.Load()
	log.Printf("📋 Configurações:")
	log.Printf("   API: %s", cfg.APIBaseURL)
	log.Printf("   RabbitMQ: %s:%d", cfg.RabbitMQHost, cfg.RabbitMQPort)
	log.Printf("   Queue: %s", cfg.RabbitMQQueue)
	log.Printf("   Retry: %d tentativas com delay de %ds", cfg.RetryAttempts, cfg.RetryDelay)

	// Criar consumer RabbitMQ
	consumer, err := queue.NewConsumer(cfg)
	if err != nil {
		log.Fatalf("💥 Erro ao criar consumer: %v", err)
	}
	defer func() {
		log.Println("🔌 Fechando conexão com RabbitMQ...")
		consumer.Close()
	}()

	// Criar cliente da API
	apiClient := api.NewClient(cfg.APIBaseURL)
	log.Printf("✅ Cliente da API criado: %s", cfg.APIBaseURL)

	// Iniciar consumo de mensagens em goroutine separada
	errChan := make(chan error, 1)
	go func() {
		errChan <- consumer.Start(apiClient)
	}()

	log.Println("✅ Worker iniciado com sucesso!")
	log.Println("⏳ Aguardando mensagens na fila...")

	// Aguardar sinal de interrupção ou erro fatal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-sigChan:
		log.Printf("📡 Sinal %v recebido. Encerrando gracefully...", sig)
	case err := <-errChan:
		if err != nil {
			log.Printf("💥 Erro fatal no consumer: %v", err)
		}
	}

	log.Println("👋 Worker encerrado")
}
