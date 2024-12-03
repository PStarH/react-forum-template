import { Dialog } from '@headlessui/react';
import { X, MessageSquare, ArrowBigUp, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import CommentInput from './CommentInput';
import CommentThread from './CommentThread';

interface PostDialogProps {
  post: Post | null;
  onClose: () => void;
  onUpvote: (postId: string) => void;
}

export default function PostDialog({ post, onClose, onUpvote }: PostDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const { user, isAdmin, deletePost } = useAuth();

  useEffect(() => {
    if (post) {
      const savedComments = localStorage.getItem(`comments_${post.id}`);
      setComments(savedComments ? JSON.parse(savedComments) : []);
    }
  }, [post]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post!.id);
      onClose();
    }
  };

  const updatePostCommentCount = () => {
    if (!post) return;
    
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const updatedPosts = posts.map((p: Post) =>
      p.id === post.id ? { ...p, commentCount: comments.length } : p
    );
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    window.dispatchEvent(new Event('postsUpdated'));
  };

  const saveComments = (newComments: Comment[]) => {
    if (post) {
      localStorage.setItem(`comments_${post.id}`, JSON.stringify(newComments));
      setComments(newComments);
      updatePostCommentCount();
    }
  };

  const handleAddComment = (content: string) => {
    if (!user || !post) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      content,
      author: user.username,
      createdAt: 'Just now',
      parentId: null,
      upvotes: 0,
      upvotedBy: []
    };

    const updatedComments = [...comments, newComment];
    saveComments(updatedComments);
  };

  const handleAddReply = (content: string, parentId: string) => {
    if (!user || !post) return;

    const newReply: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      content,
      author: user.username,
      createdAt: 'Just now',
      parentId,
      upvotes: 0,
      upvotedBy: []
    };

    const updatedComments = [...comments, newReply];
    saveComments(updatedComments);
    setReplyToId(null);
  };

  const handleUpvoteComment = (commentId: string) => {
    if (!user) return;

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const hasUpvoted = comment.upvotedBy.includes(user.username);
        return {
          ...comment,
          upvotes: hasUpvoted ? comment.upvotes - 1 : comment.upvotes + 1,
          upvotedBy: hasUpvoted
            ? comment.upvotedBy.filter(u => u !== user.username)
            : [...comment.upvotedBy, user.username]
        };
      }
      return comment;
    });

    saveComments(updatedComments);
  };

  if (!post) return null;

  const hasUpvoted = user && post.upvotedBy.includes(user.username);
  const rootComments = comments.filter(comment => !comment.parentId);

  return (
    <Dialog
      open={!!post}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full rounded-xl bg-white shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-full">{post.category}</span>
                <span>•</span>
                <span>Posted by {post.author}</span>
                <span>•</span>
                <span>{post.createdAt}</span>
              </div>
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                    title="Delete post"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {post.title}
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-4 mb-6 border-b border-gray-200 pb-4">
              <button 
                onClick={() => onUpvote(post.id)}
                className={`flex items-center space-x-1 ${
                  !user ? 'opacity-50 cursor-not-allowed' :
                  hasUpvoted ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                }`}
                title={user ? 'Upvote' : 'Sign in to upvote'}
              >
                <ArrowBigUp className="h-5 w-5" />
                <span>{post.upvotes}</span>
              </button>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageSquare className="h-5 w-5" />
                <span>{comments.length} comments</span>
              </div>
            </div>

            {/* Comment Input */}
            {user ? (
              <div className="mb-6">
                <CommentInput
                  onSubmit={handleAddComment}
                  placeholder="What are your thoughts?"
                />
              </div>
            ) : (
              <div className="mb-6 p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                Please sign in to comment
              </div>
            )}

            {/* Comments */}
            <div className="space-y-6">
              {rootComments.map(comment => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  comments={comments}
                  onUpvote={handleUpvoteComment}
                  onReply={(commentId) => setReplyToId(commentId)}
                  onAddReply={handleAddReply}
                  replyToId={replyToId}
                  currentUser={user?.username}
                />
              ))}
              {rootComments.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}