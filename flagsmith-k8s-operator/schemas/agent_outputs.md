# JSON Output Schemas - Multi-Agent System

**Version**: 1.0  
**Date**: 2026-02-13

---

## 1. Research Agent Output Schema

**File**: `blackboard/agents/researcher/output.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["agentId", "phase", "timestamp", "findings", "recommendations", "deliverables"],
  "properties": {
    "agentId": {
      "type": "string",
      "const": "researcher"
    },
    "phase": {
      "type": "string",
      "const": "research"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "findings": {
      "type": "object",
      "required": ["flagsmith", "kubernetes", "integrations", "references"],
      "properties": {
        "flagsmith": {
          "type": "object",
          "properties": {
            "architecture": {"type": "string"},
            "apis": {"type": "array", "items": {"type": "object"}},
            "deployment": {"type": "object"},
            "components": {"type": "array", "items": {"type": "string"}}
          }
        },
        "kubernetes": {
          "type": "object",
          "properties": {
            "operatorPatterns": {"type": "array", "items": {"type": "string"}},
            "bestPractices": {"type": "array", "items": {"type": "string"}},
            "frameworks": {"type": "array", "items": {"type": "object"}}
          }
        },
        "integrations": {
          "type": "object",
          "properties": {
            "helm": {"type": "object"},
            "kyverno": {"type": "object"},
            "prometheus": {"type": "object"}
          }
        },
        "references": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": {"type": "string"},
              "url": {"type": "string"},
              "type": {"type": "string", "enum": ["documentation", "code", "article", "video"]}
            }
          }
        }
      }
    },
    "recommendations": {
      "type": "object",
      "required": ["framework", "language", "testing", "observability"],
      "properties": {
        "framework": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "version": {"type": "string"},
            "rationale": {"type": "string"}
          }
        },
        "language": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "version": {"type": "string"},
            "rationale": {"type": "string"}
          }
        },
        "testing": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "tool": {"type": "string"},
              "purpose": {"type": "string"}
            }
          }
        },
        "observability": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "tool": {"type": "string"},
              "purpose": {"type": "string"}
            }
          }
        }
      }
    },
    "deliverables": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "path", "status"],
        "properties": {
          "name": {"type": "string"},
          "path": {"type": "string"},
          "status": {"type": "string", "enum": ["completed", "in_progress", "pending"]},
          "checksum": {"type": "string"}
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "duration": {"type": "number"},
        "sourcesReviewed": {"type": "number"},
        "confidence": {"type": "number", "minimum": 0, "maximum": 100}
      }
    }
  }
}
```

---

## 2. Product Manager Output Schema

**File**: `blackboard/agents/product/output.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["agentId", "phase", "timestamp", "requirements", "crds", "useCases", "deliverables"],
  "properties": {
    "agentId": {
      "type": "string",
      "const": "product_manager"
    },
    "phase": {
      "type": "string",
      "const": "requirements"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "requirements": {
      "type": "object",
      "required": ["functional", "acceptance"],
      "properties": {
        "functional": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "category", "description", "priority"],
            "properties": {
              "id": {"type": "string", "pattern": "^FR-[A-Z]+-[0-9]{3}$"},
              "category": {"type": "string"},
              "description": {"type": "string"},
              "priority": {"type": "string", "enum": ["must_have", "should_have", "nice_to_have"]},
              "traceabilityTo": {"type": "array", "items": {"type": "string"}}
            }
          }
        },
        "acceptance": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "requirementId": {"type": "string"},
              "criteria": {"type": "array", "items": {"type": "string"}}
            }
          }
        }
      }
    },
    "crds": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "apiVersion", "kind", "scope", "spec"],
        "properties": {
          "name": {"type": "string"},
          "apiVersion": {"type": "string"},
          "kind": {"type": "string"},
          "scope": {"type": "string", "enum": ["Namespaced", "Cluster"]},
          "spec": {"type": "object"},
          "status": {"type": "object"}
        }
      }
    },
    "useCases": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "actor", "goal", "flow"],
        "properties": {
          "id": {"type": "string", "pattern": "^UC-[A-Z]+-[0-9]{3}$"},
          "name": {"type": "string"},
          "actor": {"type": "string"},
          "goal": {"type": "string"},
          "preconditions": {"type": "array", "items": {"type": "string"}},
          "flow": {"type": "array", "items": {"type": "string"}},
          "postconditions": {"type": "array", "items": {"type": "string"}},
          "relatedRequirements": {"type": "array", "items": {"type": "string"}}
        }
      }
    },
    "deliverables": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "path", "status"],
        "properties": {
          "name": {"type": "string"},
          "path": {"type": "string"},
          "status": {"type": "string", "enum": ["completed", "in_progress", "pending"]},
          "checksum": {"type": "string"}
        }
      }
    }
  }
}
```

