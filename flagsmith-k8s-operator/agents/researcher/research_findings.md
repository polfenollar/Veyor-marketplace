# Research Findings: Flagsmith Kubernetes Operator

**Research Agent Deliverable**  
**Date**: 2026-02-13  
**Status**: ✅ Complete

## Executive Summary

This document compiles comprehensive research findings for building a production-grade Kubernetes operator for Flagsmith. The research covered Flagsmith platform architecture, Kubernetes operator patterns, technology stack options, and production-grade best practices.

### Key Findings

1. **No Open-Source Flagsmith Operator Exists**: Flagsmith has an Enterprise Edition operator, but no publicly available open-source operator
2. **Helm Charts Available**: Flagsmith provides official Helm charts for Kubernetes deployment
3. **Dual API Architecture**: Flagsmith has two distinct APIs (Flags API and Admin API) with different authentication methods
4. **Operator SDK Recommended**: Operator SDK provides better integration with OLM and OperatorHub compared to Kubebuilder alone
5. **Go is Standard**: Go is the industry standard for production-grade Kubernetes operators

---

## 1. Flagsmith Platform Analysis

### 1.1 Platform Architecture

Flagsmith is a feature flag and remote configuration management platform with the following components:

**Core Components**:
- **API Server**: REST API serving feature flags and configuration
- **Frontend Dashboard**: Web UI for managing flags and configurations
- **Database**: PostgreSQL for data persistence
- **Cache Layer**: Optional Redis for performance optimization
- **Edge Proxy**: Optional component for low-latency flag evaluation

**Deployment Models**:
- **SaaS**: Hosted by Flagsmith (flagsmith.com)
- **Self-Hosted**: Docker, Kubernetes, cloud platforms
- **Hybrid**: Edge proxy with SaaS backend

### 1.2 API Architecture

Flagsmith exposes two distinct APIs:

#### Flags API (Public SDK API)
- **Purpose**: Serving feature flags to applications
- **Authentication**: Environment Key (non-secret, can be public)
- **Header**: `X-Environment-Key: <environment_key>`
- **Use Case**: Client and server-side SDKs fetching flags
- **Security**: Designed to be publicly accessible

#### Admin API (Private Admin API)
- **Purpose**: Programmatic management of Flagsmith resources
- **Authentication**: Organisation API Token (secret)
- **Header**: `Authorization: Api-Key <api_token>`
- **Use Case**: Creating/updating projects, environments, flags, segments
- **Security**: Must be kept secret, never exposed client-side

**Implication for Operator**: The operator will primarily use the Admin API for managing Flagsmith resources.

### 1.3 Kubernetes Deployment

**Current Options**:
- **Helm Charts**: Official charts available at `github.com/Flagsmith/flagsmith-charts`
- **Docker Compose**: For local development
- **Manual Kubernetes Manifests**: For custom deployments
- **Enterprise Operator**: Proprietary, not open-source

**Deployment Considerations**:
- PostgreSQL database required
- Redis optional but recommended for production
- Environment variables for configuration
- Secrets management for API keys and database credentials

---

## 2. Kubernetes Operator Patterns

### 2.1 Operator Pattern Overview

**Definition**: Operators are software extensions to Kubernetes that use custom resources to manage applications and their components, encoding operational knowledge into automation.

**Core Concepts**:
- **Custom Resource Definitions (CRDs)**: Extend Kubernetes API with custom resource types
- **Controllers**: Reconciliation loops that watch CRDs and maintain desired state
- **Reconciliation**: Continuous process of making actual state match desired state
- **Level-Based Logic**: Controllers react to current state, not individual events

### 2.2 Operator Capabilities

An operator can automate:
- Application deployment on demand
- Backup and restore operations
- Upgrades and rollbacks
- Self-healing and failure recovery
- Configuration management
- Scaling operations

### 2.3 Production-Grade Operator Requirements

#### Core Design Principles
1. **Idempotency**: Reconciliation must be safe to run multiple times
2. **Level-Based Reconciliation**: React to current state, not events
3. **Single Responsibility**: Focus on one application/service
4. **Asynchronous Operations**: Don't block on long-running tasks
5. **Error Handling**: Visible, patient error handling with backoff

