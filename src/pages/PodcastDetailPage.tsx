import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "sonner";
import AudioPlayer from "../components/AudioPlayer";
import { useAuthStore } from "../stores/auth";

type Comment = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  user_display_name: string | null;
  likes_count: number;
  replies_count: number;
};

type CommentReply = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  user_display_name: string | null;
  likes_count: number;
};

export default function PodcastDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [podcast, setPodcast] = useState<any>(null);
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [stats, setStats] = useState({
    streams: 0,
    likes: 0,
    saves: 0,
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentReplies, setCommentReplies] = useState<Record<number, CommentReply[]>>({});
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadPodcast();
    loadComments();
    checkInteractions();
  }, [id, user]);

  const loadPodcast = async () => {
    try {
      const [podcastRes, sourceRes, statsRes] = await Promise.all([
        api.get(`/podcasts/${id}`),
        api.get(`/podcasts/${id}/source`),
        api.get(`/podcasts/${id}/stats`),
      ]);
      setPodcast(podcastRes.data?.data?.item);
      setSourceUrl(sourceRes.data?.data?.sourceUrl || "");
      setStats(statsRes.data?.data?.stats || { streams: 0, likes: 0, saves: 0 });
    } catch (err: any) {
      toast.error("Failed to load podcast");
    }
  };

  const loadComments = async () => {
    try {
      const res = await api.get(`/podcasts/${id}/comments`);
      setComments(res.data?.data?.items || []);
    } catch (err: any) {
      toast.error("Failed to load comments");
    }
  };

  const loadCommentReplies = async (commentId: number) => {
    try {
      const res = await api.get(`/podcasts/${id}/comments/${commentId}/replies`);
      setCommentReplies((prev) => ({ ...prev, [commentId]: res.data?.data?.items || [] }));
    } catch (err: any) {
      toast.error("Failed to load replies");
    }
  };

  const checkInteractions = async () => {
    if (!user) return;
    try {
      // Check if user liked/saved (you'd need to add these endpoints)
      // For now, we'll just set defaults
    } catch {}
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }
    try {
      if (isLiked) {
        await api.delete(`/podcasts/${id}/like`);
        setIsLiked(false);
        setStats((prev) => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        await api.post(`/podcasts/${id}/like`);
        setIsLiked(true);
        setStats((prev) => ({ ...prev, likes: prev.likes + 1 }));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to like");
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save");
      return;
    }
    try {
      if (isSaved) {
        await api.delete(`/podcasts/${id}/save`);
        setIsSaved(false);
        setStats((prev) => ({ ...prev, saves: prev.saves - 1 }));
      } else {
        await api.post(`/podcasts/${id}/save`);
        setIsSaved(true);
        setStats((prev) => ({ ...prev, saves: prev.saves + 1 }));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;
    try {
      await api.post(`/podcasts/${id}/comments`, { content: newComment });
      setNewComment("");
      loadComments();
      toast.success("Comment added");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleAddReply = async (commentId: number) => {
    if (!user) {
      toast.error("Please login to reply");
      return;
    }
    if (!replyContent.trim()) return;
    try {
      await api.post(`/podcasts/${id}/comments/${commentId}/replies`, { content: replyContent });
      setReplyContent("");
      setReplyTo(null);
      loadCommentReplies(commentId);
      loadComments();
      toast.success("Reply added");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add reply");
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!user) {
      toast.error("Please login to like comments");
      return;
    }
    try {
      const isLiked = likedComments.has(commentId);
      if (isLiked) {
        await api.delete(`/podcasts/${id}/comments/${commentId}/like`);
        setLikedComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      } else {
        await api.post(`/podcasts/${id}/comments/${commentId}/like`);
        setLikedComments((prev) => new Set(prev).add(commentId));
      }
      loadComments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to like comment");
    }
  };

  const handleSubscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error("Please enter your email");
      return;
    }
    try {
      await api.post("/podcasts/newsletter/subscribe", {
        email: newsletterEmail,
        preferences: ["live_sessions", "recorded_sessions"],
      });
      setNewsletterSubscribed(true);
      toast.success("Subscribed to newsletter!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to subscribe");
    }
  };

  const logStream = async (durationSec?: number) => {
    if (!id) return;
    try {
      await api.post(`/podcasts/${id}/stream`, durationSec ? { durationSec } : {});
      loadPodcast();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {podcast && (
          <>
            <div className="card mb-6">
              <h1 className="text-3xl font-bold text-blue-900 mb-4">{podcast.title}</h1>
              {podcast.description && (
                <p className="text-slate-700 mb-6 whitespace-pre-wrap">{podcast.description}</p>
              )}

              {sourceUrl && (
                <div className="mb-6">
                  <AudioPlayer src={sourceUrl} onPlay={() => logStream()} onEnded={(d) => logStream(d)} />
                </div>
              )}

              <div className="flex items-center gap-6 mb-4">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">{stats.streams}</span> Streams
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${isLiked ? "text-blue-800" : "text-slate-600"} hover:text-blue-800`}
                >
                  <span>❤️</span>
                  <span className="font-semibold">{stats.likes}</span>
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 ${isSaved ? "text-blue-800" : "text-slate-600"} hover:text-blue-800`}
                >
                  <span>🔖</span>
                  <span className="font-semibold">{stats.saves}</span>
                </button>
              </div>
            </div>

            {/* Newsletter Signup */}
            {!newsletterSubscribed && (
              <div className="card mb-6 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Subscribe to Podcast Newsletter</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get notified about new live sessions and recorded podcasts
                </p>
                <form onSubmit={handleSubscribeNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </form>
              </div>
            )}

            {/* Comments Section */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>

              {/* Add Comment */}
              {user ? (
                <form onSubmit={handleAddComment} className="mb-6">
                  <textarea
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent mb-2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Post Comment
                  </button>
                </form>
              ) : (
                <p className="text-slate-600 mb-4">Please login to comment</p>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-slate-200 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {comment.user_display_name || "Anonymous"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-700 mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 text-sm ${
                          likedComments.has(comment.id) ? "text-blue-800" : "text-slate-600"
                        } hover:text-blue-800`}
                      >
                        <span>👍</span>
                        <span>{comment.likes_count}</span>
                      </button>
                      {user && (
                        <button
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="text-sm text-slate-600 hover:text-blue-800"
                        >
                          Reply
                        </button>
                      )}
                    </div>

                    {/* Reply Form */}
                    {replyTo === comment.id && (
                      <div className="mt-3 ml-6">
                        <textarea
                          placeholder="Write a reply..."
                          rows={2}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent mb-2"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            className="btn btn-secondary text-sm"
                          >
                            Post Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyTo(null);
                              setReplyContent("");
                            }}
                            className="btn btn-outline text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies_count > 0 && (
                      <div className="mt-3 ml-6">
                        <button
                          onClick={() => loadCommentReplies(comment.id)}
                          className="text-sm text-blue-800 hover:underline mb-2"
                        >
                          View {comment.replies_count} {comment.replies_count === 1 ? "reply" : "replies"}
                        </button>
                        {commentReplies[comment.id]?.map((reply) => (
                          <div key={reply.id} className="border-l-2 border-blue-200 pl-3 mb-3">
                            <div className="font-semibold text-sm text-slate-900">
                              {reply.user_display_name || "Anonymous"}
                            </div>
                            <p className="text-sm text-slate-700">{reply.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => handleLikeComment(reply.id)}
                                className={`text-xs ${
                                  likedComments.has(reply.id) ? "text-blue-800" : "text-slate-600"
                                }`}
                              >
                                👍 {reply.likes_count}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
