package models

type QuoteRequest struct {
	Origin        string   `json:"origin"`
	Destination   string   `json:"destination"`
	DepartureDate string   `json:"departureDate"`
	Equipment     string   `json:"equipment"`
	Weight        float64  `json:"weight"`
	Commodity     string   `json:"commodity"`
}

type Surcharge struct {
	Code   string  `json:"code"`
	Amount float64 `json:"amount"`
}

type QuoteResponse struct {
	CarrierID  string      `json:"carrierId"`
	BaseRate   float64     `json:"baseRate"`
	Currency   string      `json:"currency"`
	Surcharges []Surcharge `json:"surcharges"`
	ValidUntil string      `json:"validUntil"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
