# Principal Developer Agents - Flagsmith Kubernetes Operator

## Role
Implement the Flagsmith Kubernetes operator following functional and non-functional requirements with 80%+ test coverage.

## Team Structure

### Developer Stream Allocation
*To be defined by Architect Agent based on work breakdown*

Potential parallel streams:
1. **CRD & API Developer** - Custom Resource Definitions and API types
2. **Controller Developer** - Reconciliation logic and controllers
3. **Integration Developer** - Flagsmith API client and integration
4. **Infrastructure Developer** - Deployment, CI/CD, and tooling
5. **Testing Developer** - Test infrastructure and E2E tests

## Development Standards

### Code Quality
- [ ] Follow Go best practices and idioms
- [ ] Implement comprehensive error handling
- [ ] Use structured logging
- [ ] Apply SOLID principles
- [ ] Maintain clean code standards

### Testing Requirements
- [ ] **80%+ unit test coverage** (MANDATORY)
- [ ] Integration tests for all components
- [ ] Table-driven tests where applicable
- [ ] Mock external dependencies
- [ ] Test edge cases and error paths

### Documentation
- [ ] GoDoc comments for all public APIs
- [ ] README for each package
- [ ] Code examples and usage guides
- [ ] Architecture decision records (ADRs)

## Development Workflow

### 1. Setup Phase
- [ ] Initialize Go module
- [ ] Set up operator-sdk/kubebuilder project
- [ ] Configure development environment
- [ ] Set up testing framework
- [ ] Configure linters and formatters

### 2. Implementation Phase
- [ ] Implement CRDs and API types
- [ ] Build controller reconciliation logic
- [ ] Develop Flagsmith API client
- [ ] Implement webhook handlers
- [ ] Create status reporting
- [ ] Build configuration management

### 3. Testing Phase
- [ ] Write unit tests (80%+ coverage)
- [ ] Implement integration tests
- [ ] Create E2E test scenarios
- [ ] Perform load testing
- [ ] Execute chaos tests

### 4. Integration Phase
- [ ] Integrate all components
- [ ] Resolve dependencies
- [ ] Perform system testing
- [ ] Fix integration issues

## Deliverables

### Code Artifacts
- `src/` - Complete operator source code
- `config/` - Kubernetes manifests and CRDs
- `tests/` - Comprehensive test suites
- `deploy/` - Deployment artifacts

### Documentation
- `DEVELOPMENT.md` - Development guide
- `API_REFERENCE.md` - API documentation
- `TESTING.md` - Testing guide
- `CONTRIBUTING.md` - Contribution guidelines

### Quality Metrics
- Test coverage reports (>80%)
- Linter results (zero issues)
- Security scan results
- Performance benchmarks

## Inputs Required

- Functional requirements from Product Manager
- Non-functional requirements from Architect
- Architecture design from Architect
- Technology stack decisions from Architect
- Work breakdown from Architect

## Dependencies

- ✅ Research Agent completion
- ⏳ Product Manager completion
- ⏳ Architect completion
- ⏳ Awaiting work breakdown and assignments

## Tools & Technologies

*To be defined by Architect*

Expected stack:
- Go 1.21+
- Operator SDK / Kubebuilder
- Kubernetes client-go
- Testing: Ginkgo, Gomega, Testify
- CI/CD: GitHub Actions / GitLab CI
- Quality: golangci-lint, gosec

## Next Steps

1. Wait for architecture and work breakdown
2. Set up development environment
3. Begin parallel implementation streams
4. Maintain 80%+ test coverage throughout
5. Hand off to QA agent for validation

## Status
🔴 **Blocked** - Waiting for Architect deliverables and work assignments
