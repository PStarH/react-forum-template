import { useEffect, useState } from 'react';
import './index.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import CreatePostButton from './components/CreatePostButton';
import WelcomeModal from './components/WelcomeModal';
import CreatePostModal from './components/CreatePostModal';
import PostDialog from './components/PostDialog';
import { Post } from './types';
import { useAuth } from './context/AuthContext';

const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to ForumFlow!',
    content: 'This is our brand new forum platform. We hope you enjoy the clean and modern interface. Feel free to explore and share your thoughts!',
    author: 'Admin',
    category: 'Announcements',
    createdAt: '2h ago',
    upvotes: 42,
    commentCount: 12,
    upvotedBy: []
  },
  {
    id: '2',
    title: 'Best practices for forum engagement',
    content: 'Here are some tips on how to get the most out of our community: Be kind, stay relevant, and contribute meaningfully to discussions.',
    author: 'Moderator',
    category: 'General Discussion',
    createdAt: '4h ago',
    upvotes: 28,
    commentCount: 8,
    upvotedBy: []
  },
  {
    id: '3',
    title: 'How do I customize my profile?',
    content: 'I\'m new here and wondering how to add an avatar and customize my profile settings. Any help would be appreciated!',
    author: 'NewUser123',
    category: 'Questions & Help',
    createdAt: '6h ago',
    upvotes: 15,
    commentCount: 5,
    upvotedBy: []
  }
];

function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    return savedPosts ? JSON.parse(savedPosts) : samplePosts;
  });

  const { user } = useAuth();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  // Listen for post updates
  useEffect(() => {
    const handlePostUpdate = () => {
      const savedPosts = localStorage.getItem('forumPosts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
        // Update selectedPost if it exists
        if (selectedPost) {
          const updatedPost = JSON.parse(savedPosts).find((p: Post) => p.id === selectedPost.id);
          if (updatedPost) {
            setSelectedPost(updatedPost);
          }
        }
      }
    };

    window.addEventListener('postsUpdated', handlePostUpdate);
    return () => window.removeEventListener('postsUpdated', handlePostUpdate);
  }, [selectedPost]);

  useEffect(() => {
    localStorage.setItem('forumPosts', JSON.stringify(posts));
  }, [posts]);

  const handleCloseWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  const handleCreatePost = (newPost: { title: string; content: string; category: string }) => {
    const post: Post = {
      id: Date.now().toString(),
      ...newPost,
      author: user?.username || 'Anonymous',
      createdAt: 'Just now',
      upvotes: 0,
      commentCount: 0,
      upvotedBy: []
    };
    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    window.dispatchEvent(new Event('postsUpdated'));
  };

  const handleUpvotePost = (postId: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasUpvoted = post.upvotedBy.includes(user.username);
        return {
          ...post,
          upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          upvotedBy: hasUpvoted
            ? post.upvotedBy.filter(u => u !== user.username)
            : [...post.upvotedBy, user.username]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    window.dispatchEvent(new Event('postsUpdated'));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            {selectedCategory && (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Category: {selectedCategory}
                </h2>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear filter
                </button>
              </div>
            )}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onClick={() => setSelectedPost(post)}
                  onUpvote={() => handleUpvotePost(post.id)}
                />
              ))}
              {filteredPosts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts found</p>
                </div>
              )}
            </div>
          </div>
          
          <Sidebar 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </main>

      <CreatePostButton onClick={() => setShowCreatePost(true)} />
      
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
      />

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onCreatePost={handleCreatePost}
      />

      <PostDialog
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onUpvote={handleUpvotePost}
      />
    </div>
  );
}

export default App;