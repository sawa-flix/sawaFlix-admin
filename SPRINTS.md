# SawaFlix Development Sprints

## Project Overview
**SawaFlix** is a content creators platform for African culture - music, movies, and storytelling. It features a tiered authentication system (Viewers, Creators, Admins) with OTP verification, creator verification workflows, and a content management dashboard.

---

# Sprint 1: Foundation & Authentication (Completed ✅)

## Sprint Goal
Establish core infrastructure, authentication system, and basic UI framework.

## Completed Tasks

### 1. Project Setup & Infrastructure
- ✅ Next.js 15 project with TypeScript/JSX support
- ✅ Tailwind CSS with DaisyUI components
- ✅ Supabase integration (authentication & database)
- ✅ Redis integration for OTP rate limiting
- ✅ SendGrid email service setup
- ✅ Environment variables configuration

### 2. Authentication System
- ✅ OTP verification flow (`/api/otp/send`, `/api/otp/verify`)
- ✅ Rate limiting (5 requests per 15 minutes)
- ✅ Email template system via SendGrid
- ✅ Redis OTP storage (5-min expiration)
- ✅ JWT token management

### 3. User Role System
- ✅ Three-tier role hierarchy: Viewer, Creator (pending), Admin
- ✅ Role-based middleware (route protection)
- ✅ Verification status tracking: pending, approved, rejected
- ✅ User profile schema in Supabase

### 4. Core UI Components
- ✅ Navigation/Navbar
- ✅ Footer
- ✅ Landing page
- ✅ Basic dashboard layout
- ✅ Modal & Toast components
- ✅ Loading skeletons

### 5. Authentication Routes
- ✅ `/auth/sign-up` - User registration
- ✅ `/auth/login` - User login
- ✅ `/verify-otp` - OTP verification
- ✅ `/update-password` - Password recovery

## Tech Stack
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Cache: Redis (Upstash)
- Email: SendGrid
- Auth: Supabase Auth + Custom JWT

---

# Sprint 2: Creator Verification & Admin Dashboard (Completed ✅)

## Sprint Goal
Build creator onboarding wizard, verification workflows, and admin management interface.

## Completed Tasks

### 1. Creator Onboarding Wizard
- ✅ Multi-step wizard UI (5 steps)
- ✅ Step 1: Category selection (Music, Movies, Storytelling)
- ✅ Step 2: Identity verification (Name, Email, Phone)
- ✅ Step 3: Professional info (Bio, Skills, Links)
- ✅ Step 4: Portfolio upload
- ✅ Step 5: Documents & summary
- ✅ Progress bar with step navigation
- ✅ Form validation and error handling
- ✅ Data persistence across steps

### 2. Creator Verification System
- ✅ Verification status tracking in database
- ✅ Creator profile creation on first approval
- ✅ Rejection workflow with feedback
- ✅ Pending state UI for creators
- ✅ Verification queue management

### 3. Admin Dashboard
- ✅ Admin authentication & role check
- ✅ Admin layout with sidebar navigation
- ✅ Verification queue page
- ✅ Creator verification card details
- ✅ Accept/Reject action buttons
- ✅ Creator profile viewing in admin panel

### 4. Content Data Model
- ✅ Content types: Music, Movies, Stories
- ✅ Mock data structure in JSON
- ✅ Content categorization
- ✅ Feed data integration

### 5. Creator Profile Pages
- ✅ Public creator portfolio page (`/creator/[username]`)
- ✅ Creator profile viewing
- ✅ Featured works display
- ✅ Creator bio & links

## Components Built
- `CreatorWizard` - Main wizard container
- `Step1Category`, `Step2Professional`, `Step3Portfolio`, etc.
- `VerificationQueue` - Admin verification list
- `VerificationDetails` - Detailed creator info display
- `AdminSidebar` - Admin navigation
- `ApprovedDashboard` - Creator dashboard after approval
- `PendingState` - UI for pending verification
- `RejectedState` - UI for rejected applications

## API Endpoints
- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP
- `GET/POST /api/creator/profile` - Creator profile CRUD
- `GET /api/admin/verifications` - Get pending verifications
- `POST /api/admin/verify` - Accept/Reject creator

---

# Sprint 3: Content Management & Creator Dashboard (In Progress 🔄)

## Sprint Goal
Enable creators to post content, edit profiles, and implement comprehensive admin verification system. Fetch real data from APIs to creator dashboard.

## Team Assignments

### Asime - Creator Content Posting & Profile Management
**Objectives:**
- Create content posting interface in Creator Dashboard
- Build profile editing functionality
- Implement content edit/delete capabilities
- Create content drafts system

