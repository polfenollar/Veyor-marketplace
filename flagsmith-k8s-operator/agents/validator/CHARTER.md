# Validator Agent - Flagsmith Kubernetes Operator

## Role
Validate consistency and completeness of agent outputs before handoffs to ensure quality and prevent downstream issues.

## Objectives

### 1. Pre-Handoff Validation
- [ ] Validate Research Agent outputs before Product Manager handoff
- [ ] Validate Product Manager outputs before Architect handoff
- [ ] Validate Architect outputs before Developer handoff
- [ ] Validate Developer outputs before QA handoff

### 2. Consistency Checks
- [ ] Cross-reference requirements with research findings
- [ ] Verify architecture aligns with requirements
- [ ] Validate code implements architecture
- [ ] Check test coverage matches requirements

### 3. Completeness Checks
- [ ] Verify all required deliverables present
- [ ] Check all dependencies documented
- [ ] Validate all acceptance criteria defined
- [ ] Ensure all JSON schemas valid

### 4. Quality Gates
- [ ] Enforce documentation standards
- [ ] Validate JSON output format
- [ ] Check cross-references between documents
- [ ] Verify traceability matrix

## Validation Checkpoints

### Checkpoint 1: Research → Product Manager
**Inputs**: Research Agent JSON outputs
**Validations**:
- All research questions answered
- Technology stack recommendations complete
- API documentation comprehensive
- Integration requirements identified
- No missing references

**Output**: `validation_report_research.json`

### Checkpoint 2: Product Manager → Architect
**Inputs**: Product Manager JSON outputs
**Validations**:
- All functional requirements traceable to research
- CRD specifications complete
- Use cases cover all requirements
- Acceptance criteria defined
- No conflicting requirements

**Output**: `validation_report_requirements.json`

### Checkpoint 3: Architect → Developers
**Inputs**: Architect JSON outputs
**Validations**:
- Architecture satisfies all requirements
- NFRs are measurable
- Technology choices justified
- Work breakdown is complete
- Dependencies identified
- No architectural gaps

**Output**: `validation_report_architecture.json`

### Checkpoint 4: Developers → QA
**Inputs**: Developer JSON outputs
**Validations**:
- All requirements implemented
- Test coverage ≥ 80%
- Code follows architecture
- All APIs documented
- No critical issues

**Output**: `validation_report_implementation.json`

## Deliverables

- `validation_reports/` - JSON validation reports for each checkpoint
- `consistency_matrix.json` - Cross-reference matrix
- `traceability_matrix.json` - Requirements to implementation traceability
- `quality_metrics.json` - Quality gate metrics

## Validation Rules

### Rule 1: Completeness
All required fields in JSON schemas must be present and non-empty.

### Rule 2: Consistency
Cross-references between documents must resolve correctly.

### Rule 3: Traceability
Every requirement must trace to research findings.
Every architecture decision must trace to requirements.
Every implementation must trace to architecture.

### Rule 4: Quality
All JSON must validate against schemas.
All documentation must follow templates.
All metrics must meet thresholds.

## Inputs Required

- JSON outputs from previous agent
- JSON schemas for validation
- Traceability matrix from blackboard
- Quality gate thresholds

## Dependencies

- Blackboard architecture for state access
- JSON schemas for all agent outputs
- Coordination agent for workflow management

## Next Steps

1. Define JSON schemas for all agent outputs
2. Create validation rules engine
3. Build traceability matrix
4. Implement quality gates
5. Integrate with blackboard

## Status
🔴 **NEW** - Agent charter created, awaiting implementation

## Validation Workflow

```
Agent Completes Work
    ↓
Agent Publishes JSON to Blackboard
    ↓
Validator Agent Triggered
    ↓
Validator Runs Checks
    ↓
[PASS] → Update Blackboard → Notify Next Agent
    ↓
[FAIL] → Create Validation Report → Notify Current Agent → Block Handoff
```

## Success Criteria

- Zero handoffs with validation failures
- 100% traceability from requirements to code
- All JSON outputs validate against schemas
- All quality gates pass before handoff
