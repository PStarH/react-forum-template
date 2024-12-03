export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  upvotes: number;
  commentCount: number;
  upvotedBy: string[];
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
  parentId: string | null;
  upvotes: number;
  upvotedBy: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface User {
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  deletePost: (postId: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (categoryId: string) => void;
}

// Helper function to get all categories (default + custom)
export function getAllCategories(): Category[] {
  const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'General Discussion', count: 0 },
    { id: '2', name: 'Announcements', count: 0 },
    { id: '3', name: 'Questions & Help', count: 0 },
    { id: '4', name: 'Show & Tell', count: 0 },
    { id: '5', name: 'Off-Topic', count: 0 },
  ];

  const savedCategories = JSON.parse(localStorage.getItem('forumCategories') || '[]');
  const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');

  // Combine default and custom categories
  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...savedCategories.filter((cat: Category) => 
      !DEFAULT_CATEGORIES.some(defaultCat => defaultCat.name === cat.name)
    )
  ];

  // Update counts for all categories
  return allCategories.map(category => ({
    ...category,
    count: posts.filter((post: Post) => post.category === category.name).length
  }));
}