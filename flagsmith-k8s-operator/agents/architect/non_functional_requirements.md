# Non-Functional Requirements - Flagsmith Kubernetes Operator

**Architect Deliverable**  
**Version**: 1.0  
**Date**: 2026-02-13

---

## 1. Performance Requirements

### 1.1 Reconciliation Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Reconciliation Latency (p50) | < 2 seconds | Time from event to reconciliation complete |
| Reconciliation Latency (p95) | < 5 seconds | 95th percentile latency |
| Reconciliation Latency (p99) | < 10 seconds | 99th percentile latency |
| Throughput | 100 reconciliations/second | Sustained throughput |
| Queue Depth | < 1000 items | Maximum items in work queue |

**Acceptance Criteria**:
- ✅ p95 latency < 5s under normal load
- ✅ No reconciliation timeouts under 10,000 resources
- ✅ Queue never exceeds 1000 items
- ✅ CPU usage < 70% under normal load

### 1.2 API Client Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Call Latency (p95) | < 500ms | Time for Flagsmith API calls |
| Connection Pool Size | 50 connections | Concurrent API connections |
| Retry Attempts | 3 attempts | Max retries with exponential backoff |
| Circuit Breaker Threshold | 5 failures | Failures before circuit opens |
| Circuit Breaker Timeout | 30 seconds | Time before retry after circuit open |

**Acceptance Criteria**:
- ✅ API calls complete in < 500ms (p95)
- ✅ Connection pool prevents exhaustion
- ✅ Retry logic handles transient failures
- ✅ Circuit breaker prevents cascade failures

### 1.3 Webhook Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Webhook Response Time (p95) | < 100ms | Time to validate/mutate |
| Webhook Response Time (p99) | < 200ms | 99th percentile |
| Timeout | 10 seconds | Kubernetes webhook timeout |
| Concurrent Requests | 100 requests/second | Sustained throughput |

**Acceptance Criteria**:
- ✅ Webhooks respond in < 100ms (p95)
- ✅ No webhook timeouts under load
- ✅ Handles 100 concurrent requests
- ✅ TLS handshake < 50ms

---

## 2. Scalability Requirements

### 2.1 Resource Scalability

| Resource | Target | Notes |
|----------|--------|-------|
| FlagsmithInstances | 100+ per cluster | Each with full stack |
| FlagsmithProjects | 1,000+ | Across all instances |
| FlagsmithEnvironments | 5,000+ | ~5 per project average |
| FlagsmithFeatureFlags | 10,000+ | ~10 per environment average |
| FlagsmithSegments | 2,000+ | ~2 per project average |
| FlagsmithApprovals | 500+ concurrent | Active approval requests |

**Acceptance Criteria**:
- ✅ Operator handles 10,000+ total resources
- ✅ No performance degradation at scale
- ✅ Memory usage scales linearly
- ✅ Watch efficiency maintained

### 2.2 Horizontal Scalability

| Component | Scaling Strategy | Target |
|-----------|------------------|--------|
| Operator Manager | Leader election | 2-3 replicas for HA |
| Webhook Server | Load balanced | 2-3 replicas |
| Flagsmith API | HPA | 3-10 replicas per instance |
| Flagsmith Frontend | HPA | 2-5 replicas per instance |

**Acceptance Criteria**:
- ✅ Leader election works correctly
- ✅ Failover < 30 seconds
- ✅ No split-brain scenarios
- ✅ Webhook load balancing works

### 2.3 Data Scalability

| Metric | Target | Notes |
|--------|--------|-------|
| Database Size | 100GB+ per instance | PostgreSQL storage |
| Events per Day | 100,000+ | Kubernetes events |
| Metrics Cardinality | 10,000+ series | Prometheus metrics |
| Log Volume | 10GB+ per day | Structured logs |

**Acceptance Criteria**:
- ✅ Database handles 100GB+ data
- ✅ Event processing keeps up
- ✅ Metrics don't overwhelm Prometheus
- ✅ Log aggregation works at scale

---

## 3. Reliability Requirements

### 3.1 Availability

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | 99.9% | Monthly uptime |
| MTBF | > 720 hours | Mean time between failures |
| MTTR | < 15 minutes | Mean time to recovery |
| RTO | < 5 minutes | Recovery time objective |
| RPO | < 1 minute | Recovery point objective |

**Acceptance Criteria**:
- ✅ 99.9% uptime (< 43 minutes downtime/month)
- ✅ Automatic recovery from failures
- ✅ No data loss on failure
- ✅ Health checks detect issues quickly

### 3.2 Fault Tolerance

