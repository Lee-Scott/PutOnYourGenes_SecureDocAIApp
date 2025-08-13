# Fullscript Integration Plan (Frontend) - CDCI-Frontend.md

## 1. Overview

This document outlines the complete frontend implementation plan for integrating the Fullscript API into the patient onboarding web application. The goal is to replace the current simple redirect with a full OAuth2 authentication flow, allowing the application to fetch and display patient data from Fullscript securely.

This plan covers environment setup, Redux state management, component implementation, API service creation, user flow changes, and risk assessment. The implementation will be done entirely on the frontend, with the assumption that a secure method (like a serverless function) will handle the final token exchange.

---

## 2. Environment Setup

Before starting, ensure your `.env` file is updated with the following variables. The `CLIENT_ID` and `CLIENT_SECRET` will be provided separately.

```
# .env

# Fullscript API Credentials
VITE_FULLSCRIPT_CLIENT_ID="GacRNEHAC35aOq5LxZK8vP5Em6h-XFm0qAz0xRCnchY"
VITE_FULLSCRIPT_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"

# Fullscript Redirect URIs
VITE_FULLSCRIPT_REDIRECT_URI_DEV="http://localhost:5173/documents"
VITE_FULLSCRIPT_REDIRECT_URI_PROD="https://your-app.com/documents"
```

---

## 3. Implementation Plan

### 3.1. Authentication Flow (OAuth2)

The integration will use the OAuth2 Authorization Code Flow.

1.  **Initiation:** The user clicks a "Connect to Fullscript" button in the `IntegrationHub` component. This action redirects them to the Fullscript OAuth Authorization URL.
2.  **Authorization:** The user logs into Fullscript and authorizes the application.
3.  **Redirect:** Fullscript redirects the user back to our application at the specified `redirect_uri` (`/documents`), including an authorization `code` in the URL parameters.
4.  **Token Exchange:** The application captures the `code` from the URL. This code is then exchanged for an `access_token` and `refresh_token`. **Note:** Since this is a frontend-only plan, the actual exchange of the code for a token (which requires the `client_secret`) must happen securely. A serverless function (e.g., AWS Lambda, Vercel Functions) is the recommended approach to avoid exposing the secret in the browser. The frontend will call this function with the `code`.
5.  **Token Storage:** The received `access_token` and its expiration time will be stored securely in the Redux state.

### 3.2. Component Implementation

#### `src/components/IntegrationHub/IntegrationHub.tsx` (Updated)

This component will be updated to include the new OAuth button.

```typescript
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const IntegrationHub: React.FC = () => {
  const { fullscriptAuthStatus } = useSelector((state: RootState) => state.integration);

  const handleFullscriptConnect = () => {
    const redirectUri = import.meta.env.DEV
      ? import.meta.env.VITE_FULLSCRIPT_REDIRECT_URI_DEV
      : import.meta.env.VITE_FULLSCRIPT_REDIRECT_URI_PROD;
    
    const authUrl = `https://us-snd.fullscript.io/oauth/authorize?client_id=${import.meta.env.VITE_FULLSCRIPT_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=patient.read+recommendation.read`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="integration-hub-container">
      <h2>Connect with Our Partners</h2>
      {fullscriptAuthStatus !== 'authenticated' ? (
        <button className="btn btn-primary" onClick={handleFullscriptConnect}>
          Connect to Fullscript
        </button>
      ) : (
        <p>✅ Connected to Fullscript</p>
      )}
      {/* ... other integration options ... */}
    </div>
  );
};

export default IntegrationHub;
```

#### `src/components/documents/Documents.tsx` (Updated to handle callback)

This component will now handle the OAuth callback.

```typescript
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { exchangeFullscriptCode } from '../../store/slices/integrationSlice';
// ... other imports

const Documents: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      // Remove the code from the URL to prevent re-triggering
      navigate('/documents', { replace: true });
      // Dispatch a thunk to exchange the code for a token
      dispatch(exchangeFullscriptCode(code));
    }
  }, [location, navigate, dispatch]);

  // ... rest of the component logic
  return (
    // ... component JSX
  );
};

export default Documents;
```

#### `src/components/PatientDashboard/FullscriptDashboard.tsx` (New)

This new component will display the data fetched from Fullscript.

```typescript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchFullscriptRecommendations } from '../../store/slices/integrationSlice';

const FullscriptDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { fullscriptData, fullscriptAuthStatus } = useSelector((state: RootState) => state.integration);

  useEffect(() => {
    if (fullscriptAuthStatus === 'authenticated') {
      dispatch(fetchFullscriptRecommendations());
    }
  }, [dispatch, fullscriptAuthStatus]);

  if (fullscriptData.status === 'loading') {
    return <div>Loading Fullscript data...</div>;
  }

  if (fullscriptData.status === 'error') {
    return (
      <div>
        <p>Failed to load Fullscript data. Please try again later.</p>
        <a href="https://us.fullscript.com" target="_blank" rel="noopener noreferrer">
          Go to Fullscript
        </a>
      </div>
    );
  }

  return (
    <div className="fullscript-dashboard">
      <h3>Your Fullscript Recommendations</h3>
      <ul>
        {fullscriptData.recommendations.map((rec: any) => (
          <li key={rec.id}>{rec.name} - {rec.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default FullscriptDashboard;
```

### 3.3. API Service

#### `src/service/FullscriptService.ts` (New)

This service will handle all API calls to Fullscript.

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

export const fullscriptApi = createApi({
  reducerPath: 'fullscriptApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://us-snd.fullscript.io/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).integration.fullscriptAccessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRecommendations: builder.query<any, void>({
      query: () => 'recommendations',
    }),
    getPatientDetails: builder.query<any, string>({
      query: (patientId) => `patients/${patientId}`,
    }),
  }),
});

export const { useGetRecommendationsQuery, useGetPatientDetailsQuery } = fullscriptApi;
```

---

## 4. Redux State Changes

### `src/store/slices/integrationSlice.ts` (Updated)

This slice will be updated to manage the Fullscript integration state.

```typescript
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// This is a placeholder for the serverless function call
const exchangeCodeForTokenAPI = async (code: string): Promise<{ access_token: string; expires_in: number }> => {
  // In a real app, this would be a fetch call to your serverless function
  // e.g., const response = await fetch('/api/fullscript-token', { method: 'POST', body: JSON.stringify({ code }) });
  console.log("Exchanging code:", code);
  // For demonstration, return a mock token
  return { access_token: 'mock_access_token', expires_in: 7200 };
};

export const exchangeFullscriptCode = createAsyncThunk(
  'integration/exchangeFullscriptCode',
  async (code: string) => {
    const response = await exchangeCodeForTokenAPI(code);
    return response;
  }
);

// ... similar async thunk for fetchFullscriptRecommendations

interface IntegrationState {
  // ... existing state
  fullscriptAuthStatus: 'idle' | 'authenticating' | 'authenticated' | 'error';
  fullscriptAccessToken: string | null;
  fullscriptTokenExpiresAt: number | null;
  fullscriptData: {
    recommendations: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'error';
    error: string | null;
  };
}

const initialState: IntegrationState = {
  // ... existing initial state
  fullscriptAuthStatus: 'idle',
  fullscriptAccessToken: null,
  fullscriptTokenExpiresAt: null,
  fullscriptData: {
    recommendations: [],
    status: 'idle',
    error: null,
  },
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    // ... existing reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(exchangeFullscriptCode.pending, (state) => {
        state.fullscriptAuthStatus = 'authenticating';
      })
      .addCase(exchangeFullscriptCode.fulfilled, (state, action) => {
        state.fullscriptAuthStatus = 'authenticated';
        state.fullscriptAccessToken = action.payload.access_token;
        state.fullscriptTokenExpiresAt = Date.now() + action.payload.expires_in * 1000;
      })
      .addCase(exchangeFullscriptCode.rejected, (state) => {
        state.fullscriptAuthStatus = 'error';
      });
      // ... add cases for fetchFullscriptRecommendations
  },
});

export default integrationSlice.reducer;
```

---

## 5. User Flow

```mermaid
graph TD
    A[Patient completes Questionnaire] --> B[Navigates to IntegrationHub];
    B --> C{User clicks "Connect to Fullscript"};
    C --> D[Redirect to Fullscript OAuth];
    D --> E{User authorizes App};
    E --> F[Redirect back to /documents with Auth Code];
    F --> G{App exchanges Code for Access Token};
    G --> H[Token stored in Redux];
    H --> I[Display FullscriptDashboard];
    I --> J[Fetch & Display Recommendations];
```

**Route Changes:**
*   The `/documents` route will now contain logic to handle the OAuth callback.
*   A new component, `FullscriptDashboard`, will be displayed on the main dashboard page (`/dashboard`) if the user is authenticated with Fullscript.

---

## 6. Risk Assessment & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| **OAuth Token Expiration** | Before making an API call, check if the token is expired. If it is, use the refresh token to get a new one. If the refresh fails, prompt the user to re-authenticate. |
| **API Failures** | Implement robust error handling in the RTK Query service. Display user-friendly error messages and provide a fallback link to the Fullscript website. |
| **Security/HIPAA** | **Never** store the `client_secret` on the frontend. Use a serverless function for the token exchange. Store the access token in `sessionStorage` or Redux state, not `localStorage`, to ensure it is cleared when the session ends. All API calls must be over HTTPS. |
| **Redirect URI Mismatch** | Ensure the `VITE_FULLSCRIPT_REDIRECT_URI_DEV` and `VITE_FULLSCRIPT_REDIRECT_URI_PROD` variables are correctly configured in both the `.env` files and the Fullscript developer dashboard. |

---

## 7. Task Breakdown

| Task | Priority | Estimated Effort |
| :--- | :--- | :--- |
| 1. Update `.env` file with Fullscript variables | High | 0.5h |
| 2. Update `integrationSlice.ts` with new state and thunks | High | 3h |
| 3. Update `IntegrationHub.tsx` with OAuth button | High | 1h |
| 4. Implement OAuth callback logic in `Documents.tsx` | High | 2h |
| 5. Create `FullscriptService.ts` with RTK Query | Medium | 2h |
| 6. Create `FullscriptDashboard.tsx` component | Medium | 3h |
| 7. Implement error handling and fallback link | Medium | 1h |
| 8. Testing and QA | High | 2h |
| **Total** | | **14.5h** |
