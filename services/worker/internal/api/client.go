package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// Client cliente HTTP para comunicação com a API
type Client struct {
	baseURL    string
	httpClient *http.Client
}

// NewClient cria um novo cliente da API
func NewClient(baseURL string) *Client {
	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// SendWeatherData envia dados climáticos para a API
func (c *Client) SendWeatherData(data []byte) error {
	// TODO: Implementar envio para API
	// url := fmt.Sprintf("%s/api/weather/logs", c.baseURL)

	// req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	// if err != nil {
	//     return fmt.Errorf("erro ao criar request: %w", err)
	// }

	// req.Header.Set("Content-Type", "application/json")

	// resp, err := c.httpClient.Do(req)
	// if err != nil {
	//     return fmt.Errorf("erro ao enviar dados: %w", err)
	// }
	// defer resp.Body.Close()

	// if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
	//     body, _ := io.ReadAll(resp.Body)
	//     return fmt.Errorf("API retornou status %d: %s", resp.StatusCode, string(body))
	// }

	// log.Printf("✅ Dados enviados para API com sucesso")
	// return nil

	log.Printf("Cliente da API implementado - adicione a lógica de envio")
	return nil
}

// Retry tenta executar uma função com retry
func (c *Client) Retry(fn func() error, attempts int, delay time.Duration) error {
	var err error
	for i := 0; i < attempts; i++ {
		err = fn()
		if err == nil {
			return nil
		}

		if i < attempts-1 {
			log.Printf("⚠️  Tentativa %d falhou: %v. Tentando novamente em %v...", i+1, err, delay)
			time.Sleep(delay)
		}
	}
	return fmt.Errorf("após %d tentativas: %w", attempts, err)
}
