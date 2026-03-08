package config

import (
	"os"
	"strconv"
)

type Config struct {
	GRPCPort         string
	RedisAddr        string
	CarrierMockURL   string
	MarginPercentage float64
	FixedFeeUSD      float64
	RequestTimeoutMs int
}

func Load() *Config {
	return &Config{
		GRPCPort:         getEnv("GRPC_PORT", "50051"),
		RedisAddr:        getEnv("REDIS_ADDR", "localhost:6379"),
		CarrierMockURL:   getEnv("CARRIER_MOCK_URL", "http://localhost:3000"), // Default to localhost for local dev
		MarginPercentage: getEnvAsFloat("MARGIN_PERCENTAGE", 0.15),
		FixedFeeUSD:      getEnvAsFloat("FIXED_FEE_USD", 25.0),
		RequestTimeoutMs: getEnvAsInt("REQUEST_TIMEOUT_MS", 2000),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getEnvAsFloat(key string, fallback float64) float64 {
	valStr := getEnv(key, "")
	if val, err := strconv.ParseFloat(valStr, 64); err == nil {
		return val
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	valStr := getEnv(key, "")
	if val, err := strconv.Atoi(valStr); err == nil {
		return val
	}
	return fallback
}
