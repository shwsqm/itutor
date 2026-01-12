
export interface Tutor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  image: string;
  bio: string;
  subjects: string[];
  location: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export enum AppView {
  LANDING = 'LANDING',
  SEARCH = 'SEARCH',
  CLASSROOM = 'CLASSROOM'
}