#### Implementation Best Practices
- **Leader Election**: For high-availability deployments
- **Finalizers**: For cleanup before resource deletion
- **Status Subresources**: Prevent reconciliation loops
- **Validation**: Pre-reconciliation validation (OpenAPI + webhooks)
- **Event Emission**: Kubernetes Events for visibility
- **Metrics**: Prometheus metrics for observability
- **Efficient Watching**: Use predicates to filter events

#### Testing Requirements
- **Unit Tests**: 80%+ coverage (as specified)
- **Integration Tests**: Test with real Kubernetes API
- **E2E Tests**: Full operator lifecycle testing
- **Chaos Tests**: Resilience under failure conditions

---

## 3. Technology Stack Research

### 3.1 Framework Comparison: Operator SDK vs Kubebuilder

#### Operator SDK
**Pros**:
- Built on top of Kubebuilder
- Integrated with Operator Lifecycle Manager (OLM)
- OperatorHub integration out-of-the-box
- Operator Scorecard for best practices validation
- Multi-language support (Go, Ansible, Helm)
- Better for operators intended for distribution

**Cons**:
- More opinionated
- Additional complexity if OLM features not needed

#### Kubebuilder
**Pros**:
- Lightweight and focused
- Better code management control
- Built-in integration testing scaffolding
- Part of kubernetes-sigs (official SIG)
- Simpler for Go-only operators

**Cons**:
- Manual OLM integration required
- No built-in scorecard
- Go-only (no Ansible/Helm support)

**Recommendation**: **Operator SDK** for this project due to:
- OLM integration for production deployments
- Scorecard for quality validation
- Better ecosystem integration
- Production-grade tooling out-of-the-box

### 3.2 Programming Language

**Recommendation**: **Go 1.21+**

**Rationale**:
- Industry standard for Kubernetes operators
- Native Kubernetes client libraries
- Strong concurrency support
- Excellent tooling ecosystem
- Type safety and performance
- All reference operators use Go

### 3.3 Testing Frameworks

#### Unit Testing
- **Testify**: Assertion library
- **Gomega**: Matcher library (BDD-style)
- **Go Mock**: Mocking framework

#### Integration/E2E Testing
- **Ginkgo**: BDD testing framework
- **envtest**: Kubernetes API server for testing
- **controller-runtime/pkg/envtest**: Test environment setup

#### Performance/Load Testing
- **k6**: Modern load testing tool
- **vegeta**: HTTP load testing
- **Apache Bench**: Simple HTTP benchmarking

#### Chaos Engineering
- **Chaos Mesh**: Kubernetes-native chaos engineering
- **Litmus**: Cloud-native chaos engineering framework

### 3.4 Observability Stack

#### Metrics
- **Prometheus**: Metrics collection and storage
- **controller-runtime/pkg/metrics**: Built-in metrics support
- **Custom Metrics**: Operator-specific metrics

#### Logging
- **logr**: Structured logging interface
- **zap**: Fast, structured logging (recommended)
- **klog**: Kubernetes logging (legacy)

#### Tracing
- **OpenTelemetry**: Distributed tracing
- **Jaeger**: Trace visualization

### 3.5 CI/CD Tools

**Recommended Stack**:
- **GitHub Actions**: CI/CD pipeline
- **golangci-lint**: Comprehensive Go linter
- **gosec**: Security scanner
- **Trivy**: Container vulnerability scanner
- **Snyk**: Dependency vulnerability scanning
- **Codecov**: Code coverage reporting

### 3.6 Build and Packaging

- **Docker**: Container images
- **Kustomize**: Kubernetes manifest management
- **Helm**: Package management (optional)
- **OLM Bundle**: Operator Lifecycle Manager packaging

---

## 4. Reference Implementations

### 4.1 Flagsmith Existing Solutions

#### Flagsmith Helm Charts
- **Repository**: `github.com/Flagsmith/flagsmith-charts`
- **Purpose**: Deploy Flagsmith on Kubernetes
- **Components**: API, Frontend, PostgreSQL, Redis
- **Limitations**: Not an operator, manual configuration required

