package main

import (
	"log"
	"net/http"

	"github.com/veyor/carrier-simulator/internal/api"
	"github.com/veyor/carrier-simulator/internal/config"
	"github.com/veyor/carrier-simulator/internal/logic"
)

func main() {
	cfg := config.Load()
	log.Printf("Starting Carrier Simulator on port %s (Chaos: %v)", cfg.Port, cfg.ChaosEnabled)

	sim := logic.New(cfg)
	handler := api.NewHandler(sim)

	http.HandleFunc("/api/search", handler.HandleSearch)

	// Health check
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	if err := http.ListenAndServe(":"+cfg.Port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
