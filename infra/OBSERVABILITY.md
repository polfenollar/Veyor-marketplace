# Observability Stack

This directory contains the complete observability infrastructure for veyor Marketplace.

## Stack Components

| Component | Port | Purpose |
|-----------|------|---------|
| **Prometheus** | 9090 | Metrics collection and storage |
| **Grafana** | 3001 | Visualization dashboards |
| **Jaeger** | 16686 | Distributed tracing UI |
| **Loki** | 3100 | Log aggregation |

## Quick Start

```bash
# Start all observability services
cd infra
docker-compose up -d prometheus grafana jaeger loki

# Verify services are running
docker-compose ps
```

## Access URLs

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Jaeger UI**: http://localhost:16686

## Grafana Dashboards

Pre-configured dashboard: **veyor Marketplace - Business Metrics**

Includes panels for:
- Bookings created (last 24h)
- API response time (P95)
- HTTP requests by status
- JVM memory usage
- Database connections
- Error rate (5xx)
- Redis operations

## Metrics Available

The Spring Boot backend exposes metrics at `/actuator/prometheus`:

```bash
curl http://localhost:8080/actuator/prometheus
```

### Key Metrics

- `http_server_requests_total` - HTTP request count
- `http_server_requests_seconds` - Request duration
- `jvm_memory_used_bytes` - JVM memory usage
- `hikaricp_connections_active` - Database connections
- `spring_data_redis_operations_total` - Redis operations

## Distributed Tracing

OpenTelemetry is configured to send traces to Jaeger via OTLP.

**Configuration** (`application.properties`):
```properties
management.tracing.sampling.probability=1.0
management.otlp.tracing.endpoint=http://localhost:4318/v1/traces
```

View traces at: http://localhost:16686

## Adding Custom Metrics

Example in a controller:

```java
@Autowired
private MeterRegistry meterRegistry;

public void createBooking(Booking booking) {
    meterRegistry.counter("booking.created", 
        "status", booking.getStatus()).increment();
}
```

## Alerting (Future)

To add alerts, create `prometheus-alerts.yml` and configure Alertmanager.

Example alert:
```yaml
- alert: HighErrorRate
  expr: rate(http_server_requests_total{status=~"5.."}[5m]) > 0.1
  annotations:
    summary: "High error rate detected"
```
