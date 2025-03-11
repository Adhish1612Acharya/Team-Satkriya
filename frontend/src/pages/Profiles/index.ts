// Common types used across the application

export interface BaseProfile {
    id: string;
    name: string;
    profilePhoto: string;
    phoneNumber: string;
    email: string;
    address?: string;
  }
  
  export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorProfilePhoto: string;
    authorType: 'Farmer' | 'Doctor' | 'NGO' | 'Volunteer' | 'ResearchInstitute';
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    likes: number;
    comments: Comment[];
    createdAt: string;
  }
  
  export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorProfilePhoto: string;
    content: string;
    createdAt: string;
  }