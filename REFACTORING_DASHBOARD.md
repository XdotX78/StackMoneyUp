Refactoring Plan: Dashboard Simplification

Overview
- Goal: Reduce duplication and complexity in the dashboard while preserving UX and behavior.
- Scope: Dashboard routes, auth/role logic, i18n handling, and adjacent UI/helpers.
- Outcome: Less code, fewer Supabase round-trips, and smaller client bundles.

Estimated Reduction
- Dashboard area LOC reduction: ~12–18% (≈500–800 LOC) without UX changes.
  - Unify auth/role: 120–180 LOC
  - Centralize guards in layout: 200–300 LOC
  - Streamline lang handling: 60–90 LOC
  - Shared UI (header/loading): 80–140 LOC
  - DRY post/tag helpers: 50–80 LOC
  - Profile auth cleanup: 30–50 LOC
- Whole app initial impact: ~4–7% LOC reduction; translation modularization mainly reduces bundle size.

Current Pain Points (with references)
- Dual auth sources of truth
  - Hook subscribes to Supabase: `src/hooks/useAuth.ts:1`
  - Context subscribes to Supabase: `src/contexts/AuthContext.tsx:1` (+ wrapper `src/components/providers/AuthProviderWrapper.tsx:1`)
  - Mixed consumption (e.g., header uses context, dashboard pages use hook).
- Repeated per-page guards and i18n boilerplate
  - Similar “auth/role redirect + lang resolve” logic repeated across pages:
    - Posts: `src/app/[lang]/dashboard/posts/page.tsx:1`
    - New Post: `src/app/[lang]/dashboard/new-post/page.tsx:1`
    - Edit: `src/app/[lang]/dashboard/edit/[slug]/page.tsx:1`
    - Media: `src/app/[lang]/dashboard/media/page.tsx:1`
    - Tags: `src/app/[lang]/dashboard/tags/page.tsx:1`
    - Analytics: `src/app/[lang]/dashboard/analytics/page.tsx:1`
- Profile duplicates auth logic and redirects
  - Direct Supabase calls + window redirects: `src/components/profile/ProfileLayout.tsx:1`
- Incomplete/broken routes
  - Empty dashboard index renders nothing: `src/app/[lang]/dashboard/page.tsx:1`
  - Sidebar links to non-existent settings page: `src/components/profile/ProfileSidebar.tsx:28`
- Monolithic translations module pulled into many pages
  - Large file imported broadly: `src/lib/translations.ts:1` (~857 lines)
- Encoding artifacts (cosmetic, but visible)
  - Examples: `src/app/[lang]/dashboard/profile/page.tsx:1`, `middleware.ts:18`, `src/app/[lang]/login/page.tsx:63`

Target Architecture
- Single Auth Source (Context)
  - Extend `AuthContext` to include: `user`, `session`, `role`, and derived capabilities: `isAdmin`, `isEditor`, `canManagePosts`, etc.
  - Remove `useAuth` hook or refactor it to a thin wrapper over context (no separate Supabase listener).
  - Refactor `useRole` to consume context and avoid re-querying Supabase per consumer.
- Centralized Dashboard Guard
  - Implement a guard in `src/app/[lang]/dashboard/layout.tsx:1` that:
    - Redirects unauthenticated users to `/${lang}/login`.
    - Optionally enforces role-based access where needed (admin/editor), or let pages declare a `requiredRole` flag.
  - Removes duplicate guard `useEffect`s across all dashboard pages.
- Language via Context
  - Provide `lang` in `[lang]/layout.tsx:1` via context or add a `useLang()` hook.
  - Child pages read `lang` from context; no per-page `use(params)` + local `setLang` juggling unless necessary.
- Routing Hygiene
  - Dashboard index: either render a simple summary/quick actions or redirect once based on role (editor/admin → posts, user → profile).
  - Settings: either add a stub page at `src/app/[lang]/dashboard/settings/page.tsx` or remove the sidebar item.
- Shared UI and Helpers
  - `DashboardHeader` for Title/Subheader/CTAs; `DashboardLoading` for standard skeletons.
  - `normalizePostFormData(form)` helper in `src/lib/blog.ts` (or a small util) for scheduled_at conversion and payload mapping used by New/Edit pages.
  - Optional `usePostSubmit()` hook to unify toasts/redirect patterns for create/update.
