import { createSlice } from '@reduxjs/toolkit';
import type { RequestStatus } from '@/types/partnership';
import type {
  AnnouncementSubscriberResponse,
  ContactDepartmentOption,
  InstitutionalMessageResponse,
} from '@/types/contact';
import {
  createAnnouncementSubscriber,
  createInstitutionalMessage,
  fetchContactDepartmentOptions,
} from './contactActions';

interface RequestState<T> {
  data: T;
  status: RequestStatus;
  error: string | null;
}

export interface ContactState {
  departmentOptions: RequestState<ContactDepartmentOption[]>;
  institutionalMessage: RequestState<InstitutionalMessageResponse | null>;
  announcementSubscriber: RequestState<AnnouncementSubscriberResponse | null>;
}

const initialState: ContactState = {
  departmentOptions: { data: [], status: 'idle', error: null },
  institutionalMessage: { data: null, status: 'idle', error: null },
  announcementSubscriber: { data: null, status: 'idle', error: null },
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetInstitutionalMessage(state) {
      state.institutionalMessage = initialState.institutionalMessage;
    },
    resetAnnouncementSubscriber(state) {
      state.announcementSubscriber = initialState.announcementSubscriber;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactDepartmentOptions.pending, (state) => {
        state.departmentOptions.status = 'loading';
        state.departmentOptions.error = null;
      })
      .addCase(fetchContactDepartmentOptions.fulfilled, (state, action) => {
        state.departmentOptions.status = 'succeeded';
        state.departmentOptions.data = action.payload;
      })
      .addCase(fetchContactDepartmentOptions.rejected, (state, action) => {
        state.departmentOptions.status = 'failed';
        state.departmentOptions.error = action.payload ?? 'Unable to load enquiry types';
      })

      .addCase(createInstitutionalMessage.pending, (state) => {
        state.institutionalMessage.status = 'loading';
        state.institutionalMessage.error = null;
      })
      .addCase(createInstitutionalMessage.fulfilled, (state, action) => {
        state.institutionalMessage.status = 'succeeded';
        state.institutionalMessage.data = action.payload;
      })
      .addCase(createInstitutionalMessage.rejected, (state, action) => {
        state.institutionalMessage.status = 'failed';
        state.institutionalMessage.error = action.payload ?? 'Unable to send your message';
      })

      .addCase(createAnnouncementSubscriber.pending, (state) => {
        state.announcementSubscriber.status = 'loading';
        state.announcementSubscriber.error = null;
      })
      .addCase(createAnnouncementSubscriber.fulfilled, (state, action) => {
        state.announcementSubscriber.status = 'succeeded';
        state.announcementSubscriber.data = action.payload;
      })
      .addCase(createAnnouncementSubscriber.rejected, (state, action) => {
        state.announcementSubscriber.status = 'failed';
        state.announcementSubscriber.error = action.payload ?? 'Unable to subscribe';
      });
  },
});

export const { resetInstitutionalMessage, resetAnnouncementSubscriber } = contactSlice.actions;
export default contactSlice.reducer;
