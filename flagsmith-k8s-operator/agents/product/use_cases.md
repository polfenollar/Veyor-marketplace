# Use Cases & User Stories - Flagsmith Kubernetes Operator

**Product Manager Deliverable**  
**Version**: 1.0  
**Date**: 2026-02-13

---

## 1. Installation Management Use Cases

### UC-INST-001: Deploy New Flagsmith Instance

**Actor**: Platform Administrator  
**Goal**: Deploy a complete Flagsmith installation for a new tenant

**Preconditions**:
- Kubernetes cluster is available
- Operator is installed
- Namespace exists

**Main Flow**:
1. Admin creates `FlagsmithInstance` CRD
2. Operator validates specification
3. Operator deploys PostgreSQL StatefulSet
4. Operator deploys Redis
5. Operator deploys Flagsmith API
6. Operator deploys Flagsmith Frontend
7. Operator configures Ingress with TLS
8. Operator reports status as Ready

**Postconditions**:
- Flagsmith is accessible via configured URL
- All components are healthy
- Database is initialized

**User Story**:
```
As a Platform Administrator
I want to deploy a complete Flagsmith instance via a single CRD
So that I can quickly onboard new tenants without manual setup
```

**Acceptance Criteria**:
- ✅ Single CRD creates all components
- ✅ Deployment completes in < 5 minutes
- ✅ All health checks pass
- ✅ Ingress is configured with TLS
- ✅ Status shows all component states

---

### UC-INST-002: Upgrade Flagsmith Version

**Actor**: Platform Administrator  
**Goal**: Upgrade Flagsmith to a new version with zero downtime

**Preconditions**:
- Flagsmith instance is running
- New version is available

**Main Flow**:
1. Admin updates `FlagsmithInstance` spec.version
2. Operator detects version change
3. Operator performs rolling update of API pods
4. Operator performs rolling update of Frontend pods
5. Operator runs database migrations
6. Operator validates new version
7. Operator updates status

**Postconditions**:
- Flagsmith is running new version
- No downtime occurred
- All data is preserved

**User Story**:
```
As a Platform Administrator
I want to upgrade Flagsmith versions declaratively
So that I can keep instances up-to-date without manual intervention
```

**Acceptance Criteria**:
- ✅ Zero downtime during upgrade
- ✅ Automatic database migrations
- ✅ Rollback on failure
- ✅ Version validation
- ✅ Status reflects upgrade progress

---

### UC-INST-003: Scale Flagsmith API

**Actor**: Platform Administrator  
**Goal**: Scale Flagsmith API to handle increased load

**Preconditions**:
- Flagsmith instance is running
- Autoscaling is enabled

**Main Flow**:
1. Load increases on API
2. HorizontalPodAutoscaler detects high CPU
3. HPA scales API pods
4. Operator monitors scaling
5. Operator updates status

**Postconditions**:
- API can handle increased load
- Response times remain acceptable

**User Story**:
```
As a Platform Administrator
I want Flagsmith API to auto-scale based on load
So that performance remains consistent during traffic spikes
```

**Acceptance Criteria**:
- ✅ Autoscaling triggers correctly
- ✅ Scales up within 30 seconds
- ✅ Scales down after load decreases
- ✅ No service disruption
- ✅ Status shows current replica count

---

## 2. Configuration Management Use Cases

### UC-CONF-001: Create Feature Flag Project

**Actor**: Product Manager  
**Goal**: Create a new Flagsmith project for a product

**Preconditions**:
- Flagsmith instance exists
- User has Admin role
- Approval is granted (if required)

**Main Flow**:
1. Product Manager creates `FlagsmithProject` CRD
2. Mutating webhook adds required labels
3. Validating webhook checks approval status
4. Operator creates project via Admin API
5. Operator stores project ID in status
6. Operator creates default environments

**Postconditions**:
- Project exists in Flagsmith
- Project is accessible via API
- RBAC is configured

**User Story**:
```
As a Product Manager
I want to create a Flagsmith project via Kubernetes CRD
So that I can manage feature flags using GitOps workflows
```

**Acceptance Criteria**:
- ✅ Project created in Flagsmith
- ✅ Project ID stored in status
- ✅ RBAC enforced
- ✅ Approval required if configured
- ✅ Sync status reported

---

### UC-CONF-002: Deploy Feature Flag