- Translation Modularization
  - Split `src/lib/translations.ts:1` by domain (e.g., `translations/dashboard.ts`, `translations/profile.ts`, `translations/login.ts`).
  - Each page imports only its domain strings; global helpers (`isValidLanguage`, etc.) remain shared.

Phased Plan
1) Foundations: Unify Auth/Role
   - Extend `AuthContext` with role and capabilities.
   - Refactor `useRole` to read from context, removing extra `getCurrentUser()` calls.
   - Standardize sign-out usage (choose `lib/auth.signOut` or context method, one path only).

2) Guards + Lang
   - Add dashboard guard to `src/app/[lang]/dashboard/layout.tsx:1`.
   - Remove duplicated guard effects from dashboard pages.
   - Expose `lang` via context (`[lang]/layout.tsx:1`) and replace per-page `use(params)` + state where not strictly needed.

3) Routing Hygiene
   - Implement dashboard index summary or redirect logic.
   - Add `settings` stub page or remove sidebar entry (`src/components/profile/ProfileSidebar.tsx:28`).

4) DRY UI + Helpers
   - Add `DashboardHeader` and `DashboardLoading` components; update dashboard pages to use them.
   - Extract `normalizePostFormData` and refactor New/Edit pages to use it.

5) Translations Modularization
   - Split translations into domain modules; update imports in dashboard/profile/login pages.

6) Polish
   - Remove encoding artifacts; ensure consistent copy and error messages.

Acceptance Criteria
- Auth
  - Only one Supabase listener source for auth/session in the client.
  - `role` and capability helpers available from a single place (context).
- Guards
  - Visiting any `/${lang}/dashboard/*` as guest redirects to `/${lang}/login` without visible flicker.
  - Non-editor trying to access editor-only routes lands on `/${lang}/dashboard` (or profile) gracefully.
  - Admin-only analytics blocks non-admins consistently.
- Language
  - Dashboard pages no longer duplicate `use(params)` + `setLang`; they use context for `lang`.
- Routing
  - `/${lang}/dashboard` provides a summary or redirects as designed.
  - `/${lang}/dashboard/settings` link is either functional or removed.
- UI/Helpers
  - New/Edit use a shared form-data normalization; toasts/redirects consistent.
- Translations
  - Dashboard pages import domain translations; dashboard bundle size decreases.

Validation Plan
- Manual flows:
  - Guest → Login → Profile → Dashboard
  - Editor/Admin → Dashboard → Posts/New/Edit/Media/Tags/Analytics
  - Role change (editor → user) re-checks capability and routes correctly on refresh.
- Technical:
  - Verify only one auth subscription is active (no duplicate listeners).
  - Confirm dashboard pages no longer call `getCurrentUser()` redundantly.
  - Inspect route bundles (Next analysis) for decreased dashboard page size post-translations split.

Risks & Mitigations
- Risk: Context auth parity mismatch with existing `useAuth` behavior.
  - Mitigation: Implement context first, migrate call sites progressively, keep a short shim if necessary.
- Risk: Client-only guard may briefly render before redirect in edge cases.
  - Mitigation: Guard at layout level; render minimal placeholder while checking auth.
- Risk: Translation split creates import churn.
  - Mitigation: Do in one pass; keep `getTranslations` API shape consistent.

Rollback Plan
- Keep changes phased and reversible per step.
- If issues arise after unifying auth, revert to the prior hook while leaving guard/lang work intact.
- If translation split causes regressions, revert the split while keeping other refactors.

Work Checklist
- [ ] Extend `AuthContext` with role/capabilities
- [ ] Refactor `useRole` to use context; remove redundant `getCurrentUser()` calls
- [ ] Standardize `signOut` usage
- [ ] Add guard to `src/app/[lang]/dashboard/layout.tsx:1`
- [ ] Remove per-page guard effects (posts/new/edit/media/tags/analytics)
- [ ] Provide `lang` via context; remove per-page `use(params)` where possible
- [ ] Implement dashboard index summary or redirect
- [ ] Fix/remove `settings` link
- [ ] Add `DashboardHeader` and `DashboardLoading`
- [ ] Add `normalizePostFormData` and refactor New/Edit
- [ ] Split translations by domain and update imports
- [ ] Clean encoding artifacts

