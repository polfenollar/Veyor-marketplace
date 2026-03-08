# Multi-Agent Coordination Framework v2.0

**Version**: 2.0 (Blackboard Architecture)  
**Date**: 2026-02-13  
**Status**: Active

---

## System Overview

This framework defines a **blackboard-based multi-agent system** with strict agent isolation, JSON-based communication, and validation gates between all phase transitions.

### Key Principles

1. **Single Source of Truth**: Blackboard is the only shared state
2. **Agent Isolation**: Each agent only accesses their specific documentation
3. **JSON Communication**: All outputs in structured JSON format
4. **Validation Gates**: Validator agent checks all handoffs
5. **Coordination Control**: Coordination agent orchestrates workflow

---

## Agent Roster

### 1. Coordination Agent
**Role**: Workflow orchestration and blackboard management  
**Charter**: `agents/coordination/CHARTER.md`  
**Responsibilities**:
- Manage workflow state
- Trigger agent transitions
- Update blackboard
- Monitor progress
- Handle blockers

### 2. Validator Agent
**Role**: Consistency and quality validation  
**Charter**: `agents/validator/CHARTER.md`  
**Responsibilities**:
- Validate agent outputs
- Check traceability
- Enforce quality gates
- Block invalid handoffs
- Generate validation reports

### 3. Research Agent
**Role**: Technology and pattern research  
**Charter**: `agents/researcher/CHARTER.md`  
**Input Documentation**: `agents/researcher/docs/`  
**Output**: `blackboard/agents/researcher/output.json`  
**Responsibilities**:
- Research Flagsmith platform
- Research Kubernetes operators
- Recommend technology stack
- Document findings

### 4. Product Manager Agent
**Role**: Requirements definition  
**Charter**: `agents/product/CHARTER.md`  
**Input Documentation**: `agents/product/docs/` + Research outputs from blackboard  
**Output**: `blackboard/agents/product/output.json`  
**Responsibilities**:
- Define functional requirements
- Specify CRDs
- Create use cases
- Define acceptance criteria

### 5. Architect Agent
**Role**: System architecture design  
**Charter**: `agents/architect/CHARTER.md`  
**Input Documentation**: `agents/architect/docs/` + Requirements from blackboard  
**Output**: `blackboard/agents/architect/output.json`  
**Responsibilities**:
- Design system architecture
- Define NFRs
- Create work breakdown
- Select technologies

### 6. Principal Developers
**Role**: Implementation  
**Charter**: `agents/developers/CHARTER.md`  
**Input Documentation**: `agents/developers/docs/` + Architecture from blackboard  
**Output**: `blackboard/agents/developers/output.json`  
**Responsibilities**:
- Implement controllers
- Write tests (80%+ coverage)
- Build integrations
- Create documentation

### 7. QA Agent
**Role**: Quality assurance and testing  
**Charter**: `agents/qa/CHARTER.md`  
**Input Documentation**: `agents/qa/docs/` + Implementation from blackboard  
**Output**: `blackboard/agents/qa/output.json`  
**Responsibilities**:
- Execute test plans
- Performance testing
- Chaos testing
- Production readiness validation

---

## Workflow Phases

### Phase 1: Research
```
START
  ↓
Coordination Agent: Initialize blackboard
  ↓
Research Agent: Execute research
  ↓
Research Agent: Publish output.json to blackboard
  ↓
Coordination Agent: Trigger Validator
  ↓
Validator Agent: Run CHECKPOINT-1 validations
  ↓
[PASS] → Coordination Agent: Transition to Requirements Phase
[FAIL] → Coordination Agent: Block transition, notify Research Agent
```

**Validation Checkpoint 1**: Research → Requirements
- All research questions answered
- Technology recommendations complete
- References documented
- JSON schema valid

### Phase 2: Requirements
```
Coordination Agent: Activate Product Manager
  ↓
Product Manager: Read research from blackboard
  ↓
Product Manager: Define requirements
  ↓
Product Manager: Publish output.json to blackboard
  ↓
Coordination Agent: Trigger Validator
  ↓
Validator Agent: Run CHECKPOINT-2 validations
  ↓
[PASS] → Coordination Agent: Transition to Architecture Phase
[FAIL] → Coordination Agent: Block transition, notify Product Manager
```

