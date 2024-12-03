import { useEffect, useState } from 'react';
import './index.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import CreatePostButton from './components/CreatePostButton';
import WelcomeModal from './components/WelcomeModal';
import { Post } from './types';

const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to ForumFlow!',
    content: 'This is our brand new forum platform. We hope you enjoy the clean and modern interface. Feel free to explore and share your thoughts!',
    author: 'Admin',
    category: 'Announcements',
    createdAt: '2h ago',
    upvotes: 42,
    commentCount: 12
  },
  {
    id: '2',
    title: 'Best practices for forum engagement',
    content: 'Here are some tips on how to get the most out of our community: Be kind, stay relevant, and contribute meaningfully to discussions.',
    author: 'Moderator',
    category: 'General Discussion',
    createdAt: '4h ago',
    upvotes: 28,
    commentCount: 8
  },
  {
    id: '3',
    title: 'How do I customize my profile?',
    content: 'I\'m new here and wondering how to add an avatar and customize my profile settings. Any help would be appreciated!',
    author: 'NewUser123',
    category: 'Questions & Help',
    createdAt: '6h ago',
    upvotes: 15,
    commentCount: 5
  }
];

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="space-y-4">
              {samplePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
          
          <Sidebar />
        </div>
      </main>

      <CreatePostButton />
      
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
      />
    </div>
  );
}

export default App;