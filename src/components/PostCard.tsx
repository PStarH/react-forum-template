import { MessageSquare, ArrowBigUp } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-full">{post.category}</span>
          <span>•</span>
          <span>Posted by {post.author}</span>
          <span>•</span>
          <span>{post.createdAt}</span>
        </div>
        
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {post.title}
        </h3>
        
        <p className="mt-2 text-gray-600 line-clamp-2">
          {post.content}
        </p>
        
        <div className="mt-4 flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
            <ArrowBigUp className="h-5 w-5" />
            <span>{post.upvotes}</span>
          </button>
          
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
            <MessageSquare className="h-5 w-5" />
            <span>{post.commentCount} comments</span>
          </button>
        </div>
      </div>
    </div>
  );
}