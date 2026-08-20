# IvySchool.ai — Navigation, Menus & User Story Catalog

**Status:** Draft v1.0 · **Owner:** Program Management · **Last updated:** 2026-08-19

This document specifies, for every persona on the platform, (1) the navigation/menu
structure they see, (2) the concrete buttons/actions available to them, and (3) the user
stories that make the application "fully operational" for that role. It is written as a
product backlog for a real, shippable LMS — not a features wishlist — so every story is
scoped, has acceptance criteria, and carries a priority tied to the delivery phases in
[ARCHITECTURE.md](ARCHITECTURE.md) §13 (MVP → Phase 1, P1 → Phase 2, P2 → Phase 3, P3 →
Phase 4/hardening).

Story IDs are prefixed by persona (`STU`, `TCH`, `ADM`, `SAD`, `PAR`, `GST`, `CPR`, `SAL`,
`MKT`, `STF`) so they stay traceable in a backlog tool (Jira/Linear) without renumbering.
Each persona's stories map back to the owning microservice(s) from
[ARCHITECTURE.md §3.2](ARCHITECTURE.md#32-service-decomposition) — noted in brackets.

---

## 0. Methodology

- **One login, ten experiences.** All personas authenticate through the same Identity &
  Access service (§7.1 of the architecture doc); what changes per role is the navigation
  shell, the dashboard, and what RBAC (§7.2) allows the API to return.
- **Every button maps to a story.** If a menu item or button is listed here, a story below
  explains what it does and why. Nothing is decorative.
- **Acceptance criteria are the definition of "done,"** not an exhaustive spec — enough to
  size and test the story, not a full BRD.
- **Priority:**
  | Tag | Phase | Meaning |
  |---|---|---|
  | `MVP` | Phase 1 | Required for public launch |
  | `P1` | Phase 2 | Required for a real classroom/cohort to run end-to-end |
  | `P2` | Phase 3 | Scale, intelligence, and partner/business tooling |
  | `P3` | Phase 4 | Hardening, compliance maturity, nice-to-have |

---

## 1. Shared Platform Capabilities

Cross-persona stories that every role depends on. Referenced by ID from persona sections
below rather than repeated.

**Identity, Access & Notifications** *[Identity & Access, Messaging & Notification]*

- **[PLT-01] Sign up with email/password** — As any new user, I want to create an account
  with email + password (or Google/Microsoft SSO), so that I can access the platform.
  *AC:* password strength meter; CAPTCHA on submit; breach-list check; email verification
  sent. **MVP**
- **[PLT-02] Multi-factor authentication** — As any user, I want to enable TOTP or
  SMS/email MFA, so that my account is protected. *AC:* MFA setup wizard with QR code;
  recovery codes issued once; MFA mandatory for Admin/School Admin/Teacher at login.
  **MVP**
- **[PLT-03] Reset a forgotten password** — As any user, I want a self-service password
  reset flow, so that I never need to contact support to regain access. *AC:* rate-limited
  reset link, single-use, 15-minute expiry. **MVP**
- **[PLT-04] Manage notification preferences** — As any user, I want to choose which
  updates I get by email, SMS, push, and in-app, so that I'm not overwhelmed. *AC:*
  per-category toggle (grades, messages, billing, marketing); unsubscribe link honored
  platform-wide. **P1**
- **[PLT-05] View and search my notification inbox** — As any user, I want a bell-icon
  inbox of recent notifications, so that I don't miss anything that happened while I was
  away. **P1**
- **[PLT-06] Global search** — As any authenticated user, I want a search bar that finds
  courses, people, or pages I have permission to see, so that I don't have to navigate
  menus to find things. *[Search]* **P2**
- **[PLT-07] Download or delete my data** — As any user, I want a "Download my data" and
  "Delete my account" option in Settings, so that I can exercise my data rights. *AC:*
  export as JSON/CSV within 24h; deletion has a 14-day undo window and honors legal holds
  on financial records. **P1**
- **[PLT-08] Get help** — As any user, I want a persistent Help/Support entry point
  (chat + knowledge base + "contact us"), so that I can resolve issues without leaving the
  app. **MVP**

---

## 2. Admin

**Mission:** Runs the platform itself — every tenant, every role, every dollar, every
compliance obligation, across all schools and personas. *[Primarily: Identity & Access,
Tenant/School Mgmt, Payments & Billing, Audit & Compliance, Analytics & Reporting]*

### Navigation — Admin Console (sidebar app shell)

- **Dashboard** — platform-wide KPIs (active learners, revenue, uptime, open incidents)
- **Schools & Tenants** — list, create, suspend, impersonate-for-support
- **Users & Roles** — global user directory, RBAC role/permission editor
- **Course Catalog** — approve/reject partner content, manage taxonomy
- **Partners** — university & course-provider accounts, licensing terms
- **Payments & Billing** — platform revenue, refunds, disputed charges
- **Analytics & Reports** — cross-tenant dashboards, exportable reports
- **Audit Log** — immutable, filterable log of every sensitive action
- **CMS Moderation** — review Marketing team's published pages/campaigns
- **Announcements** — broadcast a banner/notification platform-wide
- **Settings** — password policy, MFA enforcement, session timeout, feature flags

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **+ New School** | Schools & Tenants | Opens tenant-creation wizard (org name, plan, initial School Admin invite) |
| **Suspend tenant** | Tenant detail | Soft-disables all logins for that school; data retained |
| **Impersonate (break-glass)** | User detail | Time-boxed, audited support session as that user — never silent |
| **+ New role** | Users & Roles | Opens role/permission-matrix editor |
| **Approve / Reject** | Course Catalog submission | Publishes or returns partner content with a reason |
| **Issue refund** | Payments → transaction | Triggers processor refund + emits `RefundIssued` audit event |
| **Export audit log** | Audit Log | Streams a signed CSV/JSON export for compliance requests |
| **Broadcast announcement** | Announcements | Publishes a banner/notification to a chosen persona segment |

### User stories

- **[ADM-01] Create and configure a new school tenant** — As an Admin, I want to create a
  new tenant with its own branding and an initial School Admin invite, so that a new
  district/college can onboard without engineering involvement. *AC:* tenant isolated at
  DB row-level (RLS); invite email sent; audit entry created. **MVP**
- **[ADM-02] Suspend or reinstate a tenant** — As an Admin, I want to suspend a school for
  non-payment or policy violation without deleting its data, so that we can resolve issues
  before a harder action. **MVP**
- **[ADM-03] Create and edit RBAC roles** — As an Admin, I want to define custom roles
  with a permission matrix (per §7.2), so that new personas or edge cases don't require a
  code change. *AC:* changes take effect without redeploy; every change audited. **P1**
- **[ADM-04] Impersonate a user for support** — As an Admin, I want a time-boxed,
  fully-audited "view as" mode, so that I can diagnose a user's issue without their
  password. *AC:* banner shown to admin the whole session; auto-expires at 30 min. **P1**
- **[ADM-05] Approve partner course content before publish** — As an Admin, I want a
  moderation queue for content submitted by Course Providers, so that nothing goes live
  without a quality/compliance check. **MVP**
- **[ADM-06] View platform-wide revenue and refund a transaction** — As an Admin, I want
  a billing console across every tenant, so that finance can reconcile revenue and handle
  disputes in one place. *[Payments & Billing]* **P1**
- **[ADM-07] View the full audit trail of a sensitive action** — As an Admin, I want to
  search the audit log by actor, action, or resource, so that I can investigate incidents
  or answer compliance requests. *[Audit & Compliance]* **MVP**
- **[ADM-08] Enforce platform-wide security policy** — As an Admin, I want to set minimum
  password strength, mandatory MFA by role, and session timeout globally, so that security
  posture isn't left to individual users. **MVP**
- **[ADM-09] Broadcast an announcement to a persona segment** — As an Admin, I want to
  push a banner (e.g. "scheduled maintenance Sunday") to all Teachers, so that operational
  changes reach the right audience. **P2**
- **[ADM-10] View cross-tenant analytics** — As an Admin, I want dashboards for
  enrollment, engagement, and completion across every school, so that I can report to
  leadership and investors. *[Analytics & Reporting]* **P2**
- **[ADM-11] Handle a data subject request** — As an Admin, I want a queue of
  download/delete requests from `PLT-07` with SLA tracking, so that we stay compliant with
  data-rights obligations. **P1**
- **[ADM-12] Manage platform feature flags** — As an Admin, I want to toggle risky
  features per tenant or persona, so that rollouts can be staged safely. **P2**

---

## 3. Student

**Mission:** Discover a course, learn from it, prove it, and get somewhere with it (a
placement, a credential, a skill). *[Course Catalog, Enrollment & Curriculum, Content &
Media, Assessment & Grading, Live Class & Scheduling, Certification, Payments]*

### Navigation — Student app (sidebar / bottom nav on mobile)

- **Home** — continue-learning widget, upcoming live classes, announcements
- **My Courses** — enrolled courses with progress bars
- **Pathways** — grade or career pathway explorer (from the public Learning Pathways UI)
- **Live Classes** — calendar + join links
- **Assignments & Grades** — gradebook, submission history
- **Certificates** — earned/verified certificates, share links
- **Messages** — mentor/teacher chat
- **Billing** — subscription, invoices, payment method
- **Profile & Settings** — account, MFA, notification preferences (`PLT-02`, `PLT-04`)

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **Book a free trial class** | Marketing hero / Home | Opens trial-class scheduler, no card required |
| **Enroll** | Course detail | Adds course to "My Courses"; triggers `EnrollmentCreated` event |
| **Join live class** | Live Classes / Home widget | Opens the video session (external provider or embedded) at start time |
| **Submit assignment** | Assignment detail | Uploads work; locks after due date unless extended |
| **View certificate / Share** | Certificates | Opens verifiable certificate page; copies public share link |
| **Download my data / Delete account** | Settings | See `PLT-07` |
| **Upgrade / manage plan** | Billing | Opens Stripe-hosted billing portal |

### User stories

- **[STU-01] Browse and filter the course catalog** — As a Student, I want to filter
  courses by subject, grade, and university partner, so that I find the right fit fast.
  *AC:* filters persist in the URL; empty state suggests popular courses. **MVP**
- **[STU-02] Follow a personalised pathway** — As a Student, I want to pick a Grade or
  Career pathway and see the ordered course sequence, so that I don't have to guess what
  to take next. *AC:* matches the tabbed Grade/Career pathway UI already shipped on the
  marketing site. **MVP**
- **[STU-03] Book a free trial class** — As a Student, I want to book a trial without
  entering payment details, so that I can evaluate before committing. **MVP**
- **[STU-04] Enroll in a course** — As a Student, I want a one-click enroll that also
  handles payment if the course isn't free, so that starting to learn has no friction.
  **MVP**
- **[STU-05] Watch course video content with progress tracking** — As a Student, I want
  the player to remember where I left off and mark lessons complete, so that I can pick up
  across sessions and devices. *[Content & Media]* **MVP**
- **[STU-06] Join a scheduled live class** — As a Student, I want a "Join" button that
  activates 10 minutes before start time, so that I never miss a session by fumbling for a
  link. *[Live Class & Scheduling]* **P1**
- **[STU-07] Submit an assignment and see my grade** — As a Student, I want to upload
  work and see feedback/grade in one place, so that I know exactly how I'm doing.
  *[Assessment & Grading]* **P1**
- **[STU-08] Take a quiz with instant feedback** — As a Student, I want auto-graded
  quizzes with explanations, so that I learn from mistakes immediately. **P1**
- **[STU-09] View my overall pathway progress** — As a Student, I want a progress bar
  across my whole pathway (not just one course), so that I stay motivated toward the
  bigger goal. **P1**
- **[STU-10] Earn and share a verified certificate** — As a Student, I want a
  shareable, verifiable certificate on course completion, so that I can put it on
  LinkedIn/college apps. *[Certification]* **P1**
- **[STU-11] Message my teacher/mentor** — As a Student, I want direct messaging with my
  course's teacher, so that I can ask questions without waiting for the next live class.
  **P1**
- **[STU-12] Manage my subscription and payment method** — As a Student (or my Parent),
  I want to see invoices and update my card, so that my access never lapses unexpectedly.
  *[Payments & Billing]* **MVP**
- **[STU-13] See placement/career guidance for my pathway** — As a Student on a Career
  pathway, I want to see the placement partners and outcomes tied to it, so that I can
  trust the ROI of finishing it. **P2**
- **[STU-14] Get notified before a class or deadline** — As a Student, I want reminders
  ahead of live classes and assignment due dates, so that I don't miss them. **P1**

---

## 4. Teacher

**Mission:** Author great content, run great live sessions, and grade fairly and fast for
the roster they own — nothing outside it. *[Content & Media, Assessment & Grading, Live
Class & Scheduling, Messaging & Notification]*

### Navigation — Teacher app (sidebar)

- **Dashboard** — today's classes, pending grading, recent messages
- **My Courses** — authoring workspace (lessons, videos, materials)
- **My Classes / Roster** — students enrolled in courses I teach, scoped by tenant
- **Live Sessions** — schedule/host/recordings
- **Gradebook** — all assignments/quizzes across my classes
- **Messages** — chat with my students/parents only
- **Analytics** — per-class engagement and outcome dashboards
- **Profile & Settings**

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **+ New lesson** | Course authoring | Opens the content editor; video upload gets a pre-signed S3 URL |
| **Publish course / lesson** | Course authoring | Makes content visible to enrolled students |
| **Schedule live session** | Live Sessions | Creates a calendar entry + join link, notifies enrolled students |
| **Start session** | Live Sessions | Opens host controls for the live class |
| **Grade submission** | Gradebook | Opens submission with rubric/score entry, saves + notifies student |
| **Message student/parent** | Roster row | Opens a scoped chat thread (RBAC: own roster only) |
| **Export gradebook** | Gradebook | Downloads CSV of grades for a class |

### User stories

- **[TCH-01] Author a course with video, text, and downloadable materials** — As a
  Teacher, I want a content editor supporting video upload (via pre-signed S3 URL),
  rich text, and file attachments, so that I can build a full course without engineering
  help. **MVP**
- **[TCH-02] Publish/unpublish content** — As a Teacher, I want to control exactly when a
  lesson becomes visible to students, so that I can stage content ahead of when it's
  taught. **MVP**
- **[TCH-03] View my roster, scoped to my classes only** — As a Teacher, I want to see
  only the students enrolled in courses I teach, so that I never see data outside my
  responsibility (RBAC row-level scoping). **MVP**
- **[TCH-04] Schedule and host a live class** — As a Teacher, I want to create a session
  with date/time/duration that auto-notifies my roster, and a one-click "Start," so that
  running live classes doesn't need a separate tool. *[Live Class & Scheduling]* **P1**
- **[TCH-05] Create a quiz or assignment** — As a Teacher, I want to build graded
  assessments with a rubric or auto-grade key, so that grading is consistent and fast.
  **P1**
- **[TCH-06] Grade submissions and leave feedback** — As a Teacher, I want a grading queue
  with inline feedback, so that students get timely, specific responses. **P1**
- **[TCH-07] View and export my gradebook** — As a Teacher, I want a gradebook view
  across all my classes with CSV export, so that I can report to a School Admin or keep
  my own records. **P1**
- **[TCH-08] Message students/parents in my roster** — As a Teacher, I want scoped
  messaging (never platform-wide), so that communication stays appropriate and auditable.
  **P1**
- **[TCH-09] See class-level engagement analytics** — As a Teacher, I want to see which
  students are falling behind (login frequency, assignment completion), so that I can
  intervene early. *[Analytics & Reporting]* **P2**
- **[TCH-10] Mark a course complete and trigger certification** — As a Teacher, I want to
  confirm a student has met completion criteria, so that their certificate is issued
  automatically. **P1**
- **[TCH-11] Reuse/clone a course for a new term** — As a Teacher, I want to duplicate an
  existing course as a starting point, so that I don't rebuild from scratch every
  semester. **P2**

---

## 5. School Admin

**Mission:** Runs their school's/district's presence on the platform — staff, students,
curriculum, and the bill — scoped entirely to their own tenant. *[Tenant/School Mgmt,
User Profile, Enrollment & Curriculum, Payments & Billing, Analytics & Reporting]*

### Navigation — School Admin app (sidebar)

- **Dashboard** — school-wide KPIs (enrollment, engagement, at-risk students)
- **Staff & Teachers** — invite/manage teacher accounts and roles within the school
- **Students & Enrollment** — roster management, bulk import/export
- **Curriculum & Pathways** — assign which pathways/courses the school offers
- **Billing** — school-level subscription, seat count, invoices
- **Reports** — engagement/outcome reports, exportable for board meetings
- **Announcements** — school-wide messages to staff/students/parents
- **Settings** — school profile, branding, consent/compliance settings

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **+ Invite teacher** | Staff & Teachers | Sends role-scoped invite email, pending until accepted |
| **Bulk import students (CSV)** | Students & Enrollment | Validates + creates accounts, sends parent-consent flow for minors |
| **Assign pathway to grade/cohort** | Curriculum & Pathways | Applies a pathway as default for a grade level |
| **Add seats / change plan** | Billing | Adjusts subscription seat count via Stripe |
| **Download engagement report** | Reports | Exports PDF/CSV for board/leadership |
| **Send school announcement** | Announcements | Notifies chosen audience (staff / students / parents) |

### User stories

- **[SAD-01] Set up my school's profile and branding** — As a School Admin, I want to add
  our logo and org details, so that the platform feels like it belongs to our school.
  **MVP**
- **[SAD-02] Invite and manage teacher accounts** — As a School Admin, I want to invite
  teachers and assign them to specific courses/sections, so that access is scoped
  correctly from day one. **MVP**
- **[SAD-03] Bulk-import a student roster via CSV** — As a School Admin, I want to upload
  a CSV of students, so that I don't have to create hundreds of accounts by hand. *AC:*
  validation report before commit; triggers COPPA parental-consent flow for under-13
  students. **P1**
- **[SAD-04] Assign a curriculum pathway to a grade or cohort** — As a School Admin, I
  want to set the default pathway per grade, so that teachers and students aren't left to
  self-select course sequencing. **P1**
- **[SAD-05] View school-wide engagement and outcome reports** — As a School Admin, I
  want dashboards on enrollment, completion, and at-risk students across my whole school,
  so that I can report to my board/superintendent. **P1**
- **[SAD-06] Manage my school's subscription and seats** — As a School Admin, I want to
  see current usage vs. seats purchased and add more, so that billing scales with actual
  enrollment. *[Payments & Billing]* **MVP**
- **[SAD-07] Send an announcement to staff, students, or parents** — As a School Admin, I
  want to broadcast a message to a chosen audience within my school, so that operational
  updates reach the right people without emailing everyone individually. **P1**
- **[SAD-08] Manage consent and compliance records for my school** — As a School Admin, I
  want to see parental-consent status for every minor student, so that I can demonstrate
  COPPA/FERPA compliance on request. *[Audit & Compliance]* **P2**
- **[SAD-09] Deactivate a departed student or staff member** — As a School Admin, I want
  to revoke access immediately when someone leaves, so that access always matches current
  enrollment/employment. **MVP**
- **[SAD-10] View placement outcomes for my school's cohort** — As a School Admin (higher
  ed context), I want to see job/college placement stats for our students, so that I can
  evaluate ROI and report it externally. **P2**

