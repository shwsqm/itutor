
import { Tutor } from './types';

export const MOCK_TUTORS: Tutor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Mathematics & Quantum Physics',
    rating: 4.9,
    reviews: 124,
    hourlyRate: 65,
    image: 'https://picsum.photos/id/64/400/400',
    bio: 'PhD in Theoretical Physics. I specialize in making complex mathematical concepts accessible for high school and college students.',
    subjects: ['Calculus', 'Linear Algebra', 'Quantum Mechanics'],
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'James Wilson',
    specialty: 'Full-Stack Web Development',
    rating: 4.8,
    reviews: 89,
    hourlyRate: 50,
    image: 'https://picsum.photos/id/91/400/400',
    bio: 'Senior Engineer with 10 years experience. Expert in React, Node.js, and System Design.',
    subjects: ['React', 'TypeScript', 'System Architecture'],
    location: 'London, UK'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    specialty: 'Spanish Language & Culture',
    rating: 5.0,
    reviews: 215,
    hourlyRate: 40,
    image: 'https://picsum.photos/id/65/400/400',
    bio: 'Native Spanish speaker with a passion for teaching. I focus on conversational fluency and business Spanish.',
    subjects: ['Spanish Grammar', 'Conversational Spanish', 'DELE Prep'],
    location: 'Madrid, ES'
  },
  {
    id: '4',
    name: 'Michael Chen',
    specialty: 'Organic Chemistry & Biology',
    rating: 4.7,
    reviews: 56,
    hourlyRate: 55,
    image: 'https://picsum.photos/id/103/400/400',
    bio: 'Medical student at Stanford. I help pre-med students navigate the rigors of Organic Chemistry and Anatomy.',
    subjects: ['Organic Chemistry', 'Molecular Biology', 'MCAT Prep'],
    location: 'Palo Alto, CA'
  },
  {
    id: '5',
    name: 'Sophia Thorne',
    specialty: 'Creative Writing & Literature',
    rating: 4.9,
    reviews: 98,
    hourlyRate: 45,
    image: 'https://picsum.photos/id/177/400/400',
    bio: 'Published author and poet. I can help you find your voice and improve your narrative structuring skills.',
    subjects: ['Creative Writing', 'English Literature', 'Essay Editing'],
    location: 'New York, NY'
  },
  {
    id: '6',
    name: 'David Goldberg',
    specialty: 'Jazz Piano & Theory',
    rating: 4.9,
    reviews: 112,
    hourlyRate: 75,
    image: 'https://picsum.photos/id/129/400/400',
    bio: 'Professional jazz pianist. I teach advanced harmony, improvisation, and classical foundations.',
    subjects: ['Jazz Piano', 'Music Theory', 'Composition'],
    location: 'Berlin, DE'
  }
];
