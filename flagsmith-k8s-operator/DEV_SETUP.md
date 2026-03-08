# Development Environment Setup

**Date**: 2026-02-13  
**Status**: 🟢 In Progress

---

## Prerequisites

### Required Tools

- [x] Go 1.21+
- [x] Docker Desktop
- [x] kubectl
- [x] kind (Kubernetes in Docker)
- [ ] Operator SDK 1.33+
- [ ] Helm 3.x
- [ ] golangci-lint
- [ ] gosec

### Installation Commands

```bash
# Install Operator SDK
brew install operator-sdk

# Install Helm
brew install helm

# Install kind
brew install kind

# Install linters
brew install golangci-lint
go install github.com/securego/gosec/v2/cmd/gosec@latest

# Install k6 for performance testing
brew install k6

# Install Trivy for security scanning
brew install trivy
```

---

## Repository Setup

### Step 1: Clone CloudNativePG (Base)

```bash
cd /Users/polfenollarvilla/Documents/FREIGHTOS\ MARKETPLACE\ 2/flagsmith-k8s-operator
git clone https://github.com/cloudnative-pg/cloudnative-pg.git flagsmith-operator-base
cd flagsmith-operator-base
```

### Step 2: Create New Repository

```bash
# Remove original git history
rm -rf .git

# Initialize new repository
git init
git add .
git commit -m "Initial commit: Fork from CloudNativePG (Apache 2.0)"

# Create GitHub repository (if needed)
# gh repo create flagsmith-operator --private
```

### Step 3: Update License and Attribution

Create `NOTICE` file:
```
Flagsmith Kubernetes Operator
Copyright 2026 [Your Company Name]

This product includes software developed by CloudNativePG
(https://cloudnative-pg.io/)
Licensed under Apache License 2.0

Original Copyright 2021-2024 The CloudNativePG Contributors

Modifications:
- Adapted for Flagsmith feature flag platform
- Replaced PostgreSQL management with Flagsmith deployment
- Added custom controllers for projects, environments, feature flags, segments
- Integrated Flagsmith Management API
- Added approval workflow and governance features
```

### Step 4: Rename Module

Update `go.mod`:
```go
module github.com/[your-org]/flagsmith-operator

go 1.21

// Keep existing dependencies, add new ones
require (
    // ... existing CloudNativePG dependencies ...
    helm.sh/helm/v3 v3.13.0
    // Flagsmith-specific dependencies will be added
)
```

---

## Development Cluster Setup

### Create kind Cluster

```bash
# Create cluster config
cat > kind-config.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker
EOF

# Create cluster
kind create cluster --name flagsmith-dev --config kind-config.yaml

# Verify
kubectl cluster-info --context kind-flagsmith-dev
```

### Install Prerequisites in Cluster

```bash
# Install cert-manager (for webhooks)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Install Kyverno (policy engine)
kubectl create -f https://github.com/kyverno/kyverno/releases/download/v1.11.0/install.yaml

# Install Prometheus (metrics)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Verify installations
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=cert-manager -n cert-manager --timeout=300s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=kyverno -n kyverno --timeout=300s
```

---

## CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/ci.yaml`:
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.21'
      - name: golangci-lint
        uses: golangci/golangci-lint-action@v3
        with:
          version: latest

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.21'
      - name: Run Gosec
        run: |
          go install github.com/securego/gosec/v2/cmd/gosec@latest
          gosec ./...
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.21'
      - name: Unit Tests
        run: make test
      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.21'
      - name: Setup kind
        uses: helm/kind-action@v1
      - name: Integration Tests
        run: make test-integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.21'
      - name: Setup kind
        uses: helm/kind-action@v1
      - name: E2E Tests
        run: make test-e2e
```

---

## Development Workflow

### Daily Development

```bash
# 1. Start development cluster
kind create cluster --name flagsmith-dev

# 2. Install operator (local)
make install  # Install CRDs
make run      # Run operator locally

# 3. Test changes
make test                 # Unit tests
make test-integration     # Integration tests

# 4. Build and deploy
make docker-build IMG=flagsmith-operator:dev
kind load docker-image flagsmith-operator:dev --name flagsmith-dev
make deploy IMG=flagsmith-operator:dev

# 5. Test in cluster
kubectl apply -f config/samples/flagsmith_v1alpha1_flagsmithinstance.yaml
kubectl get flagsmithinstance -w
```

### Code Generation

```bash
# Generate CRD manifests
make manifests

# Generate Go code (DeepCopy, etc.)
make generate

# Generate API documentation
make api-docs
```

---

## AI Development Tools

### Cursor IDE Setup

```bash
# Install Cursor
brew install --cask cursor

# Open project
cursor /Users/polfenollarvilla/Documents/FREIGHTOS\ MARKETPLACE\ 2/flagsmith-k8s-operator/flagsmith-operator-base
```

**Cursor Settings** (`.cursor/settings.json`):
```json
{
  "cursor.aiModel": "claude-3.5-sonnet",
  "cursor.enableAutoComplete": true,
  "cursor.enableChat": true,
  "go.useLanguageServer": true,
  "go.lintTool": "golangci-lint"
}
```

### GitHub Copilot

```bash
# Already installed in Cursor
# Configure for Go development
```

---

## Monitoring Development Progress

### Token Usage Tracking

Create `scripts/track-tokens.sh`:
```bash
#!/bin/bash
# Track AI token usage
echo "$(date): $1 tokens used for $2" >> .token-usage.log
```

### Progress Dashboard

Use blackboard to track:
- `blackboard/agents/developers/status.json` - Current status
- `blackboard/agents/developers/output.json` - Deliverables
- `blackboard/state.json` - Overall progress

---

## Next Steps

1. ✅ Clone CloudNativePG repository
2. [ ] Setup development environment
3. [ ] Create NOTICE file
4. [ ] Update go.mod
5. [ ] Remove PostgreSQL-specific code
6. [ ] Define first CRD (FlagsmithInstance)
7. [ ] Generate CRD code
8. [ ] Create basic controller

---

**Status**: 🟢 Setup in Progress  
**Next**: Install development tools
