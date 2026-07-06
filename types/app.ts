export interface User {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  genre: string;
  rating: number;
  views: number;
  uploadDate: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface MoviesFilter {
  genre?: string;
  search?: string;
  limit?: number;
  sortBy?: 'rating' | 'views' | 'uploadDate';
  sortOrder?: 'asc' | 'desc';
}