**Tasks:**
1. **Content Posting Feature** (`/creator-dashboard/post`)
   - Multi-step content upload form
   - Support for: Music, Movies, Stories
   - File upload with browser-image-compression
   - Thumbnail/cover image handling
   - Title, description, tags, categories
   - Draft saving before publish
   - Success/error notifications

2. **Profile Edit Page** (`/creator-dashboard/settings`)
   - Edit bio, creator name, profile picture
   - Social media links
   - Category preferences
   - Email notifications settings
   - Banner image update

3. **My Content Section** (`/creator-dashboard/content`)
   - List all creator's posted content
   - Edit content button → modal form
   - Delete content with confirmation
   - Content status (published, draft, archived)
   - Sort & filter by date, type, views

4. **Components to Create:**
   - `ContentUploadForm.jsx` - Main upload form
   - `ProfileEditModal.jsx` - Profile editing
   - `ContentEditModal.jsx` - Edit existing content
   - `DraftsList.jsx` - Show draft content
   - `ContentTypeSelector.jsx` - Music/Movie/Story selector

**Acceptance Criteria:**
- Creator can upload content in all 3 categories
- Profile fields save to Supabase
- Content appears in "My Content" section
- Edit/delete functions work without page reload
- Toast notifications for actions

---

### Ngam - Backend API Endpoints for Content Management
**Objectives:**
- Create RESTful endpoints for content operations
- Implement database schema updates
- Set up proper authentication/authorization
- Handle file uploads and storage

**Tasks:**
1. **Content CRUD Endpoints**
   - `POST /api/content/create` - Create new content
   - `GET /api/content/[id]` - Fetch single content
   - `PUT /api/content/[id]` - Update content
   - `DELETE /api/content/[id]` - Delete content
   - `GET /api/creator/content` - Get creator's all content

2. **Content Upload Handler**
   - `POST /api/upload/content` - Handle file uploads
   - Image compression and optimization
   - Supabase storage integration
   - Generate thumbnails
   - Virus scan integration (optional)

3. **Profile Update Endpoints**
   - `PUT /api/creator/profile/edit` - Update profile info
   - `POST /api/creator/profile/upload-picture` - Upload avatar
   - `POST /api/creator/profile/upload-banner` - Upload banner
   - Validation for all fields

4. **Content Query Endpoints**
   - `GET /api/content/by-category` - Filter by category
   - `GET /api/content/trending` - Trending content
   - `GET /api/content/recent` - Recent uploads
   - Pagination support


**Acceptance Criteria:**
- All endpoints return proper HTTP status codes
- Request validation on all endpoints
- Authentication check on protected routes
- Database transactions for atomic operations
- Error responses with descriptive messages

---

###    Beleh - Real Data Integration to Creator Dashboard
**Objectives:**
- Replace mock data with API calls
- Build real-time data fetching
- Implement caching for performance
- Create analytics calculations

**Tasks:**
1. **Dashboard Data Fetching** (`/creator-dashboard`)
   - Replace mock feedData with API calls to `/api/creator/content`
   - Fetch creator stats (views, likes, followers)
   - Calculate total uploads count
   - Fetch recent uploads with pagination

2. **Analytics Implementation** (`/creator-dashboard/analytics`)
   - Fetch content performance data
   - Build charts for views/likes over time
   - Create revenue/earnings breakdown
   - Weekly/monthly comparison

3. **Content Section** (`/creator-dashboard/content`)
   - List all creator's real content from API
   - Real-time view count updates
   - Like/engagement metrics
   - Search and filter functionality

4. **Earnings Section** (`/creator-dashboard/earnings`)
   - Calculate earnings from each content
   - Platform share calculation
   - Payment history
   - Pending payouts

5. **Components to Update:**
   - `CreatorDashboard.jsx` - Connect to real data
   - `PerformanceChart.jsx` - Use real analytics data
   - `ContentTable.jsx` - Display real content
   - `ReelsSection.jsx` - Fetch from API

6. **Implement Caching Strategy**
   - Use React Query or SWR for data fetching
   - Cache content data (5 min TTL)
   - Cache analytics data (1 hour TTL)
   - Invalidate on create/update/delete

**Acceptance Criteria:**
- All dashboard sections load real data
- Data refreshes when content is posted
- Analytics charts display correctly
- No hardcoded mock data in production views
- Loading states while fetching data

---

