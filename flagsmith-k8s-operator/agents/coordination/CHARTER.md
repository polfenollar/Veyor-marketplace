# Coordination Agent - Flagsmith Kubernetes Operator

## Role
Orchestrate multi-agent workflow, manage blackboard state, and ensure smooth handoffs between agents.

## Objectives

### 1. Workflow Orchestration
- [ ] Manage agent execution sequence
- [ ] Trigger agent transitions
- [ ] Handle validation checkpoints
- [ ] Coordinate parallel work streams

### 2. Blackboard Management
- [ ] Maintain single source of truth
- [ ] Publish agent outputs to blackboard
- [ ] Track work-in-progress state
- [ ] Manage version history

### 3. Progress Tracking
- [ ] Monitor agent progress
- [ ] Update status in real-time
- [ ] Generate progress reports
- [ ] Alert on blockers

### 4. Quality Assurance
- [ ] Enforce validation gates
- [ ] Track quality metrics
- [ ] Ensure completeness
- [ ] Maintain traceability

## Blackboard Architecture

### Blackboard Structure

```
blackboard/
├── state.json                    # Current workflow state
├── progress.json                 # Real-time progress tracking
├── agents/
│   ├── researcher/
│   │   ├── output.json          # Research findings
│   │   ├── status.json          # Agent status
│   │   └── metadata.json        # Execution metadata
│   ├── product/
│   │   ├── output.json          # Requirements
│   │   ├── status.json
│   │   └── metadata.json
│   ├── architect/
│   │   ├── output.json          # Architecture
│   │   ├── status.json
│   │   └── metadata.json
│   ├── developers/
│   │   ├── output.json          # Implementation
│   │   ├── status.json
│   │   └── metadata.json
│   └── qa/
│       ├── output.json          # Test results
│       ├── status.json
│       └── metadata.json
├── validation/
│   ├── checkpoint_1.json        # Research → Product
│   ├── checkpoint_2.json        # Product → Architect
│   ├── checkpoint_3.json        # Architect → Developers
│   └── checkpoint_4.json        # Developers → QA
├── traceability/
│   ├── requirements_matrix.json
│   ├── architecture_matrix.json
│   └── implementation_matrix.json
└── metrics/
    ├── quality_metrics.json
    ├── progress_metrics.json
    └── timeline_metrics.json
```

### State Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "workflowId": {"type": "string"},
    "currentPhase": {"type": "string", "enum": ["research", "requirements", "architecture", "development", "qa", "delivery"]},
    "currentAgent": {"type": "string"},
    "status": {"type": "string", "enum": ["not_started", "in_progress", "blocked", "completed"]},
    "startTime": {"type": "string", "format": "date-time"},
    "lastUpdateTime": {"type": "string", "format": "date-time"},
    "phases": {
      "type": "object",
      "properties": {
        "research": {"$ref": "#/definitions/phaseStatus"},
        "requirements": {"$ref": "#/definitions/phaseStatus"},
        "architecture": {"$ref": "#/definitions/phaseStatus"},
        "development": {"$ref": "#/definitions/phaseStatus"},
        "qa": {"$ref": "#/definitions/phaseStatus"},
        "delivery": {"$ref": "#/definitions/phaseStatus"}
      }
    },
    "validationGates": {
      "type": "array",
      "items": {"$ref": "#/definitions/validationGate"}
    },
    "blockers": {
      "type": "array",
      "items": {"$ref": "#/definitions/blocker"}
    }
  },
  "definitions": {
    "phaseStatus": {
      "type": "object",
      "properties": {
        "status": {"type": "string", "enum": ["not_started", "in_progress", "blocked", "completed"]},
        "progress": {"type": "number", "minimum": 0, "maximum": 100},
        "startTime": {"type": "string", "format": "date-time"},
        "endTime": {"type": "string", "format": "date-time"},
        "agent": {"type": "string"},
        "deliverables": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "status": {"type": "string", "enum": ["pending", "in_progress", "completed"]},
              "path": {"type": "string"}
            }
          }
        }
      }
    },
    "validationGate": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "fromAgent": {"type": "string"},
        "toAgent": {"type": "string"},
        "status": {"type": "string", "enum": ["pending", "passed", "failed"]},
        "timestamp": {"type": "string", "format": "date-time"},
        "reportPath": {"type": "string"}
      }
    },
    "blocker": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "agent": {"type": "string"},
        "description": {"type": "string"},
        "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
        "createdAt": {"type": "string", "format": "date-time"},
        "resolvedAt": {"type": "string", "format": "date-time"},
        "status": {"type": "string", "enum": ["open", "in_progress", "resolved"]}
      }
    }
  }
}
```

## Coordination Workflow

### Phase Transitions

```
1. Research Phase
   ├── Researcher Agent starts
   ├── Publishes outputs to blackboard
   ├── Coordination Agent triggers Validator
   ├── Validator checks consistency
   ├── [PASS] → Transition to Requirements Phase
   └── [FAIL] → Block transition, notify Researcher

