# Homepage Implementation Specification

## Component Structure

### Component Tree
```
Homepage
├── HeroSection
│   ├── Logo
│   ├── Headline
│   ├── Subheadline
│   └── CTAButton (→ Questionnaire)
├── BenefitsSection
│   ├── BenefitCard (Health Assessment)
│   ├── BenefitCard (Lab Integration)
│   └── BenefitCard (Personalized Recommendations)
├── ProcessSection
│   ├── ProcessStep (1. Complete Assessment)
│   ├── ProcessStep (2. Upload Lab Results)
│   └── ProcessStep (3. Get Recommendations)
└── FooterCTA
    ├── SecondaryHeadline
    └── CTAButton (→ Questionnaire)
```

## Redux State Shape

```typescript
// src/store/slices/homepageSlice.ts
interface HomepageState {
  visitMetrics: {
    visitTimestamp: string;
    referralSource: string | null;
    hasStartedQuestionnaire: boolean;
    hasCompletedQuestionnaire: boolean;
  };
  userJourney: {
    currentStep: 'landing' | 'questionnaire' | 'upload' | 'results';
    completedSteps: string[];
    lastActionTimestamp: string;
  };
  integrationStatus: {
    selectedPartner: 'rupa' | 'fullscript' | 'manual' | null;
    uploadedFiles: string[];
    processingStatus: 'idle' | 'processing' | 'complete' | 'error';
  };
}
```

## Route Configuration

```typescript
// Update src/main.tsx
const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    {/* New Homepage Route - Public */}
    <Route index element={<Homepage />} />
    
    {/* Existing auth routes */}
    <Route path='login' element={<Login />} />
    
    <Route element={<ProtectedRoute />}>
      {/* Change default authenticated route */}
      <Route path='/dashboard' element={<PatientDashboard />} />
      
      {/* Integration Hub - New */}
      <Route path='/integrations' element={<IntegrationHub />} />
      
      {/* Existing routes remain... */}
    </Route>
  </Route>
));
```

## Component Implementation

### Homepage.tsx
```typescript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setVisitMetrics, updateJourneyStep } from '../store/slices/homepageSlice';
import './Homepage.css';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userJourney } = useSelector((state: RootState) => state.homepage);
  
  // Hardcoded questionnaire URL for MVP
  const QUESTIONNAIRE_URL = '/questionnaires/e873eb2a-2e29-d46f-1f85-8dc3ad0b2fb2/form';
  
  useEffect(() => {
    // Track homepage visit
    dispatch(setVisitMetrics({
      visitTimestamp: new Date().toISOString(),
      referralSource: document.referrer || null,
    }));
  }, [dispatch]);
  
  const handleStartAssessment = () => {
    dispatch(updateJourneyStep('questionnaire'));
    navigate(QUESTIONNAIRE_URL);
  };
  
  return (
    <div className="homepage-container">
      <HeroSection onCTAClick={handleStartAssessment} />
      <BenefitsSection />
      <ProcessSection currentStep={userJourney.currentStep} />
      <FooterCTA onCTAClick={handleStartAssessment} />
    </div>
  );
};
```

### HeroSection.tsx
```typescript
interface HeroSectionProps {
  onCTAClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCTAClick }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <img src="/assets/logo.png" alt="PutOnYourGenes" className="hero-logo" />
        <h1 className="hero-headline">
          Personalized Health Starts Here
        </h1>
        <p className="hero-subheadline">
          Complete your health assessment and get personalized recommendations 
          based on your lab results and genetic data
        </p>
        <button 
          className="cta-button cta-primary"
          onClick={onCTAClick}
          aria-label="Start your health assessment"
        >
          Start Your Assessment
        </button>
      </div>
    </section>
  );
};
```

## CTA Strategy

### Primary CTA
- **Text:** "Start Your Assessment"
- **Action:** Navigate to questionnaire form
- **Tracking:** Dispatch Redux action for journey tracking
- **Style:** Primary button with pulse animation

### Secondary CTAs
- **Upload Results:** For returning users
- **View Dashboard:** For authenticated users with completed assessments
- **Learn More:** Scroll to process section

### CTA Placement
1. Above the fold in hero section
2. After benefits section
3. Footer sticky CTA on mobile
4. Floating action button after scroll

## Responsive Design Requirements

### Desktop (≥1024px)
```css
.homepage-container {
  max-width: 1440px;
  margin: 0 auto;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
```

### Tablet (768px - 1023px)
```css
.hero-section {
  min-height: 80vh;
  padding: 2rem;
}

.benefits-grid {
  grid-template-columns: repeat(2, 1fr);
}

.process-steps {
  flex-direction: column;
}
```

### Mobile (< 768px)
```css
.hero-section {
  min-height: 100vh;
  padding: 1rem;
  text-align: center;
}

.benefits-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.cta-button {
  width: 100%;
  position: sticky;
  bottom: 0;
}
```

## Accessibility Considerations

### WCAG 2.1 AA Compliance
- **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators:** Visible focus outline on all interactive elements
- **Semantic HTML:** Proper heading hierarchy (h1 → h2 → h3)
- **ARIA Labels:** Descriptive labels for all buttons and links

### Keyboard Navigation
```typescript
// Keyboard navigation support
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === document.activeElement) {
      if (document.activeElement?.classList.contains('cta-button')) {
        handleStartAssessment();
      }
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Screen Reader Support
```html
<main role="main" aria-label="Patient onboarding homepage">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Personalized Health Starts Here</h1>
  </section>
  
  <section aria-labelledby="benefits-heading">
    <h2 id="benefits-heading" class="sr-only">Benefits of our service</h2>
  </section>
  
  <nav aria-label="Assessment process steps">
    <ol class="process-steps">
      <li aria-current={currentStep === 1 ? 'step' : undefined}>
        Step 1: Complete Assessment
      </li>
    </ol>
  </nav>
</main>
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load heavy components
const BenefitsSection = React.lazy(() => import('./BenefitsSection'));
const ProcessSection = React.lazy(() => import('./ProcessSection'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <BenefitsSection />
  <ProcessSection />
</Suspense>
```

### Image Optimization
- **Format:** Use WebP for modern browsers, with PNG fallback
- **Compression:** Compress all images using a tool like ImageOptim
- **Lazy Loading:** Use `loading="lazy"` attribute for below-the-fold images

### Caching
- **Strategy:** Use `Cache-Control` headers for static assets
- **Service Worker:** Consider a service worker for offline capabilities (future enhancement)