#### Flagsmith Enterprise Operator
- **Availability**: Proprietary, Enterprise Edition only
- **Features**: Unknown (not publicly documented)
- **Source Code**: Not available
- **Container Image**: `flagsmith/flagsmith-operator:v1.0.0` (on OperatorHub)

**Implication**: We need to build from scratch, no open-source reference available.

### 4.2 Similar Operators for Reference

**Feature Flag Operators**:
- Limited examples in the wild
- Most organizations use Helm charts or manual deployments

**Database Operators** (similar complexity):
- **CloudNativePG**: PostgreSQL operator (excellent reference)
- **Percona Operator**: MySQL/PostgreSQL operator
- **CrunchyData Postgres Operator**: Production-grade example

**Configuration Management Operators**:
- **External Secrets Operator**: Syncs secrets from external sources
- **Reloader**: Reloads apps on ConfigMap/Secret changes

**Recommended Study**:
1. CloudNativePG - for database management patterns
2. External Secrets Operator - for external API integration
3. Prometheus Operator - for production-grade patterns

---

## 5. Integration Requirements

### 5.1 Flagsmith API Integration

**Required Capabilities**:
- Create/update/delete projects
- Manage environments
- Create and configure feature flags
- Manage segments and targeting rules
- Handle API authentication (Organisation API Token)
- Error handling and retry logic
- Rate limiting awareness

**API Client Requirements**:
- HTTP client with retry logic
- Token-based authentication
- JSON serialization/deserialization
- Error mapping to Kubernetes events
- Logging and tracing integration

### 5.2 Kubernetes Integration

**Required Kubernetes Resources**:
- **CRDs**: Define Flagsmith resources (Project, Environment, Flag)
- **Controllers**: Reconcile CRDs with Flagsmith API
- **Secrets**: Store API tokens and credentials
- **ConfigMaps**: Store configuration data
- **Events**: Emit Kubernetes events for visibility
- **Status**: Update CRD status with current state

**RBAC Requirements**:
- Read/write CRDs
- Read Secrets (for API tokens)
- Create Events
- Update Status subresources

### 5.3 Multi-Tenancy Considerations

**Namespace Isolation**:
- Support multiple Flagsmith instances per cluster
- Namespace-scoped vs cluster-scoped resources
- Resource naming conventions to avoid conflicts

**Security**:
- Secret isolation per namespace
- RBAC policies for least privilege
- Network policies for API communication

---

## 6. Production-Grade Requirements

### 6.1 Reliability

- **High Availability**: Multiple controller replicas with leader election
- **Graceful Degradation**: Handle Flagsmith API unavailability
- **Retry Logic**: Exponential backoff for failed operations
- **Circuit Breaker**: Prevent cascading failures
- **Health Checks**: Liveness and readiness probes

### 6.2 Performance

- **Efficient Reconciliation**: Minimize API calls
- **Caching**: Cache Flagsmith API responses
- **Rate Limiting**: Respect API rate limits
- **Resource Limits**: CPU and memory constraints
- **Horizontal Scaling**: Support multiple controller replicas

### 6.3 Security

- **Secret Management**: Kubernetes Secrets for API tokens
- **RBAC**: Minimal required permissions
- **Network Policies**: Restrict egress to Flagsmith API
- **Image Scanning**: Regular vulnerability scans
- **Supply Chain Security**: Signed images, SBOM

### 6.4 Observability

- **Metrics**: Prometheus metrics for all operations
- **Logging**: Structured logging with correlation IDs
- **Tracing**: Distributed tracing for debugging
- **Alerting**: Prometheus alerts for failures
- **Dashboards**: Grafana dashboards for visualization

### 6.5 Operational Excellence

- **Documentation**: Comprehensive user and developer docs
- **Runbooks**: Operational procedures for common issues
- **Upgrade Path**: Safe upgrade procedures
- **Rollback**: Ability to rollback failed upgrades
- **Disaster Recovery**: Backup and restore procedures

---

## 7. Recommended Architecture

### 7.1 Custom Resource Definitions (CRDs)

**Proposed CRDs**:

