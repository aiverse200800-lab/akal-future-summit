export interface RegistrationData {
  student_name: string;
  school_name: string;
  grade: string;
  city: string;
  email: string;
  phone: string;
  school_board: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  dietary_requirements: string;
  accompanied: boolean;
  consent: boolean;
}

export interface RegistrationRecord extends RegistrationData {
  id: string;
  payment_id: string | null;
  payment_status: string;
  registration_ref: string | null;
  created_at: string;
}

export const SUMMIT_FEE = 5000;
export const SUMMIT_FEE_DISPLAY = '₹5,000';
export const SUMMIT_DATES = '22–23 October 2026';
export const SUMMIT_VENUE = 'Akal Academy Baru Sahib, Himachal Pradesh';