---

## 3. Architect Output Schema

**File**: `blackboard/agents/architect/output.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["agentId", "phase", "timestamp", "architecture", "nfrs", "workBreakdown", "deliverables"],
  "properties": {
    "agentId": {
      "type": "string",
      "const": "architect"
    },
    "phase": {
      "type": "string",
      "const": "architecture"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "architecture": {
      "type": "object",
      "required": ["components", "controllers", "integrations"],
      "properties": {
        "components": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "type": {"type": "string"},
              "responsibilities": {"type": "array", "items": {"type": "string"}},
              "dependencies": {"type": "array", "items": {"type": "string"}},
              "technology": {"type": "object"}
            }
          }
        },
        "controllers": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "crd": {"type": "string"},
              "reconciliationLogic": {"type": "string"},
              "dependencies": {"type": "array", "items": {"type": "string"}}
            }
          }
        },
        "integrations": {
          "type": "array",
          "items": {
            "type": "object"},
            "properties": {
              "name": {"type": "string"},
              "type": {"type": "string"},
              "purpose": {"type": "string"}
            }
          }
        }
      }
    },
    "nfrs": {
      "type": "object",
      "required": ["performance", "scalability", "reliability", "security"],
      "properties": {
        "performance": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string", "pattern": "^NFR-PERF-[0-9]{3}$"},
              "metric": {"type": "string"},
              "target": {"type": "string"},
              "measurement": {"type": "string"}
            }
          }
        },
        "scalability": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string", "pattern": "^NFR-SCALE-[0-9]{3}$"},
              "metric": {"type": "string"},
              "target": {"type": "string"}
            }
          }
        },
        "reliability": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string", "pattern": "^NFR-REL-[0-9]{3}$"},
              "metric": {"type": "string"},
              "target": {"type": "string"}
            }
          }
        },
        "security": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string", "pattern": "^NFR-SEC-[0-9]{3}$"},
              "requirement": {"type": "string"},
              "implementation": {"type": "string"}
            }
          }
        }
      }
    },
    "workBreakdown": {
      "type": "object",
      "required": ["streams", "timeline"],
      "properties": {
        "streams": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "duration": {"type": "string"},
              "tasks": {"type": "array", "items": {"type": "string"}},
              "dependencies": {"type": "array", "items": {"type": "string"}},
              "assignedTo": {"type": "string"}
            }
          }
        },
        "timeline": {
          "type": "object",
          "properties": {
            "totalDuration": {"type": "string"},
            "phases": {"type": "array", "items": {"type": "object"}}
          }
        }
      }
    },
    "deliverables": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "path", "status"],
        "properties": {
          "name": {"type": "string"},
          "path": {"type": "string"},
          "status": {"type": "string", "enum": ["completed", "in_progress", "pending"]},
          "checksum": {"type": "string"}
        }
      }
    }
  }
}
```

---

## 4. Developer Output Schema

**File**: `blackboard/agents/developers/output.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["agentId", "phase", "timestamp", "implementation", "tests", "deliverables"],
  "properties": {
    "agentId": {
      "type": "string",
      "const": "developers"
    },
    "phase": {
      "type": "string",
      "const": "development"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "implementation": {
      "type": "object",
      "required": ["modules", "apis", "configurations"],
      "properties": {
        "modules": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "path": {"type": "string"},
              "language": {"type": "string"},
              "linesOfCode": {"type": "number"},
              "dependencies": {"type": "array", "items": {"type": "string"}},
              "implementsRequirements": {"type": "array", "items": {"type": "string"}}
            }
          }
        },
        "apis": {
          "type": "array",
          "items": {
            "type": "object"},
            "properties": {
              "name": {"type": "string"},
              "endpoint": {"type": "string"},
              "methods": {"type": "array", "items": {"type": "string"}},
              "documented": {"type": "boolean"}
            }
          }
        },
        "configurations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "path": {"type": "string"},
              "type": {"type": "string"}
            }
          }
        }
      }
    },
    "tests": {
      "type": "object",
      "required": ["unit", "integration", "coverage"],
      "properties": {
        "unit": {
          "type": "object",
          "properties": {
            "total": {"type": "number"},
            "passed": {"type": "number"},
            "failed": {"type": "number"},
            "skipped": {"type": "number"}
          }
        },
        "integration": {
          "type": "object",
          "properties": {
            "total": {"type": "number"},
            "passed": {"type": "number"},
            "failed": {"type": "number"}
          }
        },
        "coverage": {
          "type": "object",
          "properties": {
            "overall": {"type": "number", "minimum": 0, "maximum": 100},
            "byModule": {"type": "array", "items": {"type": "object"}}
          }
        }
      }
    },
    "deliverables": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "path", "status"],
        "properties": {
          "name": {"type": "string"},
          "path": {"type": "string"},
          "status": {"type": "string", "enum": ["completed", "in_progress", "pending"]},
          "checksum": {"type": "string"}
        }
      }
    },
    "quality": {
      "type": "object",
      "properties": {
        "lintErrors": {"type": "number"},
        "securityIssues": {"type": "array", "items": {"type": "object"}},
        "codeSmells": {"type": "number"}
      }
    }
  }
}
```

