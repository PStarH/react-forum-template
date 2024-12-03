import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, Post } from '../types';
import bcrypt from 'bcryptjs';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize default admin account if it doesn't exist
const initializeAdmin = async () => {
  const users = JSON.parse(localStorage.getItem('forumUsers') || '[]');
  if (!users.some((u: any) => u.email === 'admin@admin.com')) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    users.push({
      email: 'admin@admin.com',
      username: 'admin',
      passwordHash,
      isAdmin: true,
    });
    localStorage.setItem('forumUsers', JSON.stringify(users));
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('forumUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    initializeAdmin();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('forumUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('forumUser');
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('forumUsers') || '[]');
    const user = users.find((u: any) => u.email === email);
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      setUser({
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin || false,
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    const users = JSON.parse(localStorage.getItem('forumUsers') || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }

    if (users.some((u: any) => u.username === username)) {
      throw new Error('Username already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      email,
      username,
      passwordHash,
      isAdmin: false,
    };

    users.push(newUser);
    localStorage.setItem('forumUsers', JSON.stringify(users));

    setUser({
      email,
      username,
      isAdmin: false,
    });
  };

  const signOut = () => {
    setUser(null);
  };

  const deletePost = (postId: string) => {
    if (!user?.isAdmin) return;

    const posts: Post[] = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));

    // Clean up associated comments
    localStorage.removeItem(`comments_${postId}`);

    window.dispatchEvent(new Event('storage')); // Trigger update in components
  };

  const addCategory = (name: string) => {
    if (!user?.isAdmin) return;

    const categories = JSON.parse(localStorage.getItem('forumCategories') || '[]');
    const newCategory = {
      id: Date.now().toString(),
      name,
      count: 0,
    };
    categories.push(newCategory);
    localStorage.setItem('forumCategories', JSON.stringify(categories));
    window.dispatchEvent(new Event('storage'));
  };

  const deleteCategory = (categoryId: string) => {
    if (!user?.isAdmin) return;

    const categories = JSON.parse(localStorage.getItem('forumCategories') || '[]');
    const updatedCategories = categories.filter((cat: any) => cat.id !== categoryId);
    localStorage.setItem('forumCategories', JSON.stringify(updatedCategories));
    window.dispatchEvent(new Event('storage'));
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    deletePost,
    addCategory,
    deleteCategory,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}