**Actor**: Developer  
**Goal**: Deploy a new feature flag to production

**Preconditions**:
- Project and environment exist
- User has Developer role

**Main Flow**:
1. Developer creates `FlagsmithFeatureFlag` CRD
2. Operator validates environmentRef
3. Operator creates flag via Admin API
4. Operator configures flag state
5. Operator updates status

**Postconditions**:
- Flag exists in Flagsmith
- Flag is accessible via SDK
- Flag state is correct

**User Story**:
```
As a Developer
I want to deploy feature flags via Kubernetes CRDs
So that I can manage flags alongside application code in Git
```

**Acceptance Criteria**:
- ✅ Flag created in Flagsmith
- ✅ Flag state synced
- ✅ Multi-environment support
- ✅ Segment targeting works
- ✅ Status shows flag state

---

### UC-CONF-003: Update Feature Flag State

**Actor**: Developer  
**Goal**: Enable/disable a feature flag

**Preconditions**:
- Flag exists
- User has Developer role

**Main Flow**:
1. Developer updates flag spec.defaultEnabled
2. Operator detects change
3. Operator updates flag via Admin API
4. Operator verifies update
5. Operator updates status

**Postconditions**:
- Flag state updated in Flagsmith
- Applications see new state

**User Story**:
```
As a Developer
I want to update feature flag states via CRD updates
So that I can control feature rollouts declaratively
```

**Acceptance Criteria**:
- ✅ Flag state updates immediately
- ✅ Change propagates to SDK
- ✅ Status reflects current state
- ✅ Audit trail maintained
- ✅ No service disruption

---

### UC-CONF-004: Create User Segment

**Actor**: Product Manager  
**Goal**: Create a user segment for targeted rollouts

**Preconditions**:
- Project exists
- User has Developer role

**Main Flow**:
1. Product Manager creates `FlagsmithSegment` CRD
2. Operator validates rules syntax
3. Operator creates segment via Admin API
4. Operator stores segment ID
5. Operator updates status

**Postconditions**:
- Segment exists in Flagsmith
- Segment can be used for targeting

**User Story**:
```
As a Product Manager
I want to create user segments via CRDs
So that I can target specific user groups for feature rollouts
```

**Acceptance Criteria**:
- ✅ Segment created in Flagsmith
- ✅ Complex rules supported
- ✅ Segment ID stored
- ✅ Can be referenced by flags
- ✅ Status shows sync state

---

## 3. Governance Use Cases

### UC-GOV-001: Request Project Creation Approval

**Actor**: Developer  
**Goal**: Request approval to create a new project

**Preconditions**:
- Flagsmith instance exists
- Approval policy is configured

**Main Flow**:
1. Developer creates `FlagsmithProject` CRD
2. Mutating webhook adds approval-required annotation
3. Validating webhook denies (pending approval)
4. Operator creates `FlagsmithApproval` CRD
5. Operator sends Slack notification
6. Approver reviews and approves
7. Operator updates project annotation
8. Developer reapplies CRD
9. Validating webhook allows
10. Operator creates project

**Postconditions**:
- Project created after approval
- Approval audit trail exists

**User Story**:
```
As a Developer
I want to request approval for project creation
So that platform team can review before provisioning resources
```

**Acceptance Criteria**:
- ✅ Approval request created automatically
- ✅ Slack notification sent
- ✅ Resource blocked until approved
- ✅ Audit trail maintained
- ✅ Timeout enforced

---

### UC-GOV-002: Approve via Slack

**Actor**: Platform Admin  
**Goal**: Approve a project creation request via Slack

**Preconditions**:
- Approval request exists
- Slack integration configured

**Main Flow**:
1. Admin receives Slack notification
2. Admin reviews request details
3. Admin clicks "Approve" button
4. Slack bot updates approval status
5. Operator detects approval
6. Operator updates resource annotation
7. Operator sends confirmation

**Postconditions**:
- Approval recorded
- Resource can be created
- Requester notified

**User Story**:
```
As a Platform Admin
I want to approve requests directly from Slack
So that I can quickly review and approve without context switching
```

**Acceptance Criteria**:
- ✅ Slack button works
- ✅ Approval recorded immediately
- ✅ Requester notified
- ✅ Audit trail complete
- ✅ Comments captured

---

### UC-GOV-003: Enforce Policy

**Actor**: System (Kyverno)  
**Goal**: Enforce naming convention policy

