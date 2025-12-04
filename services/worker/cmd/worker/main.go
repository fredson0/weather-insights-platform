package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	// TODO: Importar seus pacotes internos conforme implementar
	// "github.com/fredson0/gdash-weather-worker/internal/config"
	// "github.com/fredson0/gdash-weather-worker/internal/queue"
	// "github.com/fredson0/gdash-weather-worker/internal/api"
)

func main() {
	// Carregar variáveis de ambiente
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis de sistema")
	}

	log.Println("🚀 Iniciando GDASH Weather Worker...")

	// TODO: Inicializar configuração
	// cfg := config.Load()

	// TODO: Conectar ao RabbitMQ
	// consumer, err := queue.NewConsumer(cfg)
	// if err != nil {
	//     log.Fatalf("Erro ao criar consumer: %v", err)
	// }
	// defer consumer.Close()

	// TODO: Inicializar cliente da API
	// apiClient := api.NewClient(cfg.APIBaseURL)

	// TODO: Iniciar consumo de mensagens
	// go consumer.Start(apiClient)

	log.Println("✅ Worker iniciado com sucesso!")
	log.Println("⏳ Aguardando mensagens...")

	// Aguardar sinal de interrupção
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Println("⛔ Worker encerrado")
}
