package api

import (
	"bytes"
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

// SendWeatherData envia dados climáticos para a API NestJS
func (c *Client) SendWeatherData(data []byte) error {
	// Endpoint da API NestJS (WeatherController.create)
	url := fmt.Sprintf("%s/weather", c.baseURL)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	if err != nil {
		return fmt.Errorf("erro ao criar request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	log.Printf("🌐 POST %s", url)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("erro ao enviar dados: %w", err)
	}
	defer resp.Body.Close()

	// Ler resposta
	body, _ := io.ReadAll(resp.Body)

	// Aceitar 200 OK ou 201 Created
	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API retornou status %d: %s", resp.StatusCode, string(body))
	}

	log.Printf("✅ Dados enviados para API - Status: %d", resp.StatusCode)
	return nil
}
