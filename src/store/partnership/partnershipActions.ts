import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/api';
import type {
  DirectInquiryPayload,
  DirectInquiryResponse,
  PartnershipInterest,
  ProspectusDownloadPayload,
  ProspectusDownloadResponse,
  RoundtableLane,
} from '@/types/partnership';

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Something went wrong');

export const fetchPartnershipInterests = createAsyncThunk<PartnershipInterest[], void, { rejectValue: string }>(
  'partnership/fetchPartnershipInterests',
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest<PartnershipInterest[]>('/partnership/partner_interest_options');
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const fetchRoundtableLanes = createAsyncThunk<RoundtableLane[], void, { rejectValue: string }>(
  'partnership/fetchRoundtableLanes',
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest<RoundtableLane[]>('/partnership/partner_roundtable_lanes');
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const createProspectusDownload = createAsyncThunk<
  ProspectusDownloadResponse,
  ProspectusDownloadPayload,
  { rejectValue: string }
>('partnership/createProspectusDownload', async (payload, { rejectWithValue }) => {
  try {
    return await apiRequest<ProspectusDownloadResponse>('/partnership/prospectus_downloads', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const createDirectInquiry = createAsyncThunk<
  DirectInquiryResponse,
  DirectInquiryPayload,
  { rejectValue: string }
>('partnership/createDirectInquiry', async (payload, { rejectWithValue }) => {
  try {
    return await apiRequest<DirectInquiryResponse>('/partnership/direct_inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});
