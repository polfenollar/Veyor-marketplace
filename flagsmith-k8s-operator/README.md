# Flagsmith Kubernetes Operator

A production-grade Kubernetes operator for managing Flagsmith feature flag deployments.

## Project Structure

```
flagsmith-k8s-operator/
├── agents/              # Multi-agent system definitions
│   ├── researcher/      # Research agent workspace
│   ├── product/         # Product manager agent workspace
│   ├── architect/       # Architect agent workspace
│   ├── developers/      # Principal developer agents workspace
│   └── qa/             # QA agent workspace
├── docs/               # Project documentation
├── src/                # Operator source code
├── config/             # Kubernetes configurations
├── tests/              # Test suites
└── deploy/             # Deployment artifacts
```

## Multi-Agent Development Workflow

This project uses a sophisticated multi-agent development approach:

1. **Researcher Agent** - Gathers requirements, documentation, and context
2. **Product Manager Agent** - Defines functional requirements and specifications
3. **Architect Agent** - Designs system architecture and non-functional requirements
4. **Principal Developer Agents** - Implement the operator with high test coverage
5. **QA Agent** - Validates quality through comprehensive testing

## Getting Started

See individual agent workspaces in the `agents/` directory for specific instructions.

## Requirements

- Kubernetes 1.24+
- Go 1.21+
- Operator SDK
- Flagsmith instance

## License

TBD
