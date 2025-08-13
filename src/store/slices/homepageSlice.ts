import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

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
}

const initialState: HomepageState = {
  visitMetrics: {
    visitTimestamp: '',
    referralSource: null,
    hasStartedQuestionnaire: false,
    hasCompletedQuestionnaire: false,
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
    updateJourneyStep: (state, action: PayloadAction<'landing' | 'questionnaire' | 'upload' | 'results'>) => {
      state.userJourney.currentStep = action.payload;
      state.userJourney.lastActionTimestamp = new Date().toISOString();
      if (!state.userJourney.completedSteps.includes(action.payload)) {
        state.userJourney.completedSteps.push(action.payload);
      }
    },
    setQuestionnaireStarted: (state) => {
        state.visitMetrics.hasStartedQuestionnaire = true;
    },
    setQuestionnaireCompleted: (state) => {
        state.visitMetrics.hasCompletedQuestionnaire = true;
    }
  },
});

export const { setVisitMetrics, updateJourneyStep, setQuestionnaireStarted, setQuestionnaireCompleted } = homepageSlice.actions;

export const selectUserJourney = (state: RootState) => state.homepage.userJourney;
export const selectVisitMetrics = (state: RootState) => state.homepage.visitMetrics;

export default homepageSlice.reducer;
