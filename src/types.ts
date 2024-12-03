export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  upvotes: number;
  commentCount: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}