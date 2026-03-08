# Start from official Go image
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy mod file
COPY go.mod ./
# No go.sum yet as we only use standard library, but if we did:
# COPY go.sum ./
# RUN go mod download

# Copy source
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o carrier-sim ./cmd/server

# Run stage
FROM alpine:3.19

WORKDIR /root/

COPY --from=builder /app/carrier-sim .

EXPOSE 3000

ENV PORT=3000
ENV CHAOS_ENABLED=true

CMD ["./carrier-sim"]