### Boyem and Wohkin(work on endpoints) - Admin Verification Enhancement & Approval System
**Objectives:**
- Build complete admin verification workflow
- Implement accept/reject functionality
- Add verification analytics
- Create admin notifications

**Tasks:**
1. **Verification Queue Management** (`/admin/verifications`)
   - Display all pending creator applications
   - Sort by submission date, category
   - Quick view toggle for details
   - Bulk actions (accept multiple)
   - Filter by verification status

2. **Creator Details Modal/Page**
   - Display full creator profile
   - View all submitted documents
   - View portfolio/previous work
   - Accept with comments
   - Reject with detailed feedback

3. **Approval/Rejection Workflow**
   - `POST /api/admin/verify` - Accept creator
     - Create creator_profiles entry
     - Send approval email
     - Set status to 'approved'
     - Generate creator username/slug
   
   - `POST /api/admin/reject` - Reject creator
     - Set status to 'rejected'
     - Store rejection reason
     - Send rejection email with feedback
     - Allow reapplication after 30 days

4. **Verification Analytics**
   - Total pending verifications count
   - Approval rate statistics
   - Average verification time
   - Rejections by category
   - Dashboard widgets for these metrics

5. **Email Notifications**
   - Approval notification email template
   - Rejection notification email template
   - Admin alerts for new applications
   - Reminder for pending verifications

6. **Components to Enhance:**
   - `VerificationQueue.jsx` - Better list UI
   - `VerificationDetails.jsx` - Complete reviewer
   - `AdminDashboard.jsx` - Add analytics widgets
   - New: `VerificationAnalytics.jsx`

7. **API Endpoints**
   - `POST /api/admin/verify/{creatorId}` - Approve
   - `POST /api/admin/reject/{creatorId}` - Reject
   - `GET /api/admin/stats` - Verification stats
   - `GET /api/admin/pending-count` - Quick count

**Acceptance Criteria:**
- Admin can view all pending verifications
- Accept button creates creator profile & sends email
- Reject button stores reason & sends email
- Analytics show correct statistics
- No duplicate approvals possible
- Audit log of all admin actions

---

## Sprint 3 Deliverables Summary

### By End of Sprint
1. **Creator Dashboard Fully Functional**
   - Content posting working end-to-end
   - Profile editing complete
   - Real data on all dashboard sections
   - Analytics displaying correctly

2. **Comprehensive API**
   - All content CRUD operations
   - File upload handling
   - Profile management
   - Query/filter capabilities

3. **Admin Verification Complete**
   - Accept/reject workflow operational
   - Emails sending on approval/rejection
   - Analytics dashboard showing metrics
   - Audit trail of decisions

4. **Data Integration**
   - Mock data completely replaced
   - Real-time updates working
   - Caching strategy implemented
   - Performance optimized

## Testing Checklist
- [ ] Creator can post music, movies, stories
- [ ] Posted content appears in dashboard immediately
- [ ] Profile edits save and display
- [ ] Admin receives pending verification notifications
- [ ] Admin can approve creator (email sent)
- [ ] Admin can reject with feedback (email sent)
- [ ] Dashboard analytics update with real data
- [ ] Content edit/delete work from "My Content"
- [ ] Pagination works on all content lists
- [ ] Error handling for failed uploads

---

# Success Metrics

## Sprint 1
- ✅ Authentication system working without errors
- ✅ User can register, verify OTP, login
- ✅ Role system functioning correctly

## Sprint 2
- ✅ Creator verification workflow complete
- ✅ Admin can view and manage verifications
- ✅ Creator dashboard after approval accessible

## Sprint 3
- ✅ Creators can post content across all categories
- ✅ Admin approval/rejection fully operational
- ✅ Dashboard shows real data from API
- ✅ All CRUD operations working
- ✅ Email notifications functional
- ✅ Analytics displaying correctly

---

# Known Constraints & Technical Debt

1. **File Storage**: Currently using local paths; should migrate to Supabase storage buckets
2. **Email Templates**: SendGrid templates need design refinement
3. **Performance**: Implement CDN for image serving
4. **Scalability**: Consider message queue for async operations
5. **Security**: Add input sanitization, SQL injection prevention
6. **Testing**: Need unit and integration tests
7. **Analytics**: Build real-time update system with WebSockets

---

# Future Sprints (Post Sprint 3)

- **Sprint 4**: Engagement & Social Features (comments, likes, follows)
- **Sprint 5**: Monetization & Payments (Stripe integration)
- **Sprint 6**: Search & Discovery (Elasticsearch)
- **Sprint 7**: Mobile App (React Native)
