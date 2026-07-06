# GitHub Workflow: Sprint 3 Issues & PR Templates

## How to Use Issues & PRs

### Creating an Issue

1. Go to your GitHub repository → **Issues** tab
2. Click **New issue**
3. Select appropriate template below
4. Fill in all required fields
5. Assign to team member
6. Add labels (Type/, Priority/, Status/, Team/)
7. Add to Sprint 3 project board

---

# ISSUE TEMPLATES

## Issue Template 1: Story/Feature

```markdown
## Story: [Story Title]

**Epic:** [Content Management System]
**Assigned to:** [Team Member]
**Priority:** [Critical/High/Medium/Low]
**Story Points:** [8/13]

### Description
As a [actor], I want to [action] so that [benefit].

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
- [ ] Criterion 4
- [ ] Criterion 5

### Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Notes
- Important implementation detail
- Potential gotcha

### Definition of Done
- [ ] Code written
- [ ] Unit tests written (80%+ coverage)
- [ ] Code reviewed
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] No console errors/warnings

### Related Issues
- Depends on: [Issue #X]
- Blocked by: [Issue #X]
- Relates to: [Issue #X]
```

## Issue Template 2: API Endpoint

```markdown
## API Endpoint: [Method] /api/path

**Assigned to:** [Ngam]
**Priority:** [Critical/High]
**Complexity:** [Simple/Medium/Complex]

### Endpoint Specification

**Method:** [GET/POST/PUT/DELETE]
**Path:** `/api/content/create`
**Authentication:** Bearer token required

### Request
```json
{
  "field1": "value",
  "field2": 123
}
```

### Response (Success)
```json
{
  "id": "uuid",
  "field1": "value",
  "created_at": "2026-03-12T00:00:00Z"
}
```

### Response (Error)
```json
{
  "error": "Error message",
  "status": 400
}
```

### Implementation Checklist
- [ ] Request validation
- [ ] Authentication check
- [ ] Database operation
- [ ] Response formatting
- [ ] Error handling
- [ ] Logging
- [ ] Rate limiting (if applicable)
- [ ] Tests written

### Notes
- Consider caching strategy
- Check for race conditions
- Validate input sanitization
```

## Issue Template 3: Component/UI

```markdown
## Component: [Component Name]

**Assigned to:** [Asime]
**Type:** [React Component/Page/Modal]
**Priority:** [High]

### Description
[Component purpose and responsibility]

### Props/Parameters
```typescript
interface Props {
  prop1: string;
  prop2: boolean;
  onAction: () => void;
}
```

### Component Requirements
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Loading states
- [ ] Error handling
- [ ] Success feedback (toast/notification)
- [ ] Data validation
- [ ] Keyboard navigation

### Design Reference
[Link to Figma/Design mockup or screenshot]

### Testing Checklist
- [ ] Unit tests written
- [ ] Manual testing on mobile
- [ ] Manual testing on desktop
- [ ] Accessibility tested
- [ ] Screenshot added to PR

### Dependencies
- Requires API endpoint: [spec reference]
- Requires component: [component reference]
```

## Issue Template 4: Bug Report

```markdown
## Bug: [Brief Description]

**Severity:** [Critical/High/Medium/Low]
**Affected Component:** [Component/Page/API]

### Description
[What happened vs what should have happened]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots/Logs
[Attach images or error logs]

### Environment
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Version: [Branch/Commit hash]

### Possible Cause
[If known]

### Potential Fix
[If known]

### Related Issues
- [Issue #X]
- [Issue #X]
```

## Issue Template 5: Database Schema

```markdown
## Schema Migration: [Description]

**Assigned to:** [Ngam]
**Priority:** [Critical]

### SQL Migration
```sql
-- Drop existing if updating
DROP TABLE IF EXISTS table_name;

-- Create new table
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column1 VARCHAR(255) NOT NULL,
  column2 INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_name ON table_name(column1);
