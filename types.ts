
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: 'client' | 'admin';
}

export interface Settings {
  id: number;
  bookingEnabled: boolean;
  careChatEnabled: boolean;
}

export interface TattooArtist {
  id: string;
  name: string;
  specialty: string;
  commissionRate: number;
  isAvailable: boolean;
  portfolio: string[];
}

export interface Appointment {
  id: string;
  date: string; // ISO string
  time: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  commissionAdjustment?: number | null;
  adjustmentNotes?: string | null;
  clientId: string;
  client: User;
  artistId: string;
  artist: TattooArtist;
}