1. **FlagsmithProject**
   - Represents a Flagsmith project
   - Spec: project name, organization ID, description
   - Status: project ID, state, conditions

2. **FlagsmithEnvironment**
   - Represents a Flagsmith environment
   - Spec: environment name, project reference, API key storage
   - Status: environment ID, API key secret, state

3. **FlagsmithFeatureFlag**
   - Represents a feature flag
   - Spec: flag name, environment reference, default value, type
   - Status: flag ID, state, current value

4. **FlagsmithSegment** (optional, future)
   - Represents user segments for targeting
   - Spec: segment rules, environment reference
   - Status: segment ID, state

### 7.2 Controller Architecture

**Controllers**:
1. **Project Controller**: Manages Flagsmith projects
2. **Environment Controller**: Manages environments
3. **FeatureFlag Controller**: Manages feature flags
4. **Segment Controller**: Manages segments (future)

**Shared Components**:
- **Flagsmith API Client**: Reusable client library
- **Reconciler Base**: Common reconciliation logic
- **Event Emitter**: Kubernetes event generation
- **Metrics Collector**: Prometheus metrics

### 7.3 Deployment Architecture

**Operator Deployment**:
- Deployment with 2+ replicas
- Leader election for active controller
- Service for metrics endpoint
- ServiceMonitor for Prometheus scraping

**Dependencies**:
- Flagsmith API endpoint (SaaS or self-hosted)
- Kubernetes API server
- Optional: Prometheus for metrics

---

## 8. Risks and Mitigations

### 8.1 Identified Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Flagsmith API changes | High | Medium | Version API client, integration tests |
| API rate limiting | Medium | High | Implement caching, backoff, rate limiting |
| Network failures | High | Medium | Retry logic, circuit breaker, graceful degradation |
| Secret exposure | High | Low | Kubernetes Secrets, RBAC, audit logging |
| Performance at scale | Medium | Medium | Load testing, caching, efficient reconciliation |
| Kubernetes version compatibility | Medium | Medium | Test across K8s versions (1.24-1.30) |

### 8.2 Mitigation Strategies

- **Comprehensive Testing**: Unit, integration, E2E, chaos tests
- **Gradual Rollout**: Canary deployments, feature flags
- **Monitoring**: Extensive metrics and alerting
- **Documentation**: Clear upgrade and troubleshooting guides
- **Community Feedback**: Early beta testing with users

---

## 9. Next Steps for Product Manager

### 9.1 Required Inputs

The Product Manager should use this research to define:

1. **Scope**: Which CRDs to implement in v1.0
2. **Use Cases**: Primary user workflows to support
3. **API Contracts**: Detailed CRD specifications
4. **Acceptance Criteria**: Success metrics for each feature

### 9.2 Open Questions for User

1. **Flagsmith Instance**: Will operator manage Flagsmith installation or just configuration?
2. **Multi-Tenancy**: Single Flagsmith instance or multiple instances per cluster?
3. **Scope**: Full feature parity with Flagsmith UI or subset of features?
4. **Deployment**: OLM-based distribution or Helm chart?

### 9.3 Recommended Reading

- [Flagsmith Documentation](https://docs.flagsmith.com/)
- [Kubernetes Operator Pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [Operator SDK Documentation](https://sdk.operatorframework.io/)
- [Kubebuilder Book](https://book.kubebuilder.io/)
- [CloudNativePG Operator](https://github.com/cloudnative-pg/cloudnative-pg) (reference)

---

## 10. Deliverables Summary

✅ **Completed Research**:
- Flagsmith platform architecture
- Kubernetes operator patterns
- Technology stack evaluation
- Production-grade requirements
- Reference implementations analysis
- Integration requirements
- Risk assessment

✅ **Documentation Created**:
- This comprehensive research findings document
- Technology recommendations
- Architecture proposals
- Risk mitigation strategies

🔄 **Handoff to Product Manager**:
- All research findings documented
- Technology stack recommended
- Architecture patterns identified
- Ready for functional requirements definition

---

**Research Agent Status**: ✅ **COMPLETE**  
**Next Agent**: Product Manager Agent  
**Estimated PM Duration**: 1-2 days
