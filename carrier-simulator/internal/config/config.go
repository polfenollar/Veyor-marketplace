package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port           string
	ChaosEnabled   bool
	FailureRate    float64 // 0.0 to 1.0
	MaxLatencyMs   int
	Environment    string
}

func Load() *Config {
	return &Config{
		Port:           getEnv("PORT", "3000"),
		ChaosEnabled:   getEnv("CHAOS_ENABLED", "true") == "true",
		FailureRate:    getEnvAsFloat("FAILURE_RATE", 0.05), // 5% default
		MaxLatencyMs:   getEnvAsInt("MAX_LATENCY_MS", 2000),
		Environment:    getEnv("ENV", "dev"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
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

func getEnvAsFloat(key string, fallback float64) float64 {
	valStr := getEnv(key, "")
	if val, err := strconv.ParseFloat(valStr, 64); err == nil {
		return val
	}
	return fallback
}
