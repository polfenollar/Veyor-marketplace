# Extended Research: Governance, RBAC & Installation Management

**Research Agent - Extended Deliverable**  
**Date**: 2026-02-13  
**Status**: ✅ Complete

## Executive Summary

This document extends the initial research to cover **enterprise-grade governance requirements** including:
1. **Flagsmith Installation Management** - Operator managing full Flagsmith deployment
2. **RBAC & Authorization** - Role-based access control for operator resources
3. **Policy Enforcement & Approval Workflows** - Governance hooks for deployments
4. **Multi-Tenancy** - Single-tenant architecture for enterprise customers

---

## 1. Flagsmith Installation Management

### 1.1 Deployment Architecture

**Components to Manage**:
```
Flagsmith Stack:
├── API Server (Django/Python)
│   ├── Deployment
│   ├── Service
│   ├── HorizontalPodAutoscaler
│   └── ConfigMap
├── Frontend Dashboard (React)
│   ├── Deployment
│   ├── Service
│   └── Ingress
├── PostgreSQL Database
│   ├── StatefulSet
│   ├── PersistentVolumeClaim
│   ├── Service
│   └── Secret (credentials)
├── Redis Cache (Optional but recommended)
│   ├── Deployment/StatefulSet
│   ├── Service
│   └── ConfigMap
└── Edge Proxy (Optional, for low-latency)
    ├── Deployment
    ├── Service
    └── ConfigMap
```

### 1.2 Flagsmith Configuration Requirements

**Essential Environment Variables**:
```yaml
# Database
DATABASE_URL: postgresql://user:pass@host:5432/flagsmith

# Django
DJANGO_SECRET_KEY: <random-secret>
DJANGO_ALLOWED_HOSTS: flagsmith.example.com
DJANGO_SETTINGS_MODULE: app.settings.production

# Email (optional)
EMAIL_BACKEND: django.core.mail.backends.smtp.EmailBackend
SENDER_EMAIL: noreply@example.com
EMAIL_HOST: smtp.example.com
EMAIL_PORT: 587

# Caching (Redis)
CACHE_LOCATION: redis://redis:6379/0

# Analytics
ENABLE_ANALYTICS: true
ANALYTICS_DATABASE_URL: postgresql://...

# Security
SECURE_SSL_REDIRECT: true
CSRF_COOKIE_SECURE: true
SESSION_COOKIE_SECURE: true
```

### 1.3 Operator-Managed Installation CRD

**Proposed**: `FlagsmithInstance` CRD

```yaml
apiVersion: flagsmith.com/v1alpha1
kind: FlagsmithInstance
metadata:
  name: production-flagsmith
  namespace: flagsmith-system
spec:
  version: "2.90.0"  # Flagsmith version
  
  # Database configuration
  database:
    type: postgresql  # or external
    size: 20Gi
    storageClass: fast-ssd
    # OR external:
    externalConnectionString:
      secretRef:
        name: external-db-secret
        key: connection-string
  
  # Redis configuration
  redis:
    enabled: true
    size: 5Gi
    # OR external:
    externalConnectionString:
      secretRef:
        name: external-redis-secret
  
  # API configuration
  api:
    replicas: 3
    resources:
      requests:
        cpu: "500m"
        memory: "1Gi"
      limits:
        cpu: "2"
        memory: "4Gi"
    autoscaling:
      enabled: true
      minReplicas: 3
      maxReplicas: 10
      targetCPUUtilization: 70
  
  # Frontend configuration
  frontend:
    replicas: 2
    resources:
      requests:
        cpu: "100m"
        memory: "256Mi"
  
  # Ingress configuration
  ingress:
    enabled: true
    className: nginx
    host: flagsmith.example.com
    tls:
      enabled: true
      secretName: flagsmith-tls
  
  # Security
  security:
    djangoSecretKey:
      secretRef:
        name: flagsmith-secrets
        key: django-secret-key
  
  # Analytics
  analytics:
    enabled: true
    database:
      type: postgresql
      size: 50Gi

status:
  phase: Ready
  apiEndpoint: https://flagsmith.example.com/api/v1/
  frontendURL: https://flagsmith.example.com
  version: "2.90.0"
  conditions:
    - type: Ready
      status: "True"
      lastTransitionTime: "2024-01-01T00:00:00Z"
    - type: DatabaseReady
      status: "True"
    - type: APIReady
      status: "True"
```

