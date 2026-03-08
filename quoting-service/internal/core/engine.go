package core

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math"
	"sync"
	"time"

	"github.com/veyor/quoting-service/internal/config"
	"github.com/veyor/quoting-service/internal/integration"
	pb "github.com/veyor/quoting-service/pkg/pb" 
)

type Engine struct {
	cfg           *config.Config
	carrierClient *integration.CarrierClient
	// redisClient *redis.Client // TODO: Implement Redis
}

func NewEngine(cfg *config.Config, client *integration.CarrierClient) *Engine {
	return &Engine{
		cfg:           cfg,
		carrierClient: client,
	}
}

func (e *Engine) CalculateQuotes(ctx context.Context, req *pb.QuoteRequest) (*pb.QuoteResponse, error) {
	// 1. Validation (Locode check would go here, skipping for MVP)
	
	// 2. Map Proto to Simulator Request
	simReq := integration.SimulatorRequest{
		Origin:        req.OriginLocode,
		Destination:   req.DestinationLocode,
		DepartureDate: req.ReadyDate,
		Equipment:     req.Cargo.EquipmentType,
		Weight:        req.Cargo.TotalWeightKg,
		Commodity:     req.Cargo.CommodityType,
	}

	// 3. Fan-out (In MVP, just one call, but structured for concurrency)
	var wg sync.WaitGroup
	results := make(chan *pb.Quote, 1)

	wg.Add(1)
	go func() {
		defer wg.Done()
		
		// Call Simulator
		rate, err := e.carrierClient.GetRate(ctx, simReq)
		if err != nil {
			// Log error, but don't fail everything if we had multiple carriers
			fmt.Printf("Carrier failed: %v\n", err)
			return
		}

		// 4. Core Logic
		quote := e.processRate(req, rate)
		results <- quote
	}()

	wg.Wait()
	close(results)

	resp := &pb.QuoteResponse{
		Quotes: []*pb.Quote{},
	}

	for q := range results {
		resp.Quotes = append(resp.Quotes, q)
	}

	return resp, nil
}

func (e *Engine) processRate(req *pb.QuoteRequest, rate *integration.SimulatorResponse) *pb.Quote {
	// A. Aggregate Surcharges
	var totalSurcharges float64
	var protoSurcharges []*pb.Surcharge
	
	hasOWS := false
	for _, s := range rate.Surcharges {
		totalSurcharges += s.Amount
		protoSurcharges = append(protoSurcharges, &pb.Surcharge{
			Code:   s.Code,
			Amount: s.Amount,
		})
		if s.Code == "OWS" {
			hasOWS = true
		}
	}

	// B. Internal OWS Logic
	if req.Cargo.TotalWeightKg > 21500.0 && !hasOWS {
		owsFee := 150.0
		totalSurcharges += owsFee
		protoSurcharges = append(protoSurcharges, &pb.Surcharge{
			Code:   "OWS (Internal)",
			Amount: owsFee,
		})
	}

	// C. Base Cost
	totalCost := rate.BaseRate + totalSurcharges

	// D. Currency Conversion
	// MVP: Assume USD for everything. 
	// Real implementation needs Redis lookup: RATES:EXCHANGE:{rate.Currency}:{req.CurrencyRequested}
	
	// E. Profit Margin
	// SellPrice = TotalCost * (1 + Margin) + FixedFee
	sellPrice := totalCost * (1 + e.cfg.MarginPercentage)
	sellPrice += e.cfg.FixedFeeUSD

	// F. Incoterm Tiering
	if req.Incoterm == "EXW" {
		sellPrice += 50.0 // Extra handling for EXW
	}

	// Generate ID
	idInput := fmt.Sprintf("%s%s%f%s", req.OriginLocode, req.DestinationLocode, sellPrice, time.Now().String())
	hash := sha256.Sum256([]byte(idInput))
	quoteID := hex.EncodeToString(hash[:])

	return &pb.Quote{
		QuoteId:         quoteID,
		CarrierName:     rate.CarrierID,
		TotalPrice:      math.Round(sellPrice*100) / 100, // Round to 2 decimals
		Currency:        "USD", // Hardcoded for MVP
		TransitTimeDays: 30,    // Hardcoded for MVP
		ValidUntil:      rate.ValidUntil,
		Breakdown: &pb.CostBreakdown{
			BaseFreight: rate.BaseRate,
			Surcharges:  protoSurcharges,
			FixedFees:   e.cfg.FixedFeeUSD,
		},
	}
}
