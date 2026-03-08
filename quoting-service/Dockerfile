# Builder Stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install Protoc
RUN apk add --no-cache protobuf-dev protoc

# Install Go Plugins
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.33.0
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.3.0

ENV PATH="$PATH:$(go env GOPATH)/bin"

COPY go.mod ./
RUN go mod download

COPY . .

# Generate Proto Code
RUN mkdir -p pkg/pb
RUN protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/quoting.proto

# Move generated files if needed or adjust imports.
# Matches option go_package = "github.com/veyor/quoting-service/pkg/pb";
# The above command with paths=source_relative will generate in proto/quoting.pb.go if not careful.
# Let's verify structure. With source_relative, it mimics the input structure.
# We want it in pkg/pb. 
# So we run:
RUN protoc --proto_path=proto --go_out=pkg/pb --go_opt=paths=source_relative \
    --go-grpc_out=pkg/pb --go-grpc_opt=paths=source_relative \
    quoting.proto

# Tidy dependencies (to pick up generated code deps)
RUN go mod tidy

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o quoting-svc ./cmd/server


# Runner Stage
FROM alpine:3.19

WORKDIR /root/

COPY --from=builder /app/quoting-svc .

EXPOSE 50051

CMD ["./quoting-svc"]
