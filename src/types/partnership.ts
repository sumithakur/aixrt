export interface PartnershipInterest {
  id: number;
  name: string;
}

export interface RoundtableLane {
  id: number;
  name: string;
  value: string;
}

export interface ProspectusDownloadPayload {
  full_name: string;
  work_email: string;
  organisation: string;
  role_title: string;
}

export interface ProspectusDownloadResponse extends ProspectusDownloadPayload {
  id: number;
  created_at: string;
  prospectus_url: string;
}

export interface DirectInquiryPayload {
  full_name: string;
  work_email: string;
  organisation: string;
  job_title: string;
  partnership_interest_id: number;
  preferred_roundtable_lane_id: number | null;
  strategic_focus_objectives: string;
}

export interface DirectInquiryResponse
  extends Omit<DirectInquiryPayload, 'partnership_interest_id' | 'preferred_roundtable_lane_id'> {
  id: number;
  partnership_interest: string;
  preferred_roundtable_lane: string | null;
  created_at: string;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
