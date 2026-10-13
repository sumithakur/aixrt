export interface ContactDepartmentOption {
  id: number;
  name: string;
  value: string;
}

export interface InstitutionalMessagePayload {
  full_name: string;
  work_email: string;
  organisation: string;
  department_option_id: number;
  message: string;
}

export interface InstitutionalMessageResponse
  extends Omit<InstitutionalMessagePayload, 'organisation' | 'department_option_id'> {
  id: number;
  organisation: string | null;
  department_enquiry_type: string;
  created_at: string;
}

export interface AnnouncementSubscriberPayload {
  email: string;
}

export interface AnnouncementSubscriberResponse extends AnnouncementSubscriberPayload {
  id: number;
  created_at: string;
  already_subscribed: boolean;
}