2. Requirements Phase
   ├── Product Manager starts
   ├── Reads Research outputs from blackboard
   ├── Publishes requirements to blackboard
   ├── Coordination Agent triggers Validator
   ├── Validator checks consistency
   ├── [PASS] → Transition to Architecture Phase
   └── [FAIL] → Block transition, notify Product Manager

3. Architecture Phase
   ├── Architect starts
   ├── Reads Requirements from blackboard
   ├── Publishes architecture to blackboard
   ├── Coordination Agent triggers Validator
   ├── Validator checks consistency
   ├── [PASS] → Transition to Development Phase
   └── [FAIL] → Block transition, notify Architect

4. Development Phase
   ├── Developers start (parallel streams)
   ├── Read Architecture from blackboard
   ├── Publish implementation to blackboard
   ├── Coordination Agent triggers Validator
   ├── Validator checks consistency
   ├── [PASS] → Transition to QA Phase
   └── [FAIL] → Block transition, notify Developers

5. QA Phase
   ├── QA Agent starts
   ├── Reads Implementation from blackboard
   ├── Publishes test results to blackboard
   ├── Coordination Agent triggers Validator
   ├── Validator checks production readiness
   ├── [PASS] → Transition to Delivery Phase
   └── [FAIL] → Block transition, notify QA

6. Delivery Phase
   ├── All agents review
   ├── Final validation
   ├── Production deployment
   └── Project complete
```

## Deliverables

- `blackboard/state.json` - Current workflow state
- `blackboard/progress.json` - Real-time progress
- `coordination_logs/` - Coordination decisions and actions
- `handoff_reports/` - Agent transition reports

## Coordination Rules

### Rule 1: Single Source of Truth
All agent outputs MUST be published to blackboard.
No agent-to-agent direct communication.
All state reads from blackboard only.

### Rule 2: Validation Gates
No phase transition without validation passing.
Validator has veto power on handoffs.
Failed validations block workflow.

### Rule 3: Progress Tracking
Blackboard updated in real-time.
All agents report progress to blackboard.
Coordination agent monitors continuously.

### Rule 4: Agent Isolation
Each agent only accesses their input documentation.
No cross-agent file access.
All communication via blackboard.

## Inputs Required

- Agent status updates
- Validation reports
- Quality metrics
- Timeline constraints

## Dependencies

- All agent outputs in JSON format
- Validator agent operational
- Blackboard infrastructure
- JSON schemas defined

## Next Steps

1. Initialize blackboard structure
2. Define state transition rules
3. Implement progress tracking
4. Create coordination dashboard
5. Integrate with all agents

## Status
🔴 **NEW** - Agent charter created, awaiting implementation

## Success Criteria

- 100% workflow visibility via blackboard
- Zero missed handoffs
- Real-time progress tracking
- All validation gates enforced
- Complete audit trail