---

## 6. Parent

**Mission:** Know how their child is doing, keep the account paid and consented, and stay
in the loop — without having to log in as their child. *[User Profile, Enrollment &
Curriculum, Payments & Billing, Messaging & Notification]*

### Navigation — Parent app (light — tabs, not a full sidebar)

- **Home** — child switcher (if multiple children) + at-a-glance summary
- **Progress & Grades** — read-only view of child's courses/grades
- **Schedule** — upcoming live classes
- **Messages** — thread with child's teacher(s)
- **Billing** — invoices, payment method, plan
- **Consent & Privacy** — manage COPPA consent, data requests for the child

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **Link child's account** | Onboarding / Settings | Sends a consent + linking flow to associate parent↔student |
| **Grant/revoke consent** | Consent & Privacy | Updates COPPA consent record, audited |
| **Message teacher** | Progress page | Opens a scoped thread with the child's teacher |
| **Update payment method** | Billing | Opens Stripe-hosted portal |
| **Switch child** | Home | Changes the active child context across the whole app |

### User stories

- **[PAR-01] Link my account to my child's** — As a Parent, I want to connect my account
  to my child's student profile, so that I can see their progress without sharing a
  login. *AC:* requires child/school confirmation or COPPA consent flow if under 13.
  **MVP**
- **[PAR-02] Give or withdraw consent for a minor** — As a Parent of a student under 13,
  I want an explicit consent flow (COPPA), so that I control what data is collected about
  my child. *[PII & regulatory handling, §7.4]* **MVP**
- **[PAR-03] View my child's progress and grades** — As a Parent, I want a read-only
  dashboard of my child's courses, grades, and attendance, so that I stay informed without
  nagging them. **MVP**
- **[PAR-04] See upcoming live classes on a schedule** — As a Parent, I want a calendar
  of my child's live sessions, so that I can plan around them. **P1**
- **[PAR-05] Message my child's teacher** — As a Parent, I want a direct line to the
  teacher, so that I can ask about progress or concerns. **P1**
- **[PAR-06] Manage billing for my child's enrollment** — As a Parent, I want to see
  invoices and manage the payment method funding my child's courses, so that access never
  lapses without my knowledge. **MVP**
- **[PAR-07] Switch between multiple children** — As a Parent with more than one child on
  the platform, I want a quick switcher, so that I don't need separate logins. **P1**
- **[PAR-08] Request my child's data or account deletion** — As a Parent, I want to
  exercise data rights on my child's behalf, so that I retain control as their legal
  guardian. *(extends PLT-07)* **P1**
- **[PAR-09] Get notified of a grade drop or missed class** — As a Parent, I want a
  proactive alert if my child's engagement drops, so that I can step in early. **P2**

---

## 7. Guest

**Mission:** Get convinced, fast, that IvySchool.ai is worth signing up for or partnering
with — and be able to act on that instantly. *[Marketing/CMS, Course Catalog, CRM/Sales]*

### Navigation — Public marketing site (already implemented)

- **Top nav:** About · Pathways ▾ · For Schools · For Colleges · For Business · News ·
  Sign In · **Start Learning**
- **Footer:** Explore / Resources / Company / Stay Updated + social + app store badges

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **Start Learning** | Header (every page) | Routes to signup |
| **Sign In** | Header | Routes to login |
| **Book a free trial class** | Landing hero | Opens trial-class scheduler (no login required to start) |
| **Explore courses** | Landing hero / Courses section | Routes to public course catalog |
| **View full recommended track** | Learning Pathways | Expands the full pathway course list |
| **Explore programs / Talk to our team** | Partner With Us cards | Routes to a persona-specific lead form (School/College/Business) |
| **Get my free plan** | Lead-gen consultation form | Submits lead to CRM/Sales queue (`SAL-01`) |
| **Enter email + arrow button** | Footer newsletter | Subscribes to marketing list |

### User stories

- **[GST-01] Browse the public course catalog without an account** — As a Guest, I want to
  see courses, pathways, and pricing before signing up, so that I can evaluate fit
  risk-free. **MVP**
