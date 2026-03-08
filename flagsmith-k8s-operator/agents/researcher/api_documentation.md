# Flagsmith API Documentation Reference

**Research Agent Deliverable**

## API Overview

Flagsmith provides two distinct REST APIs with different purposes and authentication mechanisms.

---

## 1. Flags API (Public SDK API)

### Purpose
Serve feature flags and remote configuration to client and server-side applications.

### Base URL
- **SaaS**: `https://edge.api.flagsmith.com/api/v1/`
- **Self-Hosted**: `https://your-flagsmith-instance.com/api/v1/`

### Authentication
```http
X-Environment-Key: <environment_key>
```

**Environment Key Characteristics**:
- Non-secret, can be exposed in client-side code
- Scoped to a specific environment
- Read-only access to flags for that environment
- No write permissions

### Key Endpoints

#### Get Flags for Environment
```http
GET /flags/
Headers:
  X-Environment-Key: <environment_key>
```

#### Get Flags for Identity
```http
GET /identities/?identifier=<user_id>
Headers:
  X-Environment-Key: <environment_key>
```

#### Get Specific Flag
```http
GET /flags/<flag_key>/
Headers:
  X-Environment-Key: <environment_key>
```

### Response Format
```json
{
  "flags": [
    {
      "id": 12345,
      "feature": {
        "id": 123,
        "name": "feature_name",
        "type": "FLAG"
      },
      "enabled": true,
      "feature_state_value": "value"
    }
  ]
}
```

---

## 2. Admin API (Private Admin API)

### Purpose
Programmatic management of Flagsmith resources (projects, environments, flags, segments, users).

### Base URL
- **SaaS**: `https://api.flagsmith.com/api/v1/`
- **Self-Hosted**: `https://your-flagsmith-instance.com/api/v1/`

### Authentication
```http
Authorization: Api-Key <organisation_api_token>
```

**Organisation API Token Characteristics**:
- **SECRET** - must never be exposed client-side
- Full administrative access to organization resources
- Can create, read, update, delete all resources
- Generated from Organization Settings → API Keys

### Key Endpoints for Operator

#### Projects

**List Projects**
```http
GET /projects/
Headers:
  Authorization: Api-Key <token>
```

**Create Project**
```http
POST /projects/
Headers:
  Authorization: Api-Key <token>
  Content-Type: application/json
Body:
{
  "name": "My Project",
  "organisation": <org_id>
}
```

**Get Project**
```http
GET /projects/<project_id>/
Headers:
  Authorization: Api-Key <token>
```

**Update Project**
```http
PUT /projects/<project_id>/
Headers:
  Authorization: Api-Key <token>
  Content-Type: application/json
Body:
{
  "name": "Updated Project Name"
}
```

**Delete Project**
```http
DELETE /projects/<project_id>/
Headers:
  Authorization: Api-Key <token>
```

#### Environments

**List Environments**
```http
GET /environments/
Headers:
  Authorization: Api-Key <token>
```

**Create Environment**
```http
POST /environments/
Headers:
  Authorization: Api-Key <token>
  Content-Type: application/json
Body:
{
  "name": "Production",
  "project": <project_id>
}
```

**Get Environment**
```http
GET /environments/<environment_id>/
Headers:
  Authorization: Api-Key <token>
```

#### Feature Flags

**List Features**
```http
GET /projects/<project_id>/features/
Headers:
  Authorization: Api-Key <token>
```

**Create Feature**
```http
POST /projects/<project_id>/features/
Headers:
  Authorization: Api-Key <token>
  Content-Type: application/json
Body:
{
  "name": "my_feature",
  "type": "FLAG",
  "default_enabled": false,
  "initial_value": "default_value"
}
```

**Update Feature**
```http
PUT /projects/<project_id>/features/<feature_id>/
Headers:
  Authorization: Api-Key <token>
  Content-Type: application/json
```

**Delete Feature**
```http
DELETE /projects/<project_id>/features/<feature_id>/
Headers:
  Authorization: Api-Key <token>
```

#### Feature States (Environment-specific flag values)

**Get Feature States for Environment**
```http
GET /environments/<environment_id>/featurestates/
Headers:
  Authorization: Api-Key <token>
```

**Update Feature State**
```http
PUT /environments/<environment_id>/featurestates/<featurestate_id>/
Headers:
  Authorization: Api-Key <token>
  Content-Type: application/json
Body:
{
  "enabled": true,
  "feature_state_value": "new_value"
}
```

#### Segments

**List Segments**
```http
GET /projects/<project_id>/segments/
Headers:
  Authorization: Api-Key <token>
```

**Create Segment**
```http
POST /projects/<project_id>/segments/
Headers:
  Authorization: Api-Key <token>
  Content-Type: application/json
Body:
{
  "name": "Beta Users",
  "rules": [...]
}
```