**Preconditions**:
- Kyverno policy is installed
- Policy is enabled

**Main Flow**:
1. User creates `FlagsmithProject` with invalid name
2. Validating webhook calls Kyverno
3. Kyverno evaluates policy
4. Kyverno denies request
5. User receives clear error message

**Postconditions**:
- Invalid resource rejected
- User informed of violation

**User Story**:
```
As a Platform Admin
I want to enforce naming conventions via policies
So that all resources follow organizational standards
```

**Acceptance Criteria**:
- ✅ Policy evaluated on create/update
- ✅ Clear error messages
- ✅ Policy violations logged
- ✅ Exemptions supported
- ✅ Dry-run mode available

---

## 4. RBAC Use Cases

### UC-RBAC-001: Viewer Access

**Actor**: Auditor  
**Goal**: View feature flag configuration

**Preconditions**:
- User has Viewer role
- Resources exist

**Main Flow**:
1. Auditor runs `kubectl get flagsmithfeatureflags`
2. Kubernetes RBAC allows read
3. Auditor views flag configuration
4. Auditor attempts to update flag
5. Kubernetes RBAC denies

**Postconditions**:
- Auditor can view resources
- Auditor cannot modify resources

**User Story**:
```
As an Auditor
I want read-only access to feature flag configuration
So that I can review settings without risk of changes
```

**Acceptance Criteria**:
- ✅ Can list all resources
- ✅ Can view resource details
- ✅ Cannot create resources
- ✅ Cannot update resources
- ✅ Cannot delete resources

---

### UC-RBAC-002: Developer Access

**Actor**: Feature Developer  
**Goal**: Manage feature flags but not projects

**Preconditions**:
- User has Developer role
- Project exists

**Main Flow**:
1. Developer creates `FlagsmithFeatureFlag`
2. Kubernetes RBAC allows
3. Developer attempts to create `FlagsmithProject`
4. Kubernetes RBAC denies

**Postconditions**:
- Developer can manage flags
- Developer cannot manage projects

**User Story**:
```
As a Feature Developer
I want to manage feature flags without project admin access
So that I can control my features without broader permissions
```

**Acceptance Criteria**:
- ✅ Can create/update/delete flags
- ✅ Can create/update/delete segments
- ✅ Can view projects (read-only)
- ✅ Cannot create projects
- ✅ Cannot delete projects

---

### UC-RBAC-003: Admin Access

**Actor**: Platform Admin  
**Goal**: Full access to all resources

**Preconditions**:
- User has Admin role

**Main Flow**:
1. Admin performs any operation
2. Kubernetes RBAC allows
3. Operation succeeds

**Postconditions**:
- Admin has full access

**User Story**:
```
As a Platform Admin
I want full access to all Flagsmith resources
So that I can manage the entire platform
```

**Acceptance Criteria**:
- ✅ Can create/update/delete all resources
- ✅ Can approve requests
- ✅ Can manage policies
- ✅ Can view all namespaces
- ✅ Can manage RBAC

---

## 5. Multi-Tenancy Use Cases

### UC-MT-001: Onboard New Tenant

**Actor**: Platform Admin  
**Goal**: Onboard a new tenant with isolated resources

**Preconditions**:
- Cluster has capacity
- Tenant details available

**Main Flow**:
1. Admin creates namespace for tenant
2. Admin applies resource quotas
3. Admin applies network policies
4. Admin creates `FlagsmithInstance` in tenant namespace
5. Operator deploys isolated Flagsmith stack
6. Admin configures tenant-specific RBAC
7. Admin provides access to tenant

**Postconditions**:
- Tenant has isolated Flagsmith instance
- Tenant cannot access other tenants
- Resource quotas enforced

**User Story**:
```
As a Platform Admin
I want to onboard new tenants with complete isolation
So that each tenant has a dedicated, secure Flagsmith environment
```

**Acceptance Criteria**:
- ✅ Namespace isolation enforced
- ✅ Network policies prevent cross-tenant access
- ✅ Resource quotas applied
- ✅ Dedicated database per tenant
- ✅ Tenant-specific RBAC

---

### UC-MT-002: Enforce Tenant Isolation

**Actor**: System (Network Policy)  
**Goal**: Prevent cross-tenant communication

**Preconditions**:
- Multiple tenants exist
- Network policies configured

