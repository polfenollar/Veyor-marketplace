# Kubernetes Operator Patterns & Best Practices

**Research Agent Deliverable**

## Table of Contents
1. [Operator Pattern Overview](#1-operator-pattern-overview)
2. [Core Design Principles](#2-core-design-principles)
3. [Controller Implementation](#3-controller-implementation)
4. [Custom Resource Definitions](#4-custom-resource-definitions)
5. [Reconciliation Loop](#5-reconciliation-loop)
6. [Error Handling](#6-error-handling)
7. [Testing Strategies](#7-testing-strategies)
8. [Production Readiness](#8-production-readiness)

---

## 1. Operator Pattern Overview

### What is an Operator?

An operator is a method of packaging, deploying, and managing a Kubernetes application. Operators encode human operational knowledge into software that can automatically manage complex applications.

**Key Characteristics**:
- Extends Kubernetes API with Custom Resources
- Implements application-specific operational logic
- Continuously reconciles desired state with actual state
- Automates Day 1 (deployment) and Day 2 (operations) tasks

### Operator Maturity Model

1. **Level 1 - Basic Install**: Automated application provisioning
2. **Level 2 - Seamless Upgrades**: Automated upgrades and patches
3. **Level 3 - Full Lifecycle**: Backup, restore, failure recovery
4. **Level 4 - Deep Insights**: Metrics, alerts, log processing
5. **Level 5 - Auto Pilot**: Horizontal/vertical scaling, auto-tuning, abnormality detection

**Target for Flagsmith Operator**: Level 3-4

---

## 2. Core Design Principles

### 2.1 Level-Based Reconciliation

**Principle**: Controllers should react to the current state of the system, not individual events.

```go
// GOOD: Level-based
func (r *Reconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    // Fetch current state
    var resource MyResource
    if err := r.Get(ctx, req.NamespacedName, &resource); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }
    
    // Compute desired state
    desiredState := computeDesiredState(&resource)
    
    // Make actual state match desired state
    return r.reconcileState(ctx, &resource, desiredState)
}

// BAD: Event-based
func (r *Reconciler) OnCreate(obj runtime.Object) {
    // Don't do this - react to current state, not events
}
```

### 2.2 Idempotency

**Principle**: Reconciliation must be safe to run multiple times without changing the result.

```go
// GOOD: Idempotent
func (r *Reconciler) ensureDeployment(ctx context.Context, desired *appsv1.Deployment) error {
    var existing appsv1.Deployment
    err := r.Get(ctx, client.ObjectKeyFromObject(desired), &existing)
    
    if errors.IsNotFound(err) {
        // Create if doesn't exist
        return r.Create(ctx, desired)
    } else if err != nil {
        return err
    }
    
    // Update if exists and different
    if !reflect.DeepEqual(existing.Spec, desired.Spec) {
        existing.Spec = desired.Spec
        return r.Update(ctx, &existing)
    }
    
    return nil // Already in desired state
}
```

### 2.3 Single Responsibility

**Principle**: Each operator should manage one application or closely related set of resources.

- ✅ **Good**: Flagsmith Operator manages Flagsmith resources only
- ❌ **Bad**: Flagsmith Operator also manages PostgreSQL, Redis, Nginx, etc.

### 2.4 Asynchronous Operations

**Principle**: Don't block reconciliation on long-running operations.

```go
// GOOD: Asynchronous
func (r *Reconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    // Start long operation
    if !operationStarted {
        startBackupOperation()
        return ctrl.Result{RequeueAfter: 10 * time.Second}, nil
    }
    
    // Check operation status
    if !operationComplete {
        return ctrl.Result{RequeueAfter: 10 * time.Second}, nil
    }
    
    // Operation complete, proceed
    return ctrl.Result{}, nil
}

// BAD: Synchronous blocking
func (r *Reconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    // This blocks the reconciliation loop!
    waitForBackupToComplete() // Could take hours
    return ctrl.Result{}, nil
}
```

---

## 3. Controller Implementation

### 3.1 Controller Structure

```go
type FlagsmithProjectReconciler struct {
    client.Client
    Scheme         *runtime.Scheme
    Recorder       record.EventRecorder
    FlagsmithClient *flagsmith.Client
}

func (r *FlagsmithProjectReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    log := log.FromContext(ctx)
    
    // 1. Fetch the resource
    var project flagsmithv1.FlagsmithProject
    if err := r.Get(ctx, req.NamespacedName, &project); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }
    
    // 2. Handle deletion (finalizers)
    if !project.DeletionTimestamp.IsZero() {
        return r.handleDeletion(ctx, &project)
    }
    
    // 3. Add finalizer if not present
    if !controllerutil.ContainsFinalizer(&project, finalizerName) {
        controllerutil.AddFinalizer(&project, finalizerName)
        return ctrl.Result{}, r.Update(ctx, &project)
    }
    
    // 4. Reconcile the resource
    return r.reconcileProject(ctx, &project)
}
```

### 3.2 Watches and Predicates

**Efficient Event Filtering**:

```go
func (r *FlagsmithProjectReconciler) SetupWithManager(mgr ctrl.Manager) error {
    return ctrl.NewControllerManagedBy(mgr).
        For(&flagsmithv1.FlagsmithProject{}).
        WithEventFilter(predicate.Funcs{
            // Only reconcile on spec changes, not status updates
            UpdateFunc: func(e event.UpdateEvent) bool {
                oldObj := e.ObjectOld.(*flagsmithv1.FlagsmithProject)
                newObj := e.ObjectNew.(*flagsmithv1.FlagsmithProject)
                return !reflect.DeepEqual(oldObj.Spec, newObj.Spec)
            },
            // Ignore delete events (handled by finalizers)
            DeleteFunc: func(e event.DeleteEvent) bool {
                return false
            },
        }).
        Complete(r)
}
```

### 3.3 Leader Election

**High Availability Setup**:

```go
func main() {
    mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), ctrl.Options{
        Scheme:                 scheme,
        MetricsBindAddress:     ":8080",
        HealthProbeBindAddress: ":8081",
        LeaderElection:         true,
        LeaderElectionID:       "flagsmith-operator-leader",
        LeaderElectionNamespace: "flagsmith-system",
    })
}
```

---

## 4. Custom Resource Definitions

### 4.1 CRD Best Practices

**Minimal and Focused**:
```yaml
apiVersion: flagsmith.com/v1alpha1
kind: FlagsmithProject
metadata:
  name: my-project
spec:
  # Keep spec minimal - only user-configurable fields
  name: "My Project"
  description: "Project description"
  organizationRef:
    name: my-org-secret
status:
  # Status reflects observed state
  projectID: "12345"
  phase: "Ready"
  conditions:
    - type: Ready
      status: "True"
      lastTransitionTime: "2024-01-01T00:00:00Z"
```

### 4.2 Validation

**OpenAPI Schema Validation**:
```go
// +kubebuilder:validation:Required
// +kubebuilder:validation:MinLength=1
// +kubebuilder:validation:MaxLength=255
Name string `json:"name"`

// +kubebuilder:validation:Enum=FLAG;CONFIG;MULTIVARIATE
Type string `json:"type"`

// +kubebuilder:validation:Minimum=0
// +kubebuilder:validation:Maximum=100
Priority int `json:"priority,omitempty"`
```

**Webhook Validation** (for complex logic):
```go
func (r *FlagsmithProject) ValidateCreate() error {
    if r.Spec.Name == "" {
        return fmt.Errorf("project name cannot be empty")
    }
    // Complex validation logic
    return nil
}
```

### 4.3 Status Subresource

**Always use status subresource**:
```go
// +kubebuilder:subresource:status
type FlagsmithProject struct {
    metav1.TypeMeta   `json:",inline"`
    metav1.ObjectMeta `json:"metadata,omitempty"`
    
    Spec   FlagsmithProjectSpec   `json:"spec,omitempty"`
    Status FlagsmithProjectStatus `json:"status,omitempty"`
}
```

**Benefits**:
- Status updates don't trigger reconciliation
- Separate RBAC for spec vs status
- Prevents reconciliation loops

---

## 5. Reconciliation Loop

### 5.1 Reconciliation Pattern

```go
func (r *Reconciler) reconcileProject(ctx context.Context, project *flagsmithv1.FlagsmithProject) (ctrl.Result, error) {
    // 1. Validate prerequisites
    if err := r.validatePrerequisites(ctx, project); err != nil {
        r.Recorder.Event(project, "Warning", "ValidationFailed", err.Error())
        return ctrl.Result{RequeueAfter: 30 * time.Second}, nil
    }
    
    // 2. Create or update Flagsmith project
    flagsmithProject, err := r.FlagsmithClient.CreateOrUpdateProject(ctx, project.Spec.Name)
    if err != nil {
        r.Recorder.Event(project, "Warning", "APIError", err.Error())
        return ctrl.Result{RequeueAfter: 1 * time.Minute}, err
    }
    
    // 3. Update status
    project.Status.ProjectID = flagsmithProject.ID
    project.Status.Phase = "Ready"
    if err := r.Status().Update(ctx, project); err != nil {
        return ctrl.Result{}, err
    }
    
    // 4. Emit success event
    r.Recorder.Event(project, "Normal", "Synced", "Project synced successfully")
    
    return ctrl.Result{}, nil
}
```

### 5.2 Requeue Strategies

```go
// Immediate requeue
return ctrl.Result{Requeue: true}, nil

// Requeue after delay
return ctrl.Result{RequeueAfter: 5 * time.Minute}, nil

// No requeue (success)
return ctrl.Result{}, nil

// Error (automatic exponential backoff)
return ctrl.Result{}, err
```

---

## 6. Error Handling

### 6.1 Error Classification

```go
func (r *Reconciler) handleError(ctx context.Context, obj client.Object, err error) (ctrl.Result, error) {
    switch {
    case isTransientError(err):
        // Retry with backoff
        return ctrl.Result{RequeueAfter: 30 * time.Second}, nil
        
    case isPermanentError(err):
        // Don't retry, emit event
        r.Recorder.Event(obj, "Warning", "PermanentError", err.Error())
        return ctrl.Result{}, nil
        
    case isRateLimitError(err):
        // Backoff longer
        return ctrl.Result{RequeueAfter: 5 * time.Minute}, nil
        
    default:
        // Unknown error, retry with exponential backoff
        return ctrl.Result{}, err
    }
}
```

### 6.2 Event Emission

```go
// Success
r.Recorder.Event(project, "Normal", "Created", "Project created successfully")

// Warning
r.Recorder.Event(project, "Warning", "APIError", "Failed to sync with Flagsmith API")

// Error
r.Recorder.Event(project, "Warning", "ReconciliationFailed", err.Error())
```

---

## 7. Testing Strategies

### 7.1 Unit Tests

```go
func TestProjectReconciler(t *testing.T) {
    // Setup
    scheme := runtime.NewScheme()
    _ = flagsmithv1.AddToScheme(scheme)
    
    client := fake.NewClientBuilder().
        WithScheme(scheme).
        WithObjects(&flagsmithv1.FlagsmithProject{...}).
        Build()
    
    reconciler := &FlagsmithProjectReconciler{
        Client: client,
        FlagsmithClient: mockFlagsmithClient,
    }
    
    // Test
    result, err := reconciler.Reconcile(ctx, req)
    
    // Assert
    assert.NoError(t, err)
    assert.Equal(t, ctrl.Result{}, result)
}
```

### 7.2 Integration Tests (envtest)

```go
var _ = Describe("FlagsmithProject Controller", func() {
    Context("When reconciling a resource", func() {
        It("should create a Flagsmith project", func() {
            By("Creating a FlagsmithProject resource")
            project := &flagsmithv1.FlagsmithProject{...}
            Expect(k8sClient.Create(ctx, project)).To(Succeed())
            
            By("Checking the project status")
            Eventually(func() string {
                _ = k8sClient.Get(ctx, key, project)
                return project.Status.Phase
            }, timeout, interval).Should(Equal("Ready"))
        })
    })
})
```

---

## 8. Production Readiness

### 8.1 Observability

**Metrics**:
```go
var (
    reconciliationDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name: "flagsmith_operator_reconciliation_duration_seconds",
            Help: "Duration of reconciliation loops",
        },
        []string{"controller", "result"},
    )
)

func (r *Reconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    start := time.Now()
    defer func() {
        reconciliationDuration.WithLabelValues("project", "success").Observe(time.Since(start).Seconds())
    }()
    // ... reconciliation logic
}
```

**Health Checks**:
```go
mgr.AddHealthzCheck("healthz", healthz.Ping)
mgr.AddReadyzCheck("readyz", healthz.Ping)
```

### 8.2 RBAC

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: flagsmith-operator
rules:
  - apiGroups: ["flagsmith.com"]
    resources: ["flagsmithprojects"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  - apiGroups: ["flagsmith.com"]
    resources: ["flagsmithprojects/status"]
    verbs: ["get", "update", "patch"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create", "patch"]
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list", "watch"]
```

---

**Status**: ✅ Complete  
**Next**: Architect to design operator architecture based on these patterns