```

### Rollback Script
```sql
DROP TABLE table_name;
```

### Migration Checklist
- [ ] Tested locally
- [ ] No data loss
- [ ] Indexes created for foreign keys
- [ ] Constraints validated
- [ ] Query performance tested
- [ ] Backup created before migration
```

---

# PR TEMPLATES

## Pull Request Template

```markdown
## Description
[Brief description of changes]

## Related Issue
Closes #[issue number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
- [ ] Unit tests added
- [ ] Integration tests passed
- [ ] Manual testing completed
- [ ] No regressions found

### Test Results
[Describe test coverage and results]

## Screenshots/Demo
[If applicable, add screenshots or links]

## Checklist
- [ ] Code follows project style guide
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] Dependent changes merged
- [ ] No merge conflicts

## Performance Impact
[Describe any performance changes]

## Breaking Changes
[If applicable, describe breaking changes and migration path]

## Deployment Notes
[Any deployment considerations]

## Reviewers
@asime @ngam @victory @boyem

## Labels
Add appropriate labels before submitting
```

---

# GITHUB PROJECT BOARD WORKFLOW

## Sprint 3 Board Setup

### Columns
1. **Backlog** - Not started
2. **Ready** - Refined and ready to start
3. **In Progress** - Currently being worked on
4. **In Review** - PR submitted, waiting for approval
5. **Testing** - Deployed to staging, waiting for QA
6. **Done** - Completed and merged

### Moving Cards

**Backlog → Ready**
- Acceptance criteria clear
- Assigned to team member
- Dependencies resolved
- Estimated story points

**Ready → In Progress**
- Team member starts work
- Create feature branch from develop
- Update issue status

**In Progress → In Review**
- Create Pull Request
- Link to issue
- Request reviewers
- Add screenshots

**In Review → Testing**
- PR approved
- Merged to staging branch
- Deploy to staging environment
- Notify QA

**Testing → Done**
- All tests passed
- No bugs found
- Merged to main
- Deployed to production

### Automation Rules
```
When PR is created → Move to "In Review"
When PR is merged → Move to "Testing"
When issue is closed → Move to "Done"
```

---

# TEAM MEMBER CHECKLIST

## Asime (Content Posting & Profile)
- [ ] Read SPRINT3_IMPLEMENTATION_GUIDE.md
- [ ] Review ContentUploadForm component code
- [ ] Review ProfileEditModal component code
- [ ] Understand browser-image-compression library
- [ ] Setup Supabase storage bucket permissions
- [ ] Test with Ngam's API endpoints
- [ ] Create components in proper structure
- [ ] Write unit tests for each component
- [ ] Test on mobile and desktop
- [ ] Create PR with screenshots

## Ngam (Backend APIs)
- [ ] Read SPRINT3_IMPLEMENTATION_GUIDE.md
- [ ] Review all API endpoint specifications
- [ ] Create database migrations
- [ ] Test all endpoints with Postman/curl
- [ ] Setup Supabase storage for file uploads
- [ ] Implement proper error handling
- [ ] Add request validation
- [ ] Write API documentation
- [ ] Create integration tests
- [ ] Coordinate with Asime for component integration

## Victory (Real Data & Analytics)
- [ ] Read SPRINT3_IMPLEMENTATION_GUIDE.md
- [ ] Review all custom hooks
- [ ] Install SWR or React Query
- [ ] Replace mock data in components
- [ ] Implement analytics dashboard
- [ ] Setup caching strategy
- [ ] Test with real data from Ngam's API
- [ ] Verify analytics accuracy
- [ ] Optimize for performance
- [ ] Create PR with before/after screenshots

## Boyem (Admin Verification)
- [ ] Read SPRINT3_IMPLEMENTATION_GUIDE.md
- [ ] Review VerificationQueue component
- [ ] Implement approval/rejection endpoint
- [ ] Setup SendGrid email templates
- [ ] Create verification analytics page
- [ ] Test email delivery
- [ ] Implement audit logging
- [ ] Create admin dashboard widgets
- [ ] Test end-to-end workflow
- [ ] Create PR with admin workflow screenshots

