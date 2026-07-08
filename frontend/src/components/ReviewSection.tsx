import React, { useState, useEffect } from 'react';
import { Star, Send, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNotification } from '../context/NotificationContext';
import { useModal } from '../context/ModalContext';
import API from '../api/axiosAPI';

interface Review {
  id: number;
  user_id: number;
  user_name?: string;
  course_id: number;
  comment_text: string;
  rating?: number;
  created_at: string;
  comment_id?: number;
}

interface ReviewSectionProps {
  courseId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ courseId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  
  const { user } = useSelector((state: any) => state.auth);
  const { showNotification } = useNotification();
  const { confirm } = useModal();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await API.get(`/reviews/course/${courseId}`);
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const res = await API.post('/reviews', {
        course_id: courseId,
        comment_text: newComment,
        rating
      });
      if (res.data.success) {
        setReviews([...reviews, res.data.data]);
        setNewComment('');
        setRating(5);
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: number, commentId: number) => {
    const confirmed = await confirm({
      title: "Delete Comment",
      message: "Are you sure you want to delete this comment? This action cannot be undone."
    });

    if (confirmed) {
      try {
        const idToDelete = commentId || reviewId;
        const res = await API.delete(`/reviews/${idToDelete}`);
        if (res.data.success) {
          setReviews(reviews.filter((r) => (r.comment_id || r.id) !== idToDelete));
          showNotification("Comment deleted successfully", "success");
        }
      } catch (err: any) {
        console.error("Failed to delete review", err);
        showNotification(err.response?.data?.message || "Failed to delete comment", "error");
      }
    }
  };

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <h3 className="text-xl font-bold mb-4">Course Reviews</h3>
      
      <div className="space-y-4 mb-8">
        {reviews.length === 0 ? (
          <p className="text-slate-500 text-sm">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id || review.comment_id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">{review.user_name || `User ${review.user_id}`}</span>
                {review.rating && (
                  <div className="flex text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                )}
                <span className="text-xs text-slate-400 ml-auto">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteReview(review.id, (review as any).comment_id)}
                    className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{review.comment_text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="font-semibold mb-3 text-sm">Leave a Review</h4>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-slate-500">Rating:</span>
          <div className="flex cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-5 h-5 transition-colors ${rating >= star ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
              />
            ))}
          </div>
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this course..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewSection;
