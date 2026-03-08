package integration

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/veyor/quoting-service/internal/config"
)

type CarrierClient struct {
	baseURL string
	client  *http.Client
}

func NewCarrierClient(cfg *config.Config) *CarrierClient {
	return &CarrierClient{
		baseURL: cfg.CarrierMockURL,
		client: &http.Client{
			Timeout: time.Duration(cfg.RequestTimeoutMs-50) * time.Millisecond,
		},
	}
}

type SimulatorRequest struct {
	Origin        string  `json:"origin"`
	Destination   string  `json:"destination"`
	DepartureDate string  `json:"departureDate"`
	Equipment     string  `json:"equipment"`
	Weight        float64 `json:"weight"`
	Commodity     string  `json:"commodity"`
}

type SimulatorResponse struct {
	CarrierID  string      `json:"carrierId"`
	BaseRate   float64     `json:"baseRate"`
	Currency   string      `json:"currency"`
	Surcharges []Surcharge `json:"surcharges"`
	ValidUntil string      `json:"validUntil"`
}

type Surcharge struct {
	Code   string  `json:"code"`
	Amount float64 `json:"amount"`
}

func (c *CarrierClient) GetRate(ctx context.Context, req SimulatorRequest) (*SimulatorResponse, error) {
	body, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/api/search", c.baseURL)
	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("carrier returned status: %d", resp.StatusCode)
	}

	var simResp SimulatorResponse
	if err := json.NewDecoder(resp.Body).Decode(&simResp); err != nil {
		return nil, err
	}

	return &simResp, nil
}