**Validation Checkpoint 2**: Requirements → Architecture
- All requirements traceable to research
- CRD specifications complete
- Use cases defined
- Acceptance criteria present
- JSON schema valid

### Phase 3: Architecture
```
Coordination Agent: Activate Architect
  ↓
Architect: Read requirements from blackboard
  ↓
Architect: Design architecture
  ↓
Architect: Publish output.json to blackboard
  ↓
Coordination Agent: Trigger Validator
  ↓
Validator Agent: Run CHECKPOINT-3 validations
  ↓
[PASS] → Coordination Agent: Transition to Development Phase
[FAIL] → Coordination Agent: Block transition, notify Architect
```

**Validation Checkpoint 3**: Architecture → Development
- Architecture satisfies requirements
- NFRs measurable
- Work breakdown complete
- Technology choices justified
- JSON schema valid

### Phase 4: Development
```
Coordination Agent: Activate Developers (parallel streams)
  ↓
Developers: Read architecture from blackboard
  ↓
Developers: Implement code
  ↓
Developers: Publish output.json to blackboard
  ↓
Coordination Agent: Trigger Validator
  ↓
Validator Agent: Run CHECKPOINT-4 validations
  ↓
[PASS] → Coordination Agent: Transition to QA Phase
[FAIL] → Coordination Agent: Block transition, notify Developers
```

**Validation Checkpoint 4**: Development → QA
- All requirements implemented
- Test coverage ≥ 80%
- Code follows architecture
- APIs documented
- JSON schema valid

### Phase 5: QA
```
Coordination Agent: Activate QA Agent
  ↓
QA Agent: Read implementation from blackboard
  ↓
QA Agent: Execute tests
  ↓
QA Agent: Publish output.json to blackboard
  ↓
Coordination Agent: Trigger Validator
  ↓
Validator Agent: Run CHECKPOINT-5 validations
  ↓
[PASS] → Coordination Agent: Transition to Delivery Phase
[FAIL] → Coordination Agent: Block transition, notify QA Agent
```

**Validation Checkpoint 5**: QA → Delivery
- All tests passing
- Performance targets met
- Production readiness confirmed
- JSON schema valid

### Phase 6: Delivery
```
Coordination Agent: Final review
  ↓
All Agents: Sign off
  ↓
Coordination Agent: Mark project complete
  ↓
END
```

---

## Blackboard Structure

```
blackboard/
├── state.json                           # Current workflow state
├── progress.json                        # Real-time progress
├── agents/
│   ├── researcher/
│   │   ├── output.json                 # Research findings (JSON)
│   │   ├── status.json                 # Agent status
│   │   └── metadata.json               # Execution metadata
│   ├── product/
│   │   ├── output.json                 # Requirements (JSON)
│   │   ├── status.json
│   │   └── metadata.json
│   ├── architect/
│   │   ├── output.json                 # Architecture (JSON)
│   │   ├── status.json
│   │   └── metadata.json
│   ├── developers/
│   │   ├── output.json                 # Implementation (JSON)
│   │   ├── status.json
│   │   └── metadata.json
│   └── qa/
│       ├── output.json                 # Test results (JSON)
│       ├── status.json
│       └── metadata.json
├── validation/
│   ├── checkpoint_1.json               # Research → Product
│   ├── checkpoint_2.json               # Product → Architect
│   ├── checkpoint_3.json               # Architect → Developers
│   ├── checkpoint_4.json               # Developers → QA
│   └── checkpoint_5.json               # QA → Delivery
└── traceability/
    ├── requirements_matrix.json        # Req → Research mapping
    ├── architecture_matrix.json        # Arch → Req mapping
    └── implementation_matrix.json      # Code → Arch mapping
```

---

## Agent Documentation Isolation

Each agent has access ONLY to their specific documentation:

### Research Agent Documentation
**Path**: `agents/researcher/docs/`
```
agents/researcher/docs/
├── charter.md                          # Agent charter
├── research_guidelines.md              # How to conduct research
├── output_schema.json                  # JSON output schema
└── examples/
    └── sample_output.json              # Example output
```

