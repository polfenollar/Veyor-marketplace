package main

import (
	"context"

	"log"
	"net"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"github.com/veyor/quoting-service/internal/config"
	"github.com/veyor/quoting-service/internal/core"
	"github.com/veyor/quoting-service/internal/integration"
	pb "github.com/veyor/quoting-service/pkg/pb"
)

type server struct {
	pb.UnimplementedQuotingServiceServer
	engine *core.Engine
}

func (s *server) GetQuotes(ctx context.Context, req *pb.QuoteRequest) (*pb.QuoteResponse, error) {
	return s.engine.CalculateQuotes(ctx, req)
}

func main() {
	cfg := config.Load()
	
	// Initialize Utils
	carrierClient := integration.NewCarrierClient(cfg)
	engine := core.NewEngine(cfg, carrierClient)

	// Listen
	lis, err := net.Listen("tcp", ":"+cfg.GRPCPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	// gRPC Server
	s := grpc.NewServer()
	pb.RegisterQuotingServiceServer(s, &server{engine: engine})
	
	// Enable Reflection for debugging (grpcurl)
	reflection.Register(s)

	log.Printf("Quoting Service listening on :%s", cfg.GRPCPort)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
