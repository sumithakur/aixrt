import { createSlice } from '@reduxjs/toolkit';
import type {
  DirectInquiryResponse,
  PartnershipInterest,
  ProspectusDownloadResponse,
  RequestStatus,
  RoundtableLane,
} from '@/types/partnership';
import {
  createDirectInquiry,
  createProspectusDownload,
  fetchPartnershipInterests,
  fetchRoundtableLanes,
} from './partnershipActions';

interface RequestState<T> {
  data: T;
  status: RequestStatus;
  error: string | null;
}

export interface PartnershipState {
  interests: RequestState<PartnershipInterest[]>;
  roundtableLanes: RequestState<RoundtableLane[]>;
  prospectusDownload: RequestState<ProspectusDownloadResponse | null>;
  directInquiry: RequestState<DirectInquiryResponse | null>;
}

const initialState: PartnershipState = {
  interests: { data: [], status: 'idle', error: null },
  roundtableLanes: { data: [], status: 'idle', error: null },
  prospectusDownload: { data: null, status: 'idle', error: null },
  directInquiry: { data: null, status: 'idle', error: null },
};

const partnershipSlice = createSlice({
  name: 'partnership',
  initialState,
  reducers: {
    resetProspectusDownload(state) {
      state.prospectusDownload = initialState.prospectusDownload;
    },
    resetDirectInquiry(state) {
      state.directInquiry = initialState.directInquiry;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnershipInterests.pending, (state) => {
        state.interests.status = 'loading';
        state.interests.error = null;
      })
      .addCase(fetchPartnershipInterests.fulfilled, (state, action) => {
        state.interests.status = 'succeeded';
        state.interests.data = action.payload;
      })
      .addCase(fetchPartnershipInterests.rejected, (state, action) => {
        state.interests.status = 'failed';
        state.interests.error = action.payload ?? 'Unable to load partnership interests';
      })

      .addCase(fetchRoundtableLanes.pending, (state) => {
        state.roundtableLanes.status = 'loading';
        state.roundtableLanes.error = null;
      })
      .addCase(fetchRoundtableLanes.fulfilled, (state, action) => {
        state.roundtableLanes.status = 'succeeded';
        state.roundtableLanes.data = action.payload;
      })
      .addCase(fetchRoundtableLanes.rejected, (state, action) => {
        state.roundtableLanes.status = 'failed';
        state.roundtableLanes.error = action.payload ?? 'Unable to load roundtable lanes';
      })

      .addCase(createProspectusDownload.pending, (state) => {
        state.prospectusDownload.status = 'loading';
        state.prospectusDownload.error = null;
      })
      .addCase(createProspectusDownload.fulfilled, (state, action) => {
        state.prospectusDownload.status = 'succeeded';
        state.prospectusDownload.data = action.payload;
      })
      .addCase(createProspectusDownload.rejected, (state, action) => {
        state.prospectusDownload.status = 'failed';
        state.prospectusDownload.error = action.payload ?? 'Unable to request the prospectus';
      })

      .addCase(createDirectInquiry.pending, (state) => {
        state.directInquiry.status = 'loading';
        state.directInquiry.error = null;
      })
      .addCase(createDirectInquiry.fulfilled, (state, action) => {
        state.directInquiry.status = 'succeeded';
        state.directInquiry.data = action.payload;
      })
      .addCase(createDirectInquiry.rejected, (state, action) => {
        state.directInquiry.status = 'failed';
        state.directInquiry.error = action.payload ?? 'Unable to submit your enquiry';
      });
  },
});

export const { resetProspectusDownload, resetDirectInquiry } = partnershipSlice.actions;
export default partnershipSlice.reducer;
