# Patient Onboarding Funnel - Master Sprint Plan

## Sprint Metadata
- **Sprint Duration:** 3 days (24 development hours)
- **Team Size Assumption:** 1-2 developers
- **Risk Level:** Medium (integration dependencies, API limitations)
- **Sprint Start:** January 13, 2025
- **Sprint End:** January 15, 2025

## User Story
**As a patient**, I want to complete a health assessment questionnaire and upload my lab results, so that I can receive personalized health recommendations and supplement orders through integrated services.

## Technical Objectives

1. **OBJ-001:** Create patient-facing homepage with clear CTA to questionnaire (4 hours)
2. **OBJ-002:** Connect existing questionnaire flow to homepage funnel (2 hours)
3. **OBJ-003:** Implement manual lab result upload workflow (6 hours)
4. **OBJ-004:** Implement Fullscript redirect integration (3 hours)
5. **OBJ-005:** Implement Pure Insight redirect integration (2 hours)
6. **OBJ-006:** Create patient dashboard for results aggregation (4 hours)
7. **OBJ-007:** Implement error handling and fallback mechanisms (3 hours)

## Architecture Decisions

### Decision 1: Homepage as Primary Entry Point
**Rationale:** Currently app defaults to `/documents`. Need dedicated patient landing.
**Implementation:** New route at `/` with homepage component, update routing logic.

### Decision 2: Hardcoded Questionnaire Link (MVP)
**Rationale:** Faster implementation, questionnaire already exists.
**Implementation:** Direct link to `http://localhost:5173/questionnaires/e873eb2a-2e29-d46f-1f85-8dc3ad0b2fb2/form`

### Decision 3: Manual Upload First, API Later
**Rationale:** Immediate functionality while API integrations are developed.
**Implementation:** Phase 1: File upload → Phase 2: API automation

### Decision 4: Redux for State Management
**Rationale:** Existing pattern in codebase, RTK Query already configured.
**Implementation:** New slices for homepage and integration state.

## Task Breakdown

### Day 1: Foundation (8 hours)
| Task ID | Description | Estimate | Dependencies |
|---------|-------------|----------|--------------|
| T-001 | Create Homepage component structure | 2h | None |
| T-002 | Implement homepage routing | 1h | T-001 |
| T-003 | Design and style homepage UI | 2h | T-001 |
| T-004 | Add Redux state for homepage | 1h | T-002 |
| T-005 | Connect questionnaire CTA | 1h | T-002 |
| T-006 | Create PatientDashboard component | 1h | None |

### Day 2: Integration Flow (8 hours)
| Task ID | Description | Estimate | Dependencies |
|---------|-------------|----------|--------------|
| T-007 | Create IntegrationHub component | 2h | T-006 |
| T-008 | Implement manual upload UI | 2h | T-007 |
| T-009 | Connect to existing DocumentService | 1h | T-008 |
| T-010 | Create result processing logic | 2h | T-009 |
| T-011 | Implement Fullscript redirect button | 1h | T-007 |
| T-012 | Implement Pure Insight redirect button | 1h | T-007 |

### Day 3: API & Polish (8 hours)
| Task ID | Description | Estimate | Dependencies |
|---------|-------------|----------|--------------|
| T-013 | Implement error boundaries | 1h | All |
| T-014 | Add loading states and transitions | 1h | All |
| T-015 | Testing and bug fixes | 2h | All |

## Definition of Done

### Code Quality
- [ ] TypeScript types defined for all new components
- [ ] Components follow existing patterns (RTK Query, Redux)
- [ ] Error handling implemented for all async operations
- [ ] Loading states present for all data fetching

### Functionality
- [ ] Homepage loads at root path (`/`)
- [ ] Questionnaire link functional and tracked
- [ ] File upload accepts PDF/image formats
- [ ] Results display in patient dashboard
- [ ] Manual workflow complete end-to-end

### Documentation
- [ ] Component props documented with JSDoc
- [ ] API integration points documented
- [ ] README updated with new routes
- [ ] Environment variables documented

### Testing
- [ ] Unit tests for new Redux slices
- [ ] Component render tests created
- [ ] Manual E2E test completed
- [ ] Error scenarios tested

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API rate limits | High | Medium | Implement caching, manual fallback |
| CORS issues | Medium | High | Proxy configuration, backend relay |
| File size limits | Low | Medium | Client-side validation, chunking |
| OAuth complexity | High | High | Start with manual, phase in OAuth |

## Success Metrics
- Homepage → Questionnaire conversion rate baseline established
- Upload success rate > 95%
- Page load time < 2 seconds
- Zero critical bugs in production

## Technical Debt Acknowledged
- Hardcoded questionnaire ID (TODO: dynamic selection)
- Manual upload workflow (TODO: auto-fetch from partners)
- No real-time updates (TODO: websocket integration)
- Limited error recovery (TODO: retry mechanisms)

## Next Sprint Preview
- Implement Fullscript OAuth2 flow
- Begin outreach to Pure Insight for API access
- Create admin interface for questionnaire selection
- Implement automated result fetching