---

## 5. QA Output Schema

**File**: `blackboard/agents/qa/output.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["agentId", "phase", "timestamp", "testResults", "productionReadiness", "deliverables"],
  "properties": {
    "agentId": {
      "type": "string",
      "const": "qa"
    },
    "phase": {
      "type": "string",
      "const": "qa"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "testResults": {
      "type": "object",
      "required": ["e2e", "performance", "chaos"],
      "properties": {
        "e2e": {
          "type": "object",
          "properties": {
            "total": {"type": "number"},
            "passed": {"type": "number"},
            "failed": {"type": "number"},
            "scenarios": {"type": "array", "items": {"type": "object"}}
          }
        },
        "performance": {
          "type": "object",
          "properties": {
            "reconciliationLatency": {"type": "object"},
            "webhookLatency": {"type": "object"},
            "throughput": {"type": "object"},
            "meetsTargets": {"type": "boolean"}
          }
        },
        "chaos": {
          "type": "object",
          "properties": {
            "experiments": {"type": "array", "items": {"type": "object"}},
            "passed": {"type": "number"},
            "failed": {"type": "number"}
          }
        }
      }
    },
    "productionReadiness": {
      "type": "object",
      "required": ["score", "checklist"],
      "properties": {
        "score": {"type": "number", "minimum": 0, "maximum": 100},
        "checklist": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "category": {"type": "string"},
              "item": {"type": "string"},
              "status": {"type": "string", "enum": ["pass", "fail", "n/a"]},
              "notes": {"type": "string"}
            }
          }
        },
        "recommendation": {"type": "string", "enum": ["ready", "not_ready", "ready_with_caveats"]}
      }
    },
    "deliverables": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "path", "status"],
        "properties": {
          "name": {"type": "string"},
          "path": {"type": "string"},
          "status": {"type": "string", "enum": ["completed", "in_progress", "pending"]},
          "checksum": {"type": "string"}
        }
      }
    }
  }
}
```

---

## 6. Validator Output Schema

**File**: `blackboard/validation/checkpoint_N.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["checkpointId", "fromAgent", "toAgent", "timestamp", "status", "checks"],
  "properties": {
    "checkpointId": {
      "type": "string",
      "pattern": "^CHECKPOINT-[0-9]+$"
    },
    "fromAgent": {
      "type": "string"
    },
    "toAgent": {
      "type": "string"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "status": {
      "type": "string",
      "enum": ["passed", "failed", "warning"]
    },
    "checks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["checkId", "name", "status"],
        "properties": {
          "checkId": {"type": "string"},
          "name": {"type": "string"},
          "category": {"type": "string", "enum": ["completeness", "consistency", "traceability", "quality"]},
          "status": {"type": "string", "enum": ["pass", "fail", "warning"]},
          "message": {"type": "string"},
          "details": {"type": "object"}
        }
      }
    },
    "summary": {
      "type": "object",
      "properties": {
        "totalChecks": {"type": "number"},
        "passed": {"type": "number"},
        "failed": {"type": "number"},
        "warnings": {"type": "number"}
      }
    },
    "blockers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "description": {"type": "string"},
          "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
          "recommendation": {"type": "string"}
        }
      }
    }
  }
}
```

---

## Schema Validation

All JSON outputs MUST validate against their respective schemas before being published to the blackboard.

**Validation Tool**: `ajv` (Another JSON Schema Validator)

**Validation Command**:
```bash
ajv validate -s schema.json -d output.json
```

**Status**: ✅ Complete
