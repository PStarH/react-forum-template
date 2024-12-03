import { MessageSquare, ArrowBigUp, Trash2 } from 'lucide-react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onUpvote: () => void;
}

export default function PostCard({ post, onClick, onUpvote }: PostCardProps) {
  const { user, isAdmin, deletePost } = useAuth();
  const hasUpvoted = user ? post.upvotedBy.includes(user.username) : false;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      onUpvote();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded-full">{post.category}</span>
            <span>•</span>
            <span>Posted by {post.author}</span>
            <span>•</span>
            <span>{post.createdAt}</span>
          </div>
          
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
              title="Delete post"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {post.title}
        </h3>
        
        <p className="mt-2 text-gray-600 line-clamp-2">
          {post.content}
        </p>
        
        <div className="mt-4 flex items-center space-x-4">
          <button 
            className={`flex items-center space-x-1 ${
              !user ? 'opacity-50 cursor-not-allowed' :
              hasUpvoted ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={handleUpvote}
            title={user ? 'Upvote' : 'Sign in to upvote'}
            disabled={!user}
          >
            <ArrowBigUp className={`h-5 w-5 ${hasUpvoted ? 'fill-current' : ''}`} />
            <span>{post.upvotes}</span>
          </button>
          
          <button 
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <MessageSquare className="h-5 w-5" />
            <span>{post.commentCount} comments</span>
          </button>
        </div>
      </div>
    </div>
  );
}