**Requirements**:
- Operator survives pod restarts
- Operator survives node failures
- Operator survives API server outages (temporary)
- Operator survives Flagsmith API outages
- Graceful degradation under load

**Strategies**:
- Leader election for HA
- Finalizers for cleanup
- Retry with exponential backoff
- Circuit breakers for external calls
- Work queue persistence

**Acceptance Criteria**:
- ✅ Pod restart causes < 30s disruption
- ✅ Node failure causes < 60s disruption
- ✅ API server outage handled gracefully
- ✅ Flagsmith API outage doesn't crash operator
- ✅ No resource leaks on failure

### 3.3 Data Consistency

**Requirements**:
- Eventual consistency between Kubernetes and Flagsmith
- No orphaned resources
- No duplicate resources
- Idempotent operations
- Conflict resolution

**Strategies**:
- Status subresource for optimistic locking
- Generation tracking
- Finalizers for cleanup
- Owner references for garbage collection
- Reconciliation on conflict

**Acceptance Criteria**:
- ✅ Resources eventually consistent
- ✅ No orphans after deletion
- ✅ Conflicts resolved automatically
- ✅ Operations are idempotent
- ✅ Status always reflects reality

---

## 4. Security Requirements

### 4.1 Authentication & Authorization

**Requirements**:
- Kubernetes RBAC enforcement
- Service account authentication
- API token management
- User identity propagation
- Audit logging

**Implementation**:
- Operator uses dedicated ServiceAccount
- User RBAC enforced via Kubernetes
- API tokens stored in Secrets
- User identity in admission webhooks
- All privileged operations logged

**Acceptance Criteria**:
- ✅ RBAC prevents unauthorized access
- ✅ Service account has minimal permissions
- ✅ API tokens never logged
- ✅ User identity tracked in audit logs
- ✅ No privilege escalation possible

### 4.2 Data Protection

**Requirements**:
- Secrets encrypted at rest
- TLS for all communications
- Sensitive data masked in logs
- Secure secret rotation
- No secrets in status

**Implementation**:
- Kubernetes Secret encryption
- TLS 1.3 for webhooks
- Redaction in logging
- Secret rotation support
- Status sanitization

**Acceptance Criteria**:
- ✅ Secrets encrypted at rest
- ✅ All traffic uses TLS
- ✅ No secrets in logs
- ✅ Secret rotation works
- ✅ Status doesn't leak secrets

### 4.3 Network Security

**Requirements**:
- Network policies for isolation
- Ingress/egress controls
- Service mesh integration (optional)
- DDoS protection
- Rate limiting

**Implementation**:
- NetworkPolicy resources
- Namespace isolation
- Istio/Linkerd compatible
- Webhook rate limiting
- API client rate limiting

**Acceptance Criteria**:
- ✅ Network policies enforced
- ✅ Cross-tenant traffic blocked
- ✅ Rate limiting prevents abuse
- ✅ DDoS doesn't crash operator
- ✅ Service mesh works (if used)

### 4.4 Vulnerability Management

**Requirements**:
- Regular security scanning
- Dependency updates
- CVE monitoring
- Security advisories
- Incident response

**Implementation**:
- Trivy scanning in CI/CD
- Dependabot for updates
- GitHub Security Advisories
- Security policy documented
- Incident runbooks

**Acceptance Criteria**:
- ✅ No critical CVEs in production
- ✅ Dependencies updated monthly
- ✅ Security scans in CI/CD
- ✅ Vulnerabilities patched < 7 days
- ✅ Incident response tested

---

## 5. Observability Requirements

### 5.1 Metrics

**Required Metrics**:
- Reconciliation duration and errors
- API call duration and errors
- Resource counts by type
- Queue depth and latency
- Webhook performance
- Approval workflow metrics

**Prometheus Integration**:
- Metrics endpoint on :8080/metrics
- ServiceMonitor for auto-discovery
- Grafana dashboards provided
- Alert rules provided

**Acceptance Criteria**:
- ✅ All key metrics exposed
- ✅ Prometheus scrapes successfully
- ✅ Dashboards show operator health
- ✅ Alerts fire on issues
- ✅ Metrics retention 30+ days

### 5.2 Logging

**Requirements**:
- Structured JSON logging
- Log levels (ERROR, WARN, INFO, DEBUG)
- Request ID correlation
- Sensitive data redaction
- Log aggregation ready

**Implementation**:
- logr + zap for structured logs
- Context-based log levels
- Request ID in all logs
- Automatic redaction
- Loki/ELK compatible

