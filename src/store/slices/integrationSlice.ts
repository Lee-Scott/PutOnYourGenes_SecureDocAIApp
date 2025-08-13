import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface IntegrationState {
  selectedPartner: 'fullscript' | 'pure_insight' | 'manual' | null;
  uploadedFiles: string[];
  processingStatus: 'idle' | 'processing' | 'complete' | 'error';
}

const initialState: IntegrationState = {
  selectedPartner: null,
  uploadedFiles: [],
  processingStatus: 'idle',
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
    resetIntegrationState: (state) => {
      state.selectedPartner = null;
      state.uploadedFiles = [];
      state.processingStatus = 'idle';
    }
  },
});

export const { setSelectedPartner, addUploadedFile, setProcessingStatus, resetIntegrationState } = integrationSlice.actions;

export const selectIntegration = (state: RootState) => state.integration;

export default integrationSlice.reducer;
