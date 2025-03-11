export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorProfilePhoto: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorProfilePhoto: string;
  authorType: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  comments: Comment[];
  createdAt: string;
}