- **[GST-02] Book a free trial class** — As a Guest, I want to book a trial without
  creating a full account first, so that the barrier to try is as low as possible. **MVP**
- **[GST-03] Submit a consultation/lead form** — As a Guest (student, parent, school, or
  business), I want a guided form that routes to the right advisor, so that I get relevant
  follow-up instead of a generic reply. *AC:* form fields adapt to "I am a" selection;
  submission creates a CRM lead (`SAL-01`). **MVP**
- **[GST-04] Read newsroom/partnership stories** — As a Guest, I want to see real
  school/college partnerships, so that I trust the platform's credibility before signing
  up. **MVP**
- **[GST-05] Explore a learning pathway before enrolling** — As a Guest, I want to see the
  full course sequence for a Grade or Career pathway, so that I understand the commitment
  before I pay for anything. **MVP**
- **[GST-06] Sign up for the newsletter** — As a Guest, I want a lightweight email-only
  signup in the footer, so that I can stay informed without creating a full account.
  **MVP**
- **[GST-07] Verify a certificate publicly** — As a Guest (e.g. an employer), I want to
  verify a certificate's authenticity via a public link, so that I can trust a candidate's
  credential. *[Certification]* **P1**

---

## 8. Course Provider

**Mission:** Publish their university's/company's content on the platform, protect their
brand, and see the revenue and outcomes it generates. *[Course Catalog, Content & Media,
Analytics & Reporting, Payments & Billing]*