**Main Flow**:
1. Tenant A pod attempts to connect to Tenant B pod
2. Network policy blocks connection
3. Connection fails
4. Event logged

**Postconditions**:
- Cross-tenant communication blocked
- Violation logged

**User Story**:
```
As a Platform Admin
I want network-level tenant isolation
So that tenants cannot access each other's resources
```

**Acceptance Criteria**:
- ✅ Cross-tenant network traffic blocked
- ✅ Intra-tenant traffic allowed
- ✅ Violations logged
- ✅ Policies auditable
- ✅ No performance impact

---

## 6. Operational Use Cases

### UC-OPS-001: Monitor Operator Health

**Actor**: SRE  
**Goal**: Monitor operator health and performance

**Preconditions**:
- Operator is running
- Prometheus is configured

**Main Flow**:
1. SRE views Prometheus dashboard
2. SRE sees operator metrics
3. SRE identifies slow reconciliation
4. SRE investigates logs
5. SRE resolves issue

**Postconditions**:
- Issue identified and resolved
- Metrics available for analysis

**User Story**:
```
As an SRE
I want comprehensive operator metrics
So that I can monitor health and troubleshoot issues
```

**Acceptance Criteria**:
- ✅ Reconciliation duration metrics
- ✅ API call success/failure metrics
- ✅ Queue depth metrics
- ✅ Resource count metrics
- ✅ Error rate metrics

---

### UC-OPS-002: Troubleshoot Sync Failure

**Actor**: SRE  
**Goal**: Troubleshoot why a resource isn't syncing

**Preconditions**:
- Resource exists
- Sync is failing

**Main Flow**:
1. SRE checks resource status
2. SRE views conditions
3. SRE checks operator logs
4. SRE identifies API error
5. SRE fixes configuration
6. Sync succeeds

**Postconditions**:
- Sync issue resolved
- Resource synced

**User Story**:
```
As an SRE
I want clear error messages in resource status
So that I can quickly identify and fix sync issues
```

**Acceptance Criteria**:
- ✅ Status shows error details
- ✅ Conditions explain failure
- ✅ Logs provide context
- ✅ Events created for visibility
- ✅ Retry logic works

---

### UC-OPS-003: Backup and Restore

**Actor**: SRE  
**Goal**: Backup Flagsmith configuration and restore

**Preconditions**:
- Flagsmith instance is running
- Backup is configured

**Main Flow**:
1. Automated backup runs
2. Database backed up
3. CRDs exported
4. Disaster occurs
5. SRE restores from backup
6. Flagsmith operational

**Postconditions**:
- Configuration restored
- No data loss

**User Story**:
```
As an SRE
I want automated backups of Flagsmith data
So that I can recover from disasters
```

**Acceptance Criteria**:
- ✅ Automated database backups
- ✅ CRD export/import
- ✅ Point-in-time recovery
- ✅ Restore tested regularly
- ✅ Backup retention enforced

---

## 7. GitOps Use Cases

### UC-GITOPS-001: Deploy via GitOps

**Actor**: Developer  
**Goal**: Deploy feature flags via GitOps workflow

**Preconditions**:
- Git repository configured
- ArgoCD/Flux installed

**Main Flow**:
1. Developer commits `FlagsmithFeatureFlag` to Git
2. Developer creates pull request
3. Team reviews PR
4. PR merged to main
5. GitOps tool detects change
6. GitOps tool applies CRD
7. Operator syncs to Flagsmith

**Postconditions**:
- Flag deployed via Git
- Change tracked in Git history

**User Story**:
```
As a Developer
I want to deploy feature flags via GitOps
So that all changes are version-controlled and auditable
```

**Acceptance Criteria**:
- ✅ CRDs work with ArgoCD
- ✅ CRDs work with Flux
- ✅ Drift detection works
- ✅ Rollback via Git revert
- ✅ Status synced to Git

---

## 8. Summary

**Total Use Cases**: 20+  
**Categories**: Installation, Configuration, Governance, RBAC, Multi-Tenancy, Operations, GitOps

**Key Patterns**:
- Declarative configuration via CRDs
- GitOps-friendly workflows
- Approval-based governance
- Multi-level RBAC
- Complete tenant isolation
- Comprehensive observability

**Next**: Architect to design system architecture

---

**Status**: ✅ Complete  
**Estimated Development**: 4-6 months
