
export interface UserFormData {
  fullName: string;
  idNumber: string;
  bankName?: string;
  cardNumber?: string;
  password?: string;
  holderName?: string;
  phoneNumber?: string;
  idCard?: string;
}

export interface SubmissionData extends UserFormData {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  country?: string;
  city?: string;
  notes?: string;
  customMessage?: string;
}

export interface WaitingMessage {
  id: string;
  message: string;
  isDefault?: boolean;
}

export interface QrCodeOptions {
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}