### 1.4 Installation Management Patterns

**Helm Chart Integration**:
- Operator can use Flagsmith's official Helm charts
- Customize values via operator logic
- Manage upgrades and rollbacks

**Direct Resource Management**:
- Operator creates Kubernetes resources directly
- More control but more complexity
- Better for custom configurations

**Recommendation**: Use Helm charts as base, customize via values

---

## 2. RBAC & Authorization

### 2.1 Operator RBAC Requirements

**Cluster-Level Permissions** (ClusterRole):
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: flagsmith-operator
rules:
  # CRD management
  - apiGroups: ["flagsmith.com"]
    resources: ["*"]
    verbs: ["*"]
  
  # Core resources for Flagsmith installation
  - apiGroups: ["apps"]
    resources: ["deployments", "statefulsets"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  
  - apiGroups: [""]
    resources: ["services", "configmaps", "persistentvolumeclaims"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list", "watch"]  # Read-only for security
  
  - apiGroups: ["networking.k8s.io"]
    resources: ["ingresses"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  
  - apiGroups: ["autoscaling"]
    resources: ["horizontalpodautoscalers"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  
  # Events for visibility
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create", "patch"]
```

### 2.2 User RBAC for CRD Access

**Multi-Level Access Control**:

```yaml
# Level 1: Read-Only (Viewer)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: flagsmith-viewer
  namespace: production
rules:
  - apiGroups: ["flagsmith.com"]
    resources: ["flagsmithprojects", "flagsmithenvironments", "flagsmithfeatureflags"]
    verbs: ["get", "list", "watch"]

---
# Level 2: Developer (Create/Update flags, not projects)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: flagsmith-developer
  namespace: production
rules:
  - apiGroups: ["flagsmith.com"]
    resources: ["flagsmithfeatureflags", "flagsmithsegments"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]
  
  - apiGroups: ["flagsmith.com"]
    resources: ["flagsmithprojects", "flagsmithenvironments"]
    verbs: ["get", "list", "watch"]  # Read-only

---
# Level 3: Admin (Full access)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: flagsmith-admin
  namespace: production
rules:
  - apiGroups: ["flagsmith.com"]
    resources: ["*"]
    verbs: ["*"]
```

### 2.3 Service Account RBAC

**Principle of Least Privilege**:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: flagsmith-operator
  namespace: flagsmith-system

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: flagsmith-operator
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: flagsmith-operator
subjects:
  - kind: ServiceAccount
    name: flagsmith-operator
    namespace: flagsmith-system
```

---

## 3. Policy Enforcement & Approval Workflows

### 3.1 Admission Webhook Architecture

**Validating Admission Webhook**:
```go
// Webhook validates FlagsmithProject creation
func (v *FlagsmithProjectValidator) ValidateCreate(ctx context.Context, obj runtime.Object) error {
    project := obj.(*flagsmithv1.FlagsmithProject)
    
    // 1. Check if user has approval
    if !hasApproval(ctx, project) {
        return fmt.Errorf("project creation requires approval from platform team")
    }
    
    // 2. Validate naming conventions
    if !isValidProjectName(project.Spec.Name) {
        return fmt.Errorf("project name must follow naming convention: [team]-[env]-[app]")
    }
    
    // 3. Check resource quotas
    if exceedsQuota(ctx, project) {
        return fmt.Errorf("project creation would exceed namespace quota")
    }
    
    return nil
}
```

**Mutating Admission Webhook**:
```go
// Webhook adds required labels and annotations
func (m *FlagsmithProjectMutator) MutateCreate(ctx context.Context, obj runtime.Object) error {
    project := obj.(*flagsmithv1.FlagsmithProject)
    
    // Add required labels
    if project.Labels == nil {
        project.Labels = make(map[string]string)
    }
    project.Labels["managed-by"] = "flagsmith-operator"
    project.Labels["created-by"] = getUserFromContext(ctx)
    
    // Add approval annotation
    if project.Annotations == nil {
        project.Annotations = make(map[string]string)
    }
    project.Annotations["approval-required"] = "true"
    project.Annotations["approval-status"] = "pending"
    
    return nil
}
```

### 3.2 Policy Engine Integration

**Option 1: Kyverno (Recommended for Kubernetes-native)**

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: flagsmith-project-approval
spec:
  validationFailureAction: enforce
  background: false
  rules:
    - name: require-approval-annotation
      match:
        any:
          - resources:
              kinds:
                - FlagsmithProject
      validate:
        message: "FlagsmithProject must have approval annotation"
        pattern:
          metadata:
            annotations:
              approval-status: "approved"
    
    - name: require-cost-center
      match:
        any:
          - resources:
              kinds:
                - FlagsmithProject
      validate:
        message: "FlagsmithProject must have cost-center label"
        pattern:
          metadata:
            labels:
              cost-center: "?*"
```

**Option 2: OPA Gatekeeper (For complex policies)**

```rego
package flagsmith.project.approval

deny[msg] {
    input.request.kind.kind == "FlagsmithProject"
    input.request.operation == "CREATE"
    not input.request.object.metadata.annotations["approval-status"] == "approved"
    msg := "FlagsmithProject creation requires approval"
}

deny[msg] {
    input.request.kind.kind == "FlagsmithProject"
    input.request.operation == "CREATE"
    not has_valid_approver(input.request.object)
    msg := "FlagsmithProject must be approved by platform team member"
}

has_valid_approver(project) {
    approver := project.metadata.annotations["approved-by"]
    approver_in_platform_team(approver)
}
```

### 3.3 Approval Workflow Implementation

**Workflow Architecture**:
```
User creates FlagsmithProject
    ↓
Mutating Webhook adds approval annotations
    ↓
Validating Webhook checks approval status → DENY (pending)
    ↓
User requests approval (external system)
    ↓
Approval System (Slack/ServiceNow/Custom)
    ↓
Approver reviews and approves
    ↓
Approval System updates annotation: approval-status=approved
    ↓
User resubmits FlagsmithProject
    ↓
Validating Webhook checks approval status → ALLOW
    ↓
Operator reconciles and creates Flagsmith project
```

**Approval CRD** (Optional):
```yaml
apiVersion: flagsmith.com/v1alpha1
kind: FlagsmithApproval
metadata:
  name: project-approval-123
  namespace: production
spec:
  resourceRef:
    apiVersion: flagsmith.com/v1alpha1
    kind: FlagsmithProject
    name: my-project
  
  requester: user@example.com
  reason: "New project for mobile app feature flags"
  
  approvers:
    - platform-team@example.com
  
  policy:
    requireAll: false  # Any approver can approve
    timeout: 7d

status:
  phase: Pending  # Pending, Approved, Rejected, Expired
  approvals:
    - approver: admin@example.com
      timestamp: "2024-01-01T00:00:00Z"
      decision: Approved
      comment: "LGTM"
  
  expiresAt: "2024-01-08T00:00:00Z"
```

### 3.4 Integration with External Systems

**Slack Approval Bot**:
```go
func (a *ApprovalController) notifySlack(ctx context.Context, approval *flagsmithv1.FlagsmithApproval) error {
    message := slack.WebhookMessage{
        Text: fmt.Sprintf("New Flagsmith Project Approval Request"),
        Attachments: []slack.Attachment{
            {
                Title: "Project: " + approval.Spec.ResourceRef.Name,
                Fields: []slack.AttachmentField{
                    {Title: "Requester", Value: approval.Spec.Requester},
                    {Title: "Reason", Value: approval.Spec.Reason},
                },
                Actions: []slack.AttachmentAction{
                    {
                        Name:  "approve",
                        Text:  "Approve",
                        Type:  "button",
                        Value: approval.Name,
                        Style: "primary",
                    },
                    {
                        Name:  "reject",
                        Text:  "Reject",
                        Type:  "button",
                        Value: approval.Name,
                        Style: "danger",
                    },
                },
            },
        },
    }
    
    return slack.PostWebhook(a.slackWebhookURL, &message)
}
```

---

## 4. Multi-Tenancy Architecture

### 4.1 Single-Tenant Model (Recommended)

**Architecture**:
- One Flagsmith instance per customer/tenant
- Complete isolation at infrastructure level
- Dedicated databases, Redis, and API servers
- Separate namespaces per tenant

**Benefits**:
- **Security**: Complete data isolation
- **Performance**: No noisy neighbor issues
- **Customization**: Per-tenant configuration
- **Compliance**: Easier to meet regulatory requirements
- **Billing**: Clear resource attribution

**Implementation**:
```yaml
# Tenant 1
apiVersion: flagsmith.com/v1alpha1
kind: FlagsmithInstance
metadata:
  name: tenant-acme-corp
  namespace: flagsmith-acme
spec:
  tenantID: "acme-corp"
  database:
    type: postgresql
    size: 20Gi
  api:
    replicas: 2
  ingress:
    host: acme.flagsmith.example.com

---
# Tenant 2
apiVersion: flagsmith.com/v1alpha1
kind: FlagsmithInstance
metadata:
  name: tenant-globex
  namespace: flagsmith-globex
spec:
  tenantID: "globex"
  database:
    type: postgresql
    size: 20Gi
  api:
    replicas: 2
  ingress:
    host: globex.flagsmith.example.com
```

### 4.2 Namespace Isolation

**Namespace per Tenant**:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: flagsmith-acme
  labels:
    tenant: acme-corp
    managed-by: flagsmith-operator

---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: flagsmith-quota
  namespace: flagsmith-acme
spec:
  hard:
    requests.cpu: "10"
    requests.memory: "20Gi"
    persistentvolumeclaims: "10"
    pods: "50"

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-cross-tenant
  namespace: flagsmith-acme
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              tenant: acme-corp
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              tenant: acme-corp
```

---

## 5. Technology Recommendations (Extended)

### 5.1 Policy Engine Selection

**Recommendation**: **Kyverno**

**Rationale**:
- ✅ Kubernetes-native (YAML policies)
- ✅ No new language to learn (vs Rego)
- ✅ Mutation + Validation + Generation
- ✅ CNCF Incubating project
- ✅ Easier for Kubernetes users
- ✅ Built-in policy library

**Alternative**: OPA Gatekeeper for complex logic

### 5.2 Approval Workflow Tools

**Options**:

1. **Custom CRD + Webhook** (Recommended for flexibility)
   - Full control over workflow
   - Kubernetes-native
   - Integrates with any external system

2. **Argo Workflows** (For complex multi-step approvals)
   - Workflow orchestration
   - Human-in-the-loop steps
   - Audit trail

3. **Tekton Pipelines** (For CI/CD integration)
   - Pipeline-based approvals
   - Integration with existing CI/CD

### 5.3 Helm Integration

**Helm Controller Library**:
```go
import (
    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/chart/loader"
)

func (r *FlagsmithInstanceReconciler) installFlagsmith(ctx context.Context, instance *flagsmithv1.FlagsmithInstance) error {
    // Create Helm action configuration
    actionConfig := new(action.Configuration)
    if err := actionConfig.Init(r.RESTClientGetter, instance.Namespace, "secret", log.Printf); err != nil {
        return err
    }
    
    // Load Flagsmith Helm chart
    chart, err := loader.Load("flagsmith-chart")
    if err != nil {
        return err
    }
    
    // Prepare values
    values := map[string]interface{}{
        "postgresql": map[string]interface{}{
            "enabled": true,
            "persistence": map[string]interface{}{
                "size": instance.Spec.Database.Size,
            },
        },
        "api": map[string]interface{}{
            "replicaCount": instance.Spec.API.Replicas,
        },
    }
    
    // Install or upgrade
    install := action.NewInstall(actionConfig)
    install.Namespace = instance.Namespace
    install.ReleaseName = instance.Name
    
    _, err = install.Run(chart, values)
    return err
}
```

---

## 6. Cascading to Other Agents

### 6.1 Impact on Product Manager

**Additional Functional Requirements**:
- `FlagsmithInstance` CRD for installation management
- `FlagsmithApproval` CRD for governance workflows
- RBAC roles for different user levels
- Policy enforcement specifications
- Multi-tenant namespace management

### 6.2 Impact on Architect

**Additional Architecture Components**:
- Admission webhook server
- Policy engine integration (Kyverno)
- Approval workflow system
- Helm chart integration
- Multi-tenant resource isolation
- External system integrations (Slack, ServiceNow)

**Additional NFRs**:
- Approval workflow SLAs
- Policy evaluation performance
- Multi-tenant isolation guarantees
- Audit logging requirements

### 6.3 Impact on Developers

**Additional Development Work**:
- Admission webhook implementation
- Helm chart integration
- Approval controller
- Policy engine integration
- Multi-tenant namespace management
- External API integrations

**Testing Requirements**:
- Webhook testing
- Policy validation testing
- Approval workflow testing
- Multi-tenant isolation testing
- RBAC testing

### 6.4 Impact on QA

**Additional Testing**:
- Admission webhook testing
- Policy enforcement testing
- Approval workflow end-to-end testing
- RBAC validation
- Multi-tenant isolation verification
- Security testing for governance controls

---

## 7. Updated Scope Summary

### Original Scope:
- ✅ Manage Flagsmith configuration (Projects, Environments, Flags)
- ✅ Kubernetes operator patterns
- ✅ Production-grade quality

### Extended Scope:
- ✅ **Manage Flagsmith installation** (full stack deployment)
- ✅ **RBAC** (multi-level access control)
- ✅ **Policy enforcement** (admission webhooks + Kyverno)
- ✅ **Approval workflows** (governance hooks)
- ✅ **Multi-tenancy** (single-tenant architecture)
- ✅ **OLM distribution** (Operator Lifecycle Manager)

---

## 8. Complexity Assessment

**Complexity Increase**: **HIGH**

**Original Estimate**: 2-3 months  
**Revised Estimate**: 4-6 months

**Breakdown**:
- Flagsmith Installation Management: +3 weeks
- RBAC Implementation: +1 week
- Policy Engine Integration: +2 weeks
- Approval Workflows: +3 weeks
- Multi-Tenant Architecture: +2 weeks
- Additional Testing: +2 weeks

---

## 9. Recommendations

### 9.1 Phased Approach

**Phase 1** (MVP - 2 months):
- Basic CRDs (Project, Environment, Flag)
- Flagsmith API integration
- Basic RBAC
- 80%+ test coverage

**Phase 2** (Governance - 1.5 months):
- Admission webhooks
- Kyverno policy integration
- Basic approval workflows

**Phase 3** (Installation - 1.5 months):
- FlagsmithInstance CRD
- Helm chart integration
- Multi-tenant support

**Phase 4** (Enterprise - 1 month):
- Advanced approval workflows
- External system integrations
- OLM packaging

### 9.2 Critical Success Factors

1. **Early Webhook Testing**: Admission webhooks are complex, test early
2. **Policy Library**: Build reusable policy templates
3. **Documentation**: Governance features need excellent docs
4. **User Feedback**: Get early feedback on approval workflows

---

**Status**: ✅ Complete  
**Next**: Update all agent charters with extended scope  
**Recommendation**: Review with user before proceeding to ensure alignment
