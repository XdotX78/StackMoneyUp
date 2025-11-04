'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { getPostComments, createComment, updateComment, deleteComment } from '@/lib/comments';
import { formatDate } from '@/lib/utils';
import { Button, Badge, CommentsSkeleton } from '@/components/ui';
import toast from 'react-hot-toast';
import type { Comment, Language } from '@/types/blog';

interface CommentsSectionProps {
  postId: string;
  postSlug: string;
  lang: Language;
}

export default function CommentsSection({ postId, lang }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuth();
  // const router = useRouter(); // Reserved for future use

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getPostComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/${lang}/login`);
      return;
    }

    if (!newComment.trim()) {
      toast.error(lang === 'it' ? 'Il commento non può essere vuoto' : 'Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const comment = await createComment(postId, { content: newComment.trim() });
      setComments([comment, ...comments]);
      setNewComment('');
      toast.success(lang === 'it' ? 'Commento pubblicato!' : 'Comment published!');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/${lang}/login`);
      return;
    }

    if (!replyContent.trim()) {
      toast.error(lang === 'it' ? 'La risposta non può essere vuota' : 'Reply cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const reply = await createComment(postId, {
        content: replyContent.trim(),
        parent_id: parentId,
      });

      // Find parent comment and add reply
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
              reply_count: (comment.reply_count || 0) + 1,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComments(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateComments(comments));
      setReplyingTo(null);
      setReplyContent('');
      toast.success(lang === 'it' ? 'Risposta pubblicata!' : 'Reply published!');
    } catch (error) {
      console.error('Error creating reply:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error(lang === 'it' ? 'Il commento non può essere vuoto' : 'Comment cannot be empty');
      return;
    }

    try {
      const updated = await updateComment(commentId, editContent.trim());
      
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return updated;
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComments(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateComments(comments));
      setEditingId(null);
      setEditContent('');
      toast.success(lang === 'it' ? 'Commento aggiornato!' : 'Comment updated!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm(lang === 'it' ? 'Sei sicuro di voler eliminare questo commento?' : 'Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      
      const removeComment = (comments: Comment[]): Comment[] => {
        return comments
          .filter(comment => comment.id !== commentId)
          .map(comment => ({
            ...comment,
            replies: comment.replies ? removeComment(comment.replies) : undefined,
          }));
      };

      setComments(removeComment(comments));
      toast.success(lang === 'it' ? 'Commento eliminato!' : 'Comment deleted!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete comment');
    }
  };

  // Reserved for future use
  // const startEdit = (comment: Comment) => {
  //   setEditingId(comment.id);
  //   setEditContent(comment.content);
  // };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  if (loading) {
    return (
      <section className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-3xl font-bold mb-6">
          {lang === 'it' ? 'Commenti' : 'Comments'}
        </h2>
        <CommentsSkeleton count={3} />
      </section>
    );
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-6">
        {lang === 'it' ? 'Commenti' : 'Comments'}
        {comments.length > 0 && (
          <span className="text-lg font-normal text-gray-500 ml-2">
            ({comments.reduce((acc, c) => acc + 1 + (c.reply_count || 0), 0)})
          </span>
        )}
      </h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={lang === 'it' ? 'Scrivi un commento...' : 'Write a comment...'}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                rows={4}
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || !newComment.trim()}
              isLoading={submitting}
            >
              {lang === 'it' ? 'Pubblica' : 'Post'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">
            {lang === 'it' 
              ? 'Accedi per lasciare un commento'
              : 'Sign in to leave a comment'
            }
          </p>
          <Button
            variant="primary"
            onClick={() => router.push(`/${lang}/login`)}
          >
            {lang === 'it' ? 'Accedi' : 'Sign In'}
          </Button>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {lang === 'it' 
              ? 'Nessun commento ancora. Sii il primo a commentare!'
              : 'No comments yet. Be the first to comment!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              lang={lang}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReply={handleReply}
              editingId={editingId}
              editContent={editContent}
              setEditContent={setEditContent}
              onCancelEdit={cancelEdit}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              setReplyingTo={setReplyingTo}
              submitting={submitting}
              setSubmitting={setSubmitting}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface CommentItemProps {
  comment: Comment;
  user: { id: string; role?: string } | null;
  lang: Language;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (parentId: string, e: React.FormEvent) => void;
  editingId: string | null;
  editContent: string;
  setEditContent: (content: string) => void;
  onCancelEdit: () => void;
  replyingTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  setReplyingTo: (id: string | null) => void;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
}

function CommentItem({
  comment,
  user,
  lang,
  onEdit,
  onDelete,
  onReply,
  editingId,
  editContent,
  setEditContent,
  onCancelEdit,
  replyingTo,
  replyContent,
  setReplyContent,
  setReplyingTo,
  submitting,
}: CommentItemProps) {
  const isOwner = user?.id === comment.author_id;
  const isEditing = editingId === comment.id;
  const isReplying = replyingTo === comment.id;

  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author_avatar ? (
            <Image
              src={comment.author_avatar}
              alt={comment.author_name || 'User'}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600 font-semibold">
                {comment.author_name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{comment.author_name}</span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.created_at, lang === 'it' ? 'it-IT' : 'en-US')}
            </span>
            {comment.edited && (
              <Badge variant="default" size="sm" className="text-xs">
                {lang === 'it' ? 'modificato' : 'edited'}
              </Badge>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit(comment.id)}
                  disabled={submitting || !editContent.trim()}
                >
                  {lang === 'it' ? 'Salva' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancelEdit}
                >
                  {lang === 'it' ? 'Annulla' : 'Cancel'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 whitespace-pre-wrap mb-2">{comment.content}</p>
              <div className="flex items-center gap-3">
                {user && (
                  <button
                    onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {isReplying 
                      ? (lang === 'it' ? 'Annulla' : 'Cancel')
                      : (lang === 'it' ? 'Rispondi' : 'Reply')
                    }
                  </button>
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={() => {
                        setEditContent(comment.content);
                        setReplyingTo(null);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {lang === 'it' ? 'Modifica' : 'Edit'}
                    </button>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      {lang === 'it' ? 'Elimina' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Reply Form */}
          {isReplying && user && (
            <form onSubmit={(e) => onReply(comment.id, e)} className="mt-4 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={lang === 'it' ? 'Scrivi una risposta...' : 'Write a reply...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                rows={3}
                required
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting || !replyContent.trim()}
                  isLoading={submitting}
                >
                  {lang === 'it' ? 'Rispondi' : 'Reply'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  {lang === 'it' ? 'Annulla' : 'Cancel'}
                </Button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  user={user}
                  lang={lang}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReply={onReply}
                  editingId={editingId}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  onCancelEdit={onCancelEdit}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  setReplyingTo={setReplyingTo}
                  submitting={submitting}
                  setSubmitting={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