### Navigation — Partner Portal (sidebar)

- **Dashboard** — content performance summary, revenue this period
- **My Courses** — published/pending content under our brand
- **Revenue & Royalties** — payout statements, revenue-share terms
- **Analytics** — engagement/completion for our content specifically
- **Brand & Certificates** — logo, certificate template, co-branding rules
- **Contracts** — licensing agreement status/renewal
- **Messages/Support** — line to IvySchool.ai partnerships team

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **+ Submit new course** | My Courses | Opens content submission, routes to Admin moderation (`ADM-05`) |
| **Edit course metadata** | Course detail | Updates catalog listing (subject to re-review if substantive) |
| **Download royalty statement** | Revenue & Royalties | Exports a period statement (PDF/CSV) |
| **Update certificate template** | Brand & Certificates | Changes the design future certificates are issued with |
| **View contract terms** | Contracts | Shows current revenue-share %, renewal date |

### User stories

- **[CPR-01] Submit a course for publication under my brand** — As a Course Provider, I
  want to upload course content and metadata for review, so that it appears in the
  catalog once approved. **P2**
- **[CPR-02] View revenue generated by my content** — As a Course Provider, I want a
  dashboard of enrollments and revenue attributable to my courses, so that I can trust the
  royalty statements. **P2**
- **[CPR-03] Download a royalty/payout statement** — As a Course Provider, I want a
  periodic statement matching what we're paid, so that our finance team can reconcile it.
  **P2**
- **[CPR-04] See engagement/completion analytics for my content** — As a Course Provider,
  I want to know completion rates and drop-off points in my courses, so that I can improve
  them. **P2**
- **[CPR-05] Manage my certificate template and branding** — As a Course Provider, I want
  our logo and signatory to appear correctly on issued certificates, so that our brand is
  represented accurately. *[Certification]* **P2**
- **[CPR-06] View and renew my licensing contract** — As a Course Provider, I want to see
  our current revenue-share terms and renewal date, so that nothing lapses unexpectedly.
  **P3**

---

## 9. Sales Team

**Mission:** Turn inbound leads (schools, colleges, businesses) into signed, onboarded
accounts, and keep the pipeline healthy. *[CRM/Sales]*

### Navigation — Sales Console (sidebar)

