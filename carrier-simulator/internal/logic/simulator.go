package logic

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/veyor/carrier-simulator/internal/config"
	"github.com/veyor/carrier-simulator/internal/models"
)

// normalizeLocode removes dashes and converts to uppercase
func normalizeLocode(code string) string {
	return strings.ToUpper(strings.ReplaceAll(code, "-", ""))
}

// getRegion extracts the region from a location code based on country prefix
func getRegion(locode string) string {
	normalized := normalizeLocode(locode)
	if len(normalized) < 2 {
		return "OTHER"
	}
	country := normalized[:2]
	
	// Asia-Pacific
	if country == "CN" || country == "JP" || country == "KR" || 
	   country == "SG" || country == "HK" || country == "TW" {
		return "ASIA"
	}
	// Europe
	if country == "DE" || country == "GB" || country == "FR" || 
	   country == "NL" || country == "ES" || country == "IT" {
		return "EUROPE"
	}
	// Americas
	if country == "US" || country == "CA" || country == "MX" || 
	   country == "BR" {
		return "AMERICAS"
	}
	// Middle East
	if country == "AE" || country == "SA" || country == "QA" {
		return "MIDDLE_EAST"
	}
	// India/South Asia
	if country == "IN" || country == "PK" || country == "BD" {
		return "SOUTH_ASIA"
	}
	return "OTHER"
}

// calculateBaseRate computes base rate based on origin and destination regions
func calculateBaseRate(origin, destination string) float64 {
	originRegion := getRegion(origin)
	destRegion := getRegion(destination)
	
	basePrice := 1500.0 // New baseline
	
	// Same region - shorter distance
	if originRegion == destRegion {
		return basePrice * 0.6
	}
	
	// Cross-regional pricing based on typical shipping distances
	if (originRegion == "ASIA" && destRegion == "EUROPE") || 
	   (originRegion == "EUROPE" && destRegion == "ASIA") {
		return basePrice * 1.8
	}
	if (originRegion == "ASIA" && destRegion == "AMERICAS") || 
	   (originRegion == "AMERICAS" && destRegion == "ASIA") {
		return basePrice * 2.2
	}
	if (originRegion == "EUROPE" && destRegion == "AMERICAS") || 
	   (originRegion == "AMERICAS" && destRegion == "EUROPE") {
		return basePrice * 1.5
	}
	if (originRegion == "ASIA" && destRegion == "MIDDLE_EAST") || 
	   (originRegion == "MIDDLE_EAST" && destRegion == "ASIA") {
		return basePrice * 1.2
	}
	if (originRegion == "ASIA" && destRegion == "SOUTH_ASIA") || 
	   (originRegion == "SOUTH_ASIA" && destRegion == "ASIA") {
		return basePrice * 0.8
	}
	
	// Default for other combinations
	return basePrice
}

type Simulator struct {
	cfg *config.Config
	rnd *rand.Rand
}

func New(cfg *config.Config) *Simulator {
	return &Simulator{
		cfg: cfg,
		rnd: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

func (s *Simulator) CalculateQuote(req models.QuoteRequest) (*models.QuoteResponse, error) {
	// Chaos: Latency
	if s.cfg.ChaosEnabled {
		latency := s.rnd.Intn(s.cfg.MaxLatencyMs)
		time.Sleep(time.Duration(latency) * time.Millisecond)

		// Chaos: Random Failure
		if s.rnd.Float64() < s.cfg.FailureRate {
			// Randomly 500 or 429
			if s.rnd.Float64() < 0.5 {
				return nil, fmt.Errorf("HTTP 500: Internal Carrier System Error")
			}
			return nil, fmt.Errorf("HTTP 429: Too Many Requests")
		}
	}

	// 1. Normalize location codes (handles both "CN-SZX" and "CNSZX" formats)
	origin := normalizeLocode(req.Origin)
	destination := normalizeLocode(req.Destination)

	// 2. Calculate base rate using region-based pricing
	baseRate := calculateBaseRate(origin, destination)

	// 3. Equipment Sensitivity
	if req.Equipment == "40FT" || req.Equipment == "40HC" {
		baseRate *= 1.8 // Roughly 2x 20FT, a bit cheaper
	} else if req.Equipment == "40RF" {
		baseRate *= 2.5 // Reefer is expensive
	}

	// 4. Weight Sensitivity & Surcharges
	surcharges := []models.Surcharge{
		{Code: "BAF", Amount: 150.0},
		{Code: "CAF", Amount: 50.0},
	}
	
	// OWS Check
	// If 20FT and >21500kg, carrier might add OWS.
	// Let's implement logic: Carrier DOES add OWS if weight > 22000 (slightly higher than our internal check)
	if req.Weight > 22000.0 {
		surcharges = append(surcharges, models.Surcharge{Code: "OWS", Amount: 250.0})
	}

	// PSS (Peak Season Surcharge)
	// Randomly apply PSS
	if s.rnd.Float64() < 0.3 {
		surcharges = append(surcharges, models.Surcharge{Code: "PSS", Amount: 400.0})
	}

	return &models.QuoteResponse{
		CarrierID:  "SIM-CARRIER-V1",
		BaseRate:   baseRate,
		Currency:   "USD",
		Surcharges: surcharges,
		ValidUntil: time.Now().Add(24 * time.Hour * 30).Format("2006-01-02"),
	}, nil
}