**Acceptance Criteria**:
- ✅ All logs are structured JSON
- ✅ Log levels configurable
- ✅ Request IDs correlate logs
- ✅ No secrets in logs
- ✅ Log aggregation works

### 5.3 Tracing

**Requirements**:
- Distributed tracing
- Trace propagation
- Span attributes
- Sampling strategy
- Trace retention

**Implementation**:
- OpenTelemetry SDK
- W3C Trace Context
- Semantic conventions
- Adaptive sampling
- Jaeger/Tempo export

**Acceptance Criteria**:
- ✅ Traces show full request flow
- ✅ Trace context propagated
- ✅ Spans have useful attributes
- ✅ Sampling doesn't lose critical traces
- ✅ Traces exported successfully

### 5.4 Health Checks

**Requirements**:
- Liveness probe
- Readiness probe
- Startup probe
- Health endpoint
- Dependency checks

**Implementation**:
- /healthz endpoint
- /readyz endpoint
- Leader election check
- API server connectivity check
- Webhook server check

**Acceptance Criteria**:
- ✅ Liveness probe detects crashes
- ✅ Readiness probe detects unready state
- ✅ Startup probe allows slow starts
- ✅ Health checks don't impact performance
- ✅ Failed health checks trigger restart

---

## 6. Maintainability Requirements

### 6.1 Code Quality

**Requirements**:
- 80%+ unit test coverage
- Linting with golangci-lint
- Code formatting with gofmt
- Documentation with godoc
- Code review process

**Acceptance Criteria**:
- ✅ Test coverage ≥ 80%
- ✅ All linters pass
- ✅ Code formatted consistently
- ✅ All public APIs documented
- ✅ PRs require approval

### 6.2 Documentation

**Requirements**:
- Architecture documentation
- API reference
- Operator guide
- Troubleshooting guide
- Runbooks

**Deliverables**:
- docs/architecture.md
- docs/api-reference.md
- docs/operator-guide.md
- docs/troubleshooting.md
- docs/runbooks/

**Acceptance Criteria**:
- ✅ Architecture documented
- ✅ All CRDs documented
- ✅ Common tasks documented
- ✅ Troubleshooting guide complete
- ✅ Runbooks for incidents

### 6.3 Upgradability

**Requirements**:
- Zero-downtime upgrades
- Backward compatibility
- Migration guides
- Rollback support
- Version compatibility matrix

**Implementation**:
- Rolling updates
- API versioning (v1alpha1, v1beta1, v1)
- Conversion webhooks
- Database migrations
- Compatibility testing

**Acceptance Criteria**:
- ✅ Upgrades cause no downtime
- ✅ Old clients work with new operator
- ✅ Migration guides provided
- ✅ Rollback tested
- ✅ Compatibility documented

---

## 7. Compliance Requirements

### 7.1 Standards Compliance

**Requirements**:
- Kubernetes API conventions
- Operator best practices
- OLM compatibility
- OperatorHub requirements
- Cloud Native standards

**Acceptance Criteria**:
- ✅ Follows Kubernetes API conventions
- ✅ Passes operator-sdk scorecard
- ✅ OLM bundle validates
- ✅ OperatorHub submission ready
- ✅ CNCF landscape compatible

### 7.2 Regulatory Compliance

**Requirements**:
- SOC 2 Type II ready
- GDPR compliant
- HIPAA ready (with config)
- Audit logging
- Data retention policies

**Implementation**:
- Audit logs for all operations
- Data encryption at rest/transit
- User consent tracking
- Data deletion support
- Retention configuration

**Acceptance Criteria**:
- ✅ Audit logs complete
- ✅ Data encrypted
- ✅ GDPR rights supported
- ✅ HIPAA controls available
- ✅ Compliance documented

---

## 8. Deployment Requirements

### 8.1 Installation Methods

**Supported Methods**:
- Helm chart
- OLM bundle
- kubectl apply (manifests)
- Kustomize

**Requirements**:
- Single command installation
- Configuration via values
- Namespace isolation
- Resource quotas
- Network policies

**Acceptance Criteria**:
- ✅ Helm install works
- ✅ OLM install works
- ✅ kubectl install works
- ✅ Kustomize install works
- ✅ All methods tested

### 8.2 Configuration Management

**Requirements**:
- Environment-specific configs
- Secret management
- ConfigMap support
- Validation on startup
- Hot reload (where possible)

**Implementation**:
- Helm values
- Kubernetes Secrets
- ConfigMaps
- Admission webhooks
- Watch for config changes

**Acceptance Criteria**:
- ✅ Configs validated on startup
- ✅ Secrets managed securely
- ✅ ConfigMaps work
- ✅ Invalid configs rejected
- ✅ Some configs hot-reload

