import { ArrowBigUp, CornerDownRight } from 'lucide-react';
import { Comment } from '../types';
import CommentInput from './CommentInput';

interface CommentThreadProps {
  comment: Comment;
  comments: Comment[];
  onUpvote: (commentId: string) => void;
  onReply: (commentId: string) => void;
  onAddReply: (content: string, parentId: string) => void;
  replyToId: string | null;
  currentUser: string | undefined;
  depth?: number;
}

export default function CommentThread({
  comment,
  comments,
  onUpvote,
  onReply,
  onAddReply,
  replyToId,
  currentUser,
  depth = 0
}: CommentThreadProps) {
  const replies = comments.filter(c => c.parentId === comment.id);
  const isReplyOpen = replyToId === comment.id;
  const hasUpvoted = currentUser && comment.upvotedBy.includes(currentUser);
  const maxDepth = 4; // Maximum nesting level

  return (
    <div className="group">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {comment.author[0].toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
            <span className="text-sm text-gray-500">{comment.createdAt}</span>
          </div>
          <div className="text-sm text-gray-600">
            {comment.content}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onUpvote(comment.id)}
              className={`flex items-center space-x-1 text-sm ${
                hasUpvoted ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <ArrowBigUp className="h-4 w-4" />
              <span>{comment.upvotes}</span>
            </button>
            
            {depth < maxDepth && currentUser && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
              >
                <CornerDownRight className="h-4 w-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {isReplyOpen && currentUser && (
            <div className="mt-3">
              <CommentInput
                onSubmit={(content) => onAddReply(content, comment.id)}
                placeholder={`Reply to ${comment.author}...`}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className={`mt-3 pl-11 space-y-3 ${depth >= maxDepth ? 'opacity-70' : ''}`}>
          {replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              comments={comments}
              onUpvote={onUpvote}
              onReply={onReply}
              onAddReply={onAddReply}
              replyToId={replyToId}
              currentUser={currentUser}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}