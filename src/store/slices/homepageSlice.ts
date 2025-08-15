import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface HomepageState {
  visitMetrics: {
    visitTimestamp: string;
    referralSource: string | null;
  };
  userJourney: {
    currentStep: 'landing' | 'upload' | 'process' | 'interact' | 'dashboard' | 'questionnaire' | 'results';
    completedSteps: string[];
    lastActionTimestamp: string;
  };
}

const initialState: HomepageState = {
  visitMetrics: {
    visitTimestamp: '',
    referralSource: null,
  },
  userJourney: {
    currentStep: 'landing',
    completedSteps: [],
    lastActionTimestamp: '',
  },
};

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    setVisitMetrics: (state, action: PayloadAction<{ visitTimestamp: string; referralSource: string | null }>) => {
      state.visitMetrics.visitTimestamp = action.payload.visitTimestamp;
      state.visitMetrics.referralSource = action.payload.referralSource;
    },
    updateJourneyStep: (state, action: PayloadAction<'landing' | 'upload' | 'process' | 'interact' | 'dashboard' | 'questionnaire' | 'results'>) => {
      state.userJourney.currentStep = action.payload;
      state.userJourney.lastActionTimestamp = new Date().toISOString();
      if (!state.userJourney.completedSteps.includes(action.payload)) {
        state.userJourney.completedSteps.push(action.payload);
      }
    },
  },
});

export const { setVisitMetrics, updateJourneyStep } = homepageSlice.actions;

export const selectUserJourney = (state: RootState) => state.homepage.userJourney;
export const selectVisitMetrics = (state: RootState) => state.homepage.visitMetrics;

export default homepageSlice.reducer;