- **Dashboard** — pipeline overview, quota progress
- **Leads** — inbound leads from `GST-03` / marketing campaigns
- **Accounts** — schools/colleges/businesses, contract status
- **Contracts & Quotes** — deal terms, e-signature status
- **Tasks & Follow-ups** — reminders, call/email logs
- **Reports** — pipeline, win rate, revenue forecast

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **Claim lead** | Leads queue | Assigns an unclaimed lead to the current rep |
| **Log activity (call/email)** | Lead/Account detail | Records an outreach touchpoint on the timeline |
| **Create quote** | Account detail | Generates a pricing quote for a school/college/business plan |
| **Send for e-signature** | Contracts | Routes a contract to DocuSign/similar |
| **Convert to account** | Lead detail | Creates the tenant shell, handing off to onboarding (`ADM-01`) |
| **Export pipeline report** | Reports | Downloads CSV/PDF for forecasting |

### User stories

- **[SAL-01] Receive and triage inbound leads** — As a Sales rep, I want every
  consultation-form submission (`GST-03`) to land in a shared queue I can claim, so that
  no lead goes unworked. **MVP**
- **[SAL-02] Log outreach activity against a lead/account** — As a Sales rep, I want a
  timeline of calls/emails per account, so that handoffs between reps don't lose context.
  **P2**
- **[SAL-03] Create and send a pricing quote** — As a Sales rep, I want to generate a
  quote from plan templates, so that pricing stays consistent across the team. **P2**
- **[SAL-04] Track a contract through e-signature** — As a Sales rep, I want to see
  signature status without leaving the CRM, so that I know exactly when to kick off
  onboarding. **P2**
- **[SAL-05] Convert a won deal into a live tenant** — As a Sales rep, I want a
  "Convert to account" action that hands off directly to Admin's tenant-creation flow
  (`ADM-01`), so that there's no manual re-entry of data. **P2**
- **[SAL-06] View pipeline and forecast reports** — As a Sales manager, I want dashboards
  by stage, rep, and expected close date, so that I can forecast revenue accurately. **P2**
- **[SAL-07] See marketing attribution on a lead** — As a Sales rep, I want to know which
  campaign/channel a lead came from, so that I can tailor my pitch. *(depends on `MKT-04`)*
  **P3**

---

## 10. Marketing Team

**Mission:** Own the public-facing story — the site, the campaigns, the newsroom — and
prove it drives pipeline. *[Marketing/CMS, Analytics & Reporting]*

### Navigation — Marketing Console (sidebar)

- **Dashboard** — traffic, conversion funnel, top campaigns
- **CMS Pages** — Landing, About, pricing, and other marketing pages
- **Newsroom/Blog** — publish partnership stories and posts
- **Campaigns** — create/track paid and organic campaigns
- **Leads** — marketing-qualified leads (shared view with Sales)
- **Email/Newsletter** — footer-signup subscriber list, campaign sends
- **Analytics/SEO** — page performance, search ranking, funnel drop-off

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **Edit page** | CMS Pages | Opens the section-by-section marketing page editor (submitted for `ADM-05`-style review) |
| **+ New newsroom post** | Newsroom/Blog | Drafts a post with the standard card layout used on the site |
| **+ New campaign** | Campaigns | Creates a trackable campaign with UTM parameters |
| **Publish** | CMS Page / Post | Pushes the draft live (subject to Admin moderation for major changes) |
| **Send newsletter** | Email/Newsletter | Sends a campaign to the subscriber list from `GST-06` |
| **View funnel report** | Analytics/SEO | Shows visit → lead → enrollment conversion by source |

### User stories

- **[MKT-01] Edit marketing page content without a deploy** — As a Marketing team member,
  I want to edit hero copy, stats, and sections on the Landing/About pages through a CMS,
  so that I don't need engineering for every copy change. **P2**
- **[MKT-02] Publish a newsroom/partnership story** — As a Marketing team member, I want
  to add a new card to the Newsroom section with a date, headline, and photo, so that new
  partnerships get visibility fast. **P1**
- **[MKT-03] Create and track a campaign** — As a Marketing team member, I want to create
  a campaign with UTM tracking, so that I can measure channel performance. **P2**
- **[MKT-04] Attribute leads to a campaign/source** — As a Marketing team member, I want
  every lead (`GST-03`) tagged with its source, so that I can report which channels
  actually convert. **P2**
- **[MKT-05] Send a newsletter to subscribers** — As a Marketing team member, I want to
  compose and send an email to the footer-signup list, so that we can re-engage people who
  weren't ready to buy. **P2**
- **[MKT-06] View site funnel and SEO performance** — As a Marketing team member, I want a
  dashboard of visits → leads → enrollments and search ranking, so that I can prioritize
  what to optimize next. **P2**
- **[MKT-07] A/B test a landing page section** — As a Marketing team member, I want to
  test two hero variants and see which converts better, so that decisions are
  data-driven, not opinion-driven. **P3**