---

# DAILY STANDUP TEMPLATE

```markdown
## Sprint 3 - Daily Standup [Date]

### Asime - Content Posting & Profile
**Yesterday:**
- Completed: [Task]
- Completed: [Task]

**Today:**
- Working on: [Task]
- Working on: [Task]

**Blockers:** None / [Description of blocker]

**Help Needed:** None / [What help is needed from whom]

---

### Ngam - Backend APIs
**Yesterday:**
- Completed: [Endpoint]
- Completed: [Endpoint]

**Today:**
- Working on: [Endpoint]
- Working on: [Endpoint]

**Blockers:** None / [Description]

**Help Needed:** None / [Description]

---

### Victory - Real Data Integration
**Yesterday:**
- Completed: [Task]
- Completed: [Task]

**Today:**
- Working on: [Task]
- Working on: [Task]

**Blockers:** None / [Description]

**Help Needed:** None / [Description]

---

### Boyem - Admin Verification
**Yesterday:**
- Completed: [Task]
- Completed: [Task]

**Today:**
- Working on: [Task]
- Working on: [Task]

**Blockers:** None / [Description]

**Help Needed:** None / [Description]

---

### Action Items
- [ ] Action for team
- [ ] Action assigned to [Team member]
```

---

# HOW TO LABEL ISSUES

## Type Labels
- `type/feature` - New feature
- `type/bug` - Bug fix
- `type/enhancement` - Enhancement to existing feature
- `type/docs` - Documentation
- `type/refactor` - Code refactoring

## Priority Labels
- `priority/critical` - Blocks other work, must do first
- `priority/high` - Important, do soon
- `priority/medium` - Important but not urgent
- `priority/low` - Nice to have

## Status Labels
- `status/backlog` - Not started
- `status/in-progress` - Currently being worked on
- `status/in-review` - PR submitted
- `status/testing` - In staging, waiting for QA
- `status/blocked` - Waiting on something
- `status/done` - Completed and merged

## Team Labels
- `team/frontend` - Frontend work
- `team/backend` - Backend work
- `team/devops` - DevOps/Infrastructure
- `team/qa` - Testing

## Category Labels
- `category/content` - Content management
- `category/auth` - Authentication
- `category/admin` - Admin features
- `category/analytics` - Analytics
- `category/ui` - UI/UX
- `category/api` - API endpoints

---

# EXAMPLE SPRINT 3 ISSUES

Click links below to create issues using these templates:

## Week 1: Foundation

1. **[Create] Story: Creator Content Posting**
   - Type: Feature
   - Priority: Critical
   - Points: 13
   - Assignee: Asime

2. **[Create] API: POST /api/content/create**
   - Type: Feature
   - Priority: Critical
   - Points: 8
   - Assignee: Ngam

3. **[Create] Schema: Create content table**
   - Type: Enhancement
   - Priority: Critical
   - Points: 5
   - Assignee: Ngam

## Week 2: Integration

4. **[Create] Story: Real Data Integration**
   - Type: Feature
   - Priority: Critical
   - Points: 13
   - Assignee: Victory

5. **[Create] Story: Admin Verification**
   - Type: Feature
   - Priority: Critical
   - Points: 13
   - Assignee: Boyem

## Week 3-4: Testing & Polish

6. **[Create] Bug: [Found during testing]**
7. **[Create] Enhancement: Performance optimization**
8. **[Create] Docs: API documentation**

---

# DEPLOYMENT CHECKLIST

Before moving to production:

- [ ] All sprint stories completed
- [ ] All PRs merged to main
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Performance acceptable
- [ ] Staging thoroughly tested
- [ ] Admin approved deployment
- [ ] Deployment script ready
- [ ] Rollback plan prepared
- [ ] Post-deployment monitoring setup