### Product Manager Documentation
**Path**: `agents/product/docs/`
```
agents/product/docs/
├── charter.md
├── requirements_guidelines.md
├── crd_specification_template.md
├── use_case_template.md
├── output_schema.json
└── examples/
    └── sample_output.json
```

### Architect Documentation
**Path**: `agents/architect/docs/`
```
agents/architect/docs/
├── charter.md
├── architecture_guidelines.md
├── nfr_template.md
├── work_breakdown_template.md
├── output_schema.json
└── examples/
    └── sample_output.json
```

### Developer Documentation
**Path**: `agents/developers/docs/`
```
agents/developers/docs/
├── charter.md
├── coding_standards.md
├── testing_guidelines.md
├── api_documentation_template.md
├── output_schema.json
└── examples/
    └── sample_output.json
```

### QA Documentation
**Path**: `agents/qa/docs/`
```
agents/qa/docs/
├── charter.md
├── test_plan_template.md
├── performance_testing_guide.md
├── chaos_testing_guide.md
├── production_readiness_checklist.md
├── output_schema.json
└── examples/
    └── sample_output.json
```

**NO CROSS-AGENT FILE ACCESS**: Agents cannot read files from other agent directories.

---

## Communication Protocol

### Rule 1: JSON-Only Outputs
All agent outputs MUST be in JSON format following their schema.

### Rule 2: Blackboard-Only Communication
Agents communicate ONLY via blackboard. No direct agent-to-agent communication.

### Rule 3: Read-Only Inputs
Agents read previous phase outputs from blackboard (read-only).

### Rule 4: Schema Validation
All JSON outputs validated before blackboard publication.

### Rule 5: Status Updates
Agents update their status.json in real-time.

---

## Validation Gates

### Gate Enforcement
- Validator agent runs automatically after each phase
- Failed validation BLOCKS workflow progression
- Coordination agent enforces blocks
- Current agent must fix issues before proceeding

### Validation Categories
1. **Completeness**: All required fields present
2. **Consistency**: Cross-references resolve correctly
3. **Traceability**: Links to previous phase verified
4. **Quality**: Meets quality thresholds

---

## Progress Tracking

### Real-Time Updates
Coordination agent updates `blackboard/progress.json` continuously:

```json
{
  "workflowId": "flagsmith-operator-dev",
  "currentPhase": "architecture",
  "currentAgent": "architect",
  "overallProgress": 45,
  "phases": {
    "research": {"status": "completed", "progress": 100},
    "requirements": {"status": "completed", "progress": 100},
    "architecture": {"status": "in_progress", "progress": 60},
    "development": {"status": "not_started", "progress": 0},
    "qa": {"status": "not_started", "progress": 0}
  },
  "lastUpdate": "2026-02-13T20:00:00Z"
}
```

---

## Quality Metrics

### Tracked Metrics
- Validation pass rate
- Rework cycles per phase
- Time per phase
- Blocker count
- Traceability coverage

### Quality Gates
- Research: 100% questions answered
- Requirements: 100% traceability to research
- Architecture: 100% requirements addressed
- Development: 80%+ test coverage
- QA: 100% tests passing

---

## Risk Management

### Blocker Handling
1. Agent encounters blocker
2. Agent updates status.json with blocker
3. Coordination agent detects blocker
4. Coordination agent escalates to user
5. User resolves or provides guidance
6. Agent continues

### Validation Failure Handling
1. Validator detects issue
2. Validator creates detailed report
3. Coordination agent blocks transition
4. Coordination agent notifies current agent
5. Agent fixes issues
6. Agent republishes output
7. Validator re-validates
8. [PASS] → Proceed | [FAIL] → Repeat

---

## Success Criteria

- ✅ Zero handoffs without validation
- ✅ 100% traceability maintained
- ✅ All JSON outputs schema-valid
- ✅ Real-time progress visibility
- ✅ Complete audit trail
- ✅ Agent isolation enforced

---

**Status**: ✅ Framework v2.0 Complete  
**Ready for**: Implementation