- **[MKT-08] Submit page changes for compliance review** — As a Marketing team member, I
  want major page changes routed to Admin/Legal review before publish, so that public
  claims (e.g. "50k+ students") stay accurate and defensible. **P2**

---

## 11. School Staff

**Mission:** Handle the day-to-day operational work at a school (attendance, scheduling
support, first-line student/parent questions) within a tightly scoped set of permissions.
*[Enrollment & Curriculum, Live Class & Scheduling, Messaging & Notification]*

### Navigation — School Staff app (sidebar, intentionally minimal)

- **Dashboard** — today's schedule, open support tickets
- **Attendance** — mark/view attendance for live sessions
- **Schedule** — manage the school's live-class calendar
- **Student Records** — scoped, mostly read-only view
- **Support Tickets** — first-line student/parent questions
- **Announcements** — view (not send) school-wide messages

### Key buttons & actions

| Button / action | Location | Result |
|---|---|---|
| **Mark attendance** | Attendance | Records present/absent per session, visible to School Admin |
| **Reschedule a session** | Schedule | Moves a live-class time, notifies affected students/teacher |
| **Open ticket** | Support Tickets | Logs a student/parent question for follow-up |
| **Escalate to School Admin** | Ticket detail | Routes an issue beyond staff's permission scope |
| **View student record (read-only)** | Student Records | Shows enrollment/attendance, not grades or billing unless granted |

### User stories

- **[STF-01] Mark attendance for a live session** — As School Staff, I want to record
  attendance during or after a live class, so that the school has accurate participation
  data. **P2**
- **[STF-02] Reschedule a live class** — As School Staff, I want to move a session's time
  and auto-notify affected students/teacher, so that operational changes don't require a
  Teacher or Admin to intervene. **P2**
- **[STF-03] View a student's enrollment and attendance record** — As School Staff, I
  want scoped, read-only access to operational student data (not grades or billing unless
  explicitly granted), so that I can answer routine questions without over-privileged
  access. **P2**
- **[STF-04] Log and track a support ticket** — As School Staff, I want to open a ticket
  for a student/parent question and mark it resolved or escalate it, so that nothing falls
  through the cracks. **P2**
- **[STF-05] Escalate an issue beyond my permission scope** — As School Staff, I want a
  one-click escalation to the School Admin with context attached, so that I'm never stuck
  needing access I shouldn't have. **P2**
- **[STF-06] View (not send) school-wide announcements** — As School Staff, I want to see
  what's been broadcast to staff/students/parents, so that I stay informed without having
  send permissions I don't need. **P2**

---

## 12. Cross-Persona Journeys

A few end-to-end flows that thread multiple personas together — useful for sanity-checking
that the stories above actually compose into a working product, and for QA test-plan
design.

1. **District onboarding:** `GST-03` (lead form) → `SAL-01` (claimed) → `SAL-03`/`SAL-04`
   (quote + contract) → `SAL-05` (convert) → `ADM-01` (tenant created) → `SAD-01`/`SAD-02`
   (School Admin sets up school, invites teachers) → `SAD-03` (bulk-imports students,
   triggering `PAR-02` consent flows) → `TCH-01`/`TCH-04` (teacher builds & schedules
   first class) → `STU-04`/`STU-06` (student enrolls and joins).
2. **Individual self-serve signup:** `GST-01`→`GST-02`→`PLT-01`→`PLT-02`→`STU-04`→
   `STU-05`/`STU-08`→`STU-10` (certificate earned) → `GST-07` (employer verifies it
   publicly).
3. **Minor's account with parental oversight:** `PLT-01` (student signup detects
   under-13) → `PAR-01`/`PAR-02` (parent linked, consent granted) → `STU-*` (student
   learns) → `PAR-03`/`PAR-09` (parent monitors, gets alerted) → `PAR-06` (parent pays).
4. **Partner content pipeline:** `CPR-01` (provider submits) → `ADM-05` (Admin
   moderates) → `MKT-02` (Marketing announces the new partnership in Newsroom) →
   `STU-01` (students discover it in the catalog).
5. **Incident/support:** `STU`/`PAR`/`TCH` opens `PLT-08` help → `STF-04` logs a ticket →
   `STF-05` escalates → `SAD` or `ADM-04` (impersonate) resolves → `ADM-07` (audit trail
   captures the whole interaction).

---

*This catalog intentionally stops short of full Gherkin-style acceptance tests and Figma
wireframes for every screen — the next step is to size these into sprints against the
roadmap phases in [ARCHITECTURE.md §13](ARCHITECTURE.md#13-roadmap) and wireframe the
highest-priority (`MVP`) stories first.*
