import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface IntegrationState {
  selectedPartner: 'fullscript' | 'pure_insight' | 'manual' | null;
  uploadedFiles: string[];
  processingStatus: 'idle' | 'processing' | 'complete' | 'error';
  selectedReport: string | null;
  selectedIntegrations: string[];
}

const initialState: IntegrationState = {
  selectedPartner: null,
  uploadedFiles: [],
  processingStatus: 'idle',
  selectedReport: null,
  selectedIntegrations: [],
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    setSelectedPartner: (state, action: PayloadAction<'fullscript' | 'pure_insight' | 'manual' | null>) => {
      state.selectedPartner = action.payload;
    },
    addUploadedFile: (state, action: PayloadAction<string>) => {
      state.uploadedFiles.push(action.payload);
    },
    setProcessingStatus: (state, action: PayloadAction<'idle' | 'processing' | 'complete' | 'error'>) => {
      state.processingStatus = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<string | null>) => {
      state.selectedReport = action.payload;
    },
    setSelectedIntegrations: (state, action: PayloadAction<string[]>) => {
      state.selectedIntegrations = action.payload;
    },
    resetIntegrationState: (state) => {
      state.selectedPartner = null;
      state.uploadedFiles = [];
      state.processingStatus = 'idle';
      state.selectedReport = null;
      state.selectedIntegrations = [];
    }
  },
});

export const { setSelectedPartner, addUploadedFile, setProcessingStatus, setSelectedReport, resetIntegrationState, setSelectedIntegrations } = integrationSlice.actions;

export const selectIntegration = (state: RootState) => state.integration;

export default integrationSlice.reducer;
