# IvySchool.ai — Phase 1 (MVP) Delivery Plan

**Status:** Draft v1.0 · **Owner:** Program Management · **Last updated:** 2026-08-19

This is the execution plan for **Phase 1** of the roadmap in
[ARCHITECTURE.md §13](ARCHITECTURE.md#13-roadmap): the 33 stories tagged `MVP` in
[USER_STORIES.md](USER_STORIES.md). It turns that backlog into squads, a sprint sequence,
a Definition of Done, and — most importantly — a single yes/no exit test for "is Phase 1
actually done."

---

## 1. Objective

Phase 1 ships when **one continuous golden path works end-to-end, for real money, without
an engineer in the loop**:

> A Guest discovers a course on the public site → books a free trial → signs up with MFA →
> a Teacher has already authored that course and a School Admin has onboarded the school →
> the Guest becomes a Student, enrolls, pays → watches the first video with progress
> tracked → their Parent (if a minor) has linked their account, consented, and can see
> progress and manage billing → an Admin can see the tenant, audit the key actions, and
> suspend/reinstate it if needed.

Everything in this plan exists to make that path true. Anything not on that path
(grading, live classes, certificates, messaging, CRM tooling, marketing CMS editing,
partner-content self-serve publishing) is explicitly **Phase 2+** — see §2.

## 2. Scope

### In scope (33 stories, from USER_STORIES.md)

| Area | Stories |
|---|---|
| Platform (auth, MFA, help) | `PLT-01` `PLT-02` `PLT-03` `PLT-08` |
| Admin foundations | `ADM-01` `ADM-02` `ADM-05` `ADM-07` `ADM-08` |
| Student core | `STU-01` `STU-02` `STU-03` `STU-04` `STU-05` `STU-12` |
| Teacher core | `TCH-01` `TCH-02` `TCH-03` |
| School Admin core | `SAD-01` `SAD-02` `SAD-06` `SAD-09` |
| Parent core | `PAR-01` `PAR-02` `PAR-03` `PAR-06` |
| Guest / marketing | `GST-01` `GST-02` `GST-03` `GST-04` `GST-05` `GST-06` |
| Sales (lead intake only) | `SAL-01` |

### Explicitly out of scope for Phase 1

Live classes (`TCH-04`, `STU-06`), grading/quizzes (`TCH-05/06/07`, `STU-07/08`),
certificates (`STU-10`, `CPR-*`), in-app messaging (`STU-11`, `TCH-08`, `PAR-05`), the
full CRM/Sales console beyond lead intake (`SAL-02..07`), Marketing's CMS/campaign
tooling (`MKT-*`), and School Staff's operational console (`STF-*`). These are Phase 2–4
per the roadmap and are already scoped in USER_STORIES.md — do not pull them forward
without re-planning a sprint.

### Already delivered (carried into Phase 1, not re-planned)

The public marketing site (Landing + About pages, global header/footer, Learning
Pathways UI) is built in `web/` — React/Next.js per ARCHITECTURE.md §4.4 — and covers
`GST-01`, `GST-04`, `GST-05` and the front-end half of `GST-02`/`GST-03`/`GST-06`.
Remaining work on those stories in Phase 1 is exclusively **backend**: a real trial-class
scheduler, a real lead-intake endpoint, and a real newsletter subscription — the forms
already exist.

## 3. Squads & Ownership

Three squads, each owning a vertical slice of services from
[ARCHITECTURE.md §3.2](ARCHITECTURE.md#32-service-decomposition) — small enough for an
MVP team, wide enough that no squad is blocked waiting on another for more than a sprint.

| Squad | Owns (services) | Owns (stories) |
|---|---|---|
| **Platform & Identity** | Identity & Access, Audit & Compliance | `PLT-01/02/03/08`, `ADM-07/08` |
| **Learning Experience** | Course Catalog, Content & Media, Enrollment & Curriculum | `STU-01/02/04/05`, `TCH-01/02/03`, `GST-01/05` |
| **Schools & Growth** | Tenant/School Mgmt, Payments & Billing, CRM/Sales (intake only) | `ADM-01/02`, `SAD-01/02/06/09`, `PAR-01/02/03/06`, `GST-02/03/04/06`, `SAL-01`, `STU-03/12`, `ADM-05` |

Platform & Identity ships first and blocks the other two — every other story assumes a
logged-in, role-scoped user exists.

## 4. Sprint Sequence (6 × 2 weeks = 1 quarter)

Dependencies flow left to right; a squad should not start a sprint's stories until the
prior sprint's blocking piece has an API contract, even if implementation is still
in-flight.

| Sprint | Focus | Stories shipped | Blocks / unblocks |
|---|---|---|---|
| **0** | Foundations | Repo/CI/CD, Terraform baseline, Identity & Access schema + skeleton, design system (`web/` — **done**), marketing pages (`web/` — **done**) | Unblocks everything |
| **1** | Identity is real | `PLT-01` `PLT-02` `PLT-03` `PLT-08`, RBAC skeleton, `ADM-01` (tenant creation), Admin console shell | Unblocks Learning + Schools squads |
| **2** | Discover & create content | `STU-01` `STU-02` `GST-01` `GST-05`, `TCH-01` `TCH-02` `TCH-03`, Content & Media (S3 + CloudFront pre-signed upload) | Unblocks enrollment (needs a catalog to enroll into) |
| **3** | School onboarding & families | `SAD-01` `SAD-02` `SAD-09`, `PAR-01` `PAR-02` (⚠ legal review — see §7), `STU-04` (enroll), roster RBAC scoping | Unblocks payment-gated access |
| **4** | Money moves | Payments & Billing (Stripe) → `STU-12` `SAD-06` `PAR-06`, `ADM-02` (suspend on non-payment), `GST-02` `GST-03` `GST-06` (trial/lead/newsletter backends), `SAL-01` (lead queue) | Completes the golden path |
| **5** | Harden & launch | `STU-05` polish (progress tracking), `PAR-03`, `ADM-05` `ADM-07` `ADM-08`, SAST/DAST wired per ARCHITECTURE §9, 80% coverage gate enforced, load test, soft launch | Phase 1 exit |

## 5. Definition of Done (every story, no exceptions)

A story is not "done" — it's still in progress — until all of these hold, per
[ARCHITECTURE.md](ARCHITECTURE.md):

- [ ] Unit + integration tests written; service-wide coverage stays ≥80%, ≥90% for
      `identity-service` and `payments-service` (§8)
- [ ] SAST (SonarQube/Semgrep), secret scan, and dependency scan clean on the PR (§9)
- [ ] No PII reaches a log line unredacted — verified, not assumed (§10, §12)
- [ ] OpenAPI spec generated/updated for any new endpoint (§3.6)
- [ ] RBAC checked at gateway **and** service layer for anything touching persona-owned
      data (§7.2)
- [ ] Feature flagged if it changes an existing user-facing flow (§11)
- [ ] Accessibility pass (keyboard nav, contrast, focus states) for any new UI (§4.4)

## 6. Risks & Open Decisions

These block specific sprints above and need an owner + a decision date, not just
awareness:

| Risk / decision | Blocks | Needed by |
|---|---|---|
| Payment processor selection (Stripe assumed) | Sprint 4 | Start of Sprint 3 |
| COPPA legal review of the parental-consent flow (`PAR-02`) | Sprint 3 | Start of Sprint 2 |
| Video hosting confirmation (S3 + CloudFront + MediaConvert per ARCHITECTURE §6.2) | Sprint 2 | Start of Sprint 1 |
| Which university partnerships are contractually ready to appear in the catalog at
  launch (HarvardX/Stanford/Duke/Wharton logos currently used are illustrative, from the
  Figma source — confirm licensing before this ships publicly) | Sprint 2 launch content | Start of Sprint 2 |
| CRM system of record for `SAL-01` (native queue vs. HubSpot/Salesforce) — flagged as
  open in ARCHITECTURE.md's closing note | Sprint 4 | Start of Sprint 4 |

## 7. Phase 1 Exit Criteria

Phase 1 is done when, in a production-like environment:

1. The golden path in §1 completes end-to-end by a QA tester with no engineer
   intervention, on a fresh tenant created that same day.
2. All 33 `MVP` stories meet the Definition of Done in §5.
3. A School Admin can onboard a school, invite a teacher, and have a student enrolled and
   paying within one working day — the concrete proxy for "no engineer in the loop."
4. Zero critical/high findings open from SAST, DAST, or dependency scans on `main`.
5. `docs/ARCHITECTURE.md` §12 (Non-Negotiable Boundaries) has been checked line-by-line
   against the shipped system, not just the design.

Sprint 5 is explicitly a hardening sprint, not a feature sprint — if new scope shows up
during it, it goes to Phase 2, not into a shortcut on this list.
