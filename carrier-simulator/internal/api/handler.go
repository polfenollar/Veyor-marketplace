package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/veyor/carrier-simulator/internal/logic"
	"github.com/veyor/carrier-simulator/internal/models"
)

type Handler struct {
	sim *logic.Simulator
}

func NewHandler(sim *logic.Simulator) *Handler {
	return &Handler{sim: sim}
}

func (h *Handler) HandleSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.QuoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Basic Logic Validation
	if req.Origin == "" || req.Destination == "" {
		http.Error(w, "Origin and Destination required", http.StatusBadRequest)
		return
	}

	resp, err := h.sim.CalculateQuote(req)
	if err != nil {
		if strings.Contains(err.Error(), "429") {
			http.Error(w, err.Error(), http.StatusTooManyRequests)
			return
		}
		if strings.Contains(err.Error(), "500") {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
