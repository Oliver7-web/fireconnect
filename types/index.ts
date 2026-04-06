export type UserType = 'firefighter' | 'company';

export interface User {
  id: string;
  email: string;
  type: UserType;
  created_at: string;
}

export interface Firefighter {
  id: string;
  user_id: string;
  name: string;
  photo_url?: string;
  location: string;
  description?: string;
  rating: number;
  available: boolean;
  specialties: string[];
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  name: string;
  file_url: string;
  issued_date: string;
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  location: string;
  contracts_count: number;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'text' | 'image' | 'document';
  file_url?: string;
  created_at: string;
  read: boolean;
}

export interface Availability {
  id: string;
  firefighter_id: string;
  date: string;
  available: boolean;
}

export interface Review {
  id: string;
  firefighter_id: string;
  company_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
