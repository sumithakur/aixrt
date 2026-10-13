import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/api';
import type {
  AnnouncementSubscriberPayload,
  AnnouncementSubscriberResponse,
  ContactDepartmentOption,
  InstitutionalMessagePayload,
  InstitutionalMessageResponse,
} from '@/types/contact';

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Something went wrong');

export const fetchContactDepartmentOptions = createAsyncThunk<
  ContactDepartmentOption[],
  void,
  { rejectValue: string }
>('contact/fetchContactDepartmentOptions', async (_, { rejectWithValue }) => {
  try {
    return await apiRequest<ContactDepartmentOption[]>('/contact/department_options');
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const createInstitutionalMessage = createAsyncThunk<
  InstitutionalMessageResponse,
  InstitutionalMessagePayload,
  { rejectValue: string }
>('contact/createInstitutionalMessage', async (payload, { rejectWithValue }) => {
  try {
    return await apiRequest<InstitutionalMessageResponse>('/contact/institutional_messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const createAnnouncementSubscriber = createAsyncThunk<
  AnnouncementSubscriberResponse,
  AnnouncementSubscriberPayload,
  { rejectValue: string }
>('contact/createAnnouncementSubscriber', async (payload, { rejectWithValue }) => {
  try {
    return await apiRequest<AnnouncementSubscriberResponse>('/contact/announcement_subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});