---

## 3. API Client Requirements for Operator

### Must-Have Features

1. **Authentication Management**
   - Store Organisation API Token securely (Kubernetes Secret)
   - Inject token in Authorization header
   - Support token rotation

2. **Error Handling**
   - Parse API error responses
   - Map to Kubernetes events
   - Implement retry logic with exponential backoff
   - Circuit breaker for repeated failures

3. **Rate Limiting**
   - Respect API rate limits
   - Implement client-side rate limiting
   - Queue requests if needed
   - Backoff on 429 responses

4. **Idempotency**
   - GET operations are naturally idempotent
   - PUT operations should be idempotent
   - POST operations may need existence checks first
   - DELETE operations should handle 404 gracefully

5. **Logging and Tracing**
   - Log all API requests (excluding sensitive data)
   - Correlation IDs for request tracing
   - Structured logging with logr interface
   - Integration with OpenTelemetry

6. **Testing**
   - Mock HTTP client for unit tests
   - Integration tests against real Flagsmith instance
   - Test error scenarios (network failures, API errors)

### Recommended Go Libraries

```go
// HTTP Client
import "net/http"

// JSON Handling
import "encoding/json"

// Retry Logic
import "github.com/cenkalti/backoff/v4"

// Rate Limiting
import "golang.org/x/time/rate"

// Logging
import "github.com/go-logr/logr"

// Testing
import "github.com/stretchr/testify/mock"
```

---

## 4. API Integration Patterns

### Pattern 1: Create-or-Update

```go
func (c *FlagsmithClient) CreateOrUpdateProject(ctx context.Context, name string, orgID int) (*Project, error) {
    // Try to find existing project
    projects, err := c.ListProjects(ctx)
    if err != nil {
        return nil, err
    }
    
    for _, p := range projects {
        if p.Name == name {
            // Update existing
            return c.UpdateProject(ctx, p.ID, name)
        }
    }
    
    // Create new
    return c.CreateProject(ctx, name, orgID)
}
```

### Pattern 2: Idempotent Delete

```go
func (c *FlagsmithClient) DeleteProject(ctx context.Context, projectID int) error {
    err := c.deleteProjectAPI(ctx, projectID)
    if err != nil {
        // Check if 404 (already deleted)
        if isNotFoundError(err) {
            return nil // Idempotent success
        }
        return err
    }
    return nil
}
```

### Pattern 3: Retry with Backoff

```go
func (c *FlagsmithClient) CreateProjectWithRetry(ctx context.Context, name string, orgID int) (*Project, error) {
    var project *Project
    var err error
    
    operation := func() error {
        project, err = c.CreateProject(ctx, name, orgID)
        return err
    }
    
    backoffStrategy := backoff.NewExponentialBackOff()
    err = backoff.Retry(operation, backoffStrategy)
    
    return project, err
}
```

---

## 5. Security Considerations

### Token Storage
- **Never hardcode** Organisation API Token
- Store in Kubernetes Secret
- Reference Secret in operator configuration
- Support token rotation without operator restart

### Network Security
- Use HTTPS for all API calls
- Validate TLS certificates
- Support custom CA certificates for self-hosted
- Network policies to restrict egress

### Audit Logging
- Log all Admin API operations
- Include user context (which CRD triggered the call)
- Exclude sensitive data from logs
- Emit Kubernetes Events for visibility

---

## 6. API Versioning

### Current Version
- API Version: `v1`
- Stable and production-ready
- Backward compatibility maintained

### Future Considerations
- Monitor Flagsmith release notes for API changes
- Version operator API client separately
- Support multiple API versions if needed
- Integration tests to detect breaking changes

---

## 7. Complete API Documentation

For complete API reference, see:
- **Admin API**: https://api.flagsmith.com/api/v1/docs/
- **Flags API**: https://docs.flagsmith.com/integrating-with-flagsmith/flagsmith-api-overview/flags-api
- **OpenAPI Spec**: Available at `/api/v1/docs/?format=openapi`

---

## 8. Operator-Specific Recommendations

### For Project Controller
- Use Admin API `/projects/` endpoints
- Implement create-or-update pattern
- Store project ID in CRD status
- Handle project deletion with finalizers

### For Environment Controller
- Use Admin API `/environments/` endpoints
- Store environment API key in Kubernetes Secret
- Reference parent project by ID
- Update status with environment details

### For FeatureFlag Controller
- Use Admin API `/projects/<id>/features/` endpoints
- Manage feature states per environment
- Support flag types (FLAG, CONFIG, MULTIVARIATE)
- Handle default values and overrides

---

**Status**: ✅ Complete  
**Next**: Product Manager to define CRD specifications based on API capabilities