### 8.3 Multi-Environment Support

**Environments**:
- Development
- Staging
- Production
- Disaster Recovery

**Requirements**:
- Environment-specific configs
- Resource sizing per env
- Monitoring per env
- Backup/restore per env

**Acceptance Criteria**:
- ✅ Dev environment works
- ✅ Staging mirrors production
- ✅ Production hardened
- ✅ DR tested regularly
- ✅ Environment parity maintained

---

## 9. Testing Requirements

### 9.1 Unit Testing

**Requirements**:
- 80%+ code coverage
- Fast execution (< 5 minutes)
- Isolated tests
- Mocked dependencies
- Table-driven tests

**Framework**: Ginkgo + Gomega

**Acceptance Criteria**:
- ✅ Coverage ≥ 80%
- ✅ All tests pass
- ✅ Tests run in < 5 minutes
- ✅ No flaky tests
- ✅ Tests run in CI/CD

### 9.2 Integration Testing

**Requirements**:
- Test with real Kubernetes API
- Test with envtest
- Test CRD lifecycle
- Test controller reconciliation
- Test webhooks

**Framework**: Ginkgo + envtest

**Acceptance Criteria**:
- ✅ All integration tests pass
- ✅ CRD lifecycle tested
- ✅ Controllers tested
- ✅ Webhooks tested
- ✅ Tests run in CI/CD

### 9.3 End-to-End Testing

**Requirements**:
- Test with real cluster
- Test complete workflows
- Test multi-tenant scenarios
- Test failure scenarios
- Test upgrade scenarios

**Framework**: Ginkgo + kind/k3s

**Acceptance Criteria**:
- ✅ All E2E tests pass
- ✅ Complete workflows tested
- ✅ Multi-tenant tested
- ✅ Failures handled
- ✅ Upgrades tested

### 9.4 Performance Testing

**Requirements**:
- Load testing
- Stress testing
- Soak testing
- Benchmark testing

**Framework**: k6

**Acceptance Criteria**:
- ✅ Meets performance targets
- ✅ No memory leaks
- ✅ Scales linearly
- ✅ Benchmarks documented
- ✅ Performance regression tests

### 9.5 Chaos Testing

**Requirements**:
- Pod failures
- Node failures
- Network partitions
- API server outages
- Resource exhaustion

**Framework**: Chaos Mesh

**Acceptance Criteria**:
- ✅ Survives pod failures
- ✅ Survives node failures
- ✅ Handles network issues
- ✅ Recovers from outages
- ✅ Graceful degradation

---

## 10. Operational Requirements

### 10.1 Monitoring

**Requirements**:
- Real-time dashboards
- Historical metrics
- Alerting rules
- SLO tracking
- Capacity planning

**Implementation**:
- Grafana dashboards
- Prometheus metrics
- AlertManager rules
- SLI/SLO definitions
- Resource usage trends

**Acceptance Criteria**:
- ✅ Dashboards show health
- ✅ Metrics retained 30+ days
- ✅ Alerts fire correctly
- ✅ SLOs tracked
- ✅ Capacity trends visible

### 10.2 Troubleshooting

**Requirements**:
- Clear error messages
- Detailed status conditions
- Kubernetes events
- Debug logging
- Troubleshooting guide

**Implementation**:
- Structured error messages
- Status conditions with reasons
- Event recording
- Debug log level
- docs/troubleshooting.md

**Acceptance Criteria**:
- ✅ Errors are actionable
- ✅ Status shows root cause
- ✅ Events provide context
- ✅ Debug logs help diagnose
- ✅ Guide covers common issues

### 10.3 Backup & Recovery

**Requirements**:
- Automated backups
- Point-in-time recovery
- Disaster recovery
- Backup validation
- Restore testing

**Implementation**:
- Database backups (PostgreSQL)
- CRD export/import
- Velero integration
- Backup verification
- Regular DR drills

**Acceptance Criteria**:
- ✅ Backups run automatically
- ✅ PITR works
- ✅ DR tested quarterly
- ✅ Backups validated
- ✅ Restore < 15 minutes

---

## Summary

**Total NFRs**: 100+  
**Categories**: Performance, Scalability, Reliability, Security, Observability, Maintainability, Compliance, Deployment, Testing, Operations

**Key Targets**:
- 99.9% uptime
- < 5s reconciliation latency (p95)
- 80%+ test coverage
- Zero-downtime upgrades
- 10,000+ resources supported

**Status**: ✅ Complete  
**Next**: Principal Developers to implement
