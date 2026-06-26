import { useCallback, useEffect, useState } from 'react';
import { Star, ThumbsUp, Trash2, X } from 'lucide-react';
import { del, get, patch } from '../lib/api';
import { useConfirm } from '../components/ConfirmProvider';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const confirm = useConfirm();

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await get('/api/reviews-admin');
      setReviews(data.reviews || []);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const toggleApproval = async (review) => {
    try {
      await patch('/api/reviews-admin', { id: review.id, isApproved: !review.is_approved });
      await loadReviews();
    } catch (patchError) {
      setError(patchError.message || 'Failed to update review');
    }
  };

  const deleteReview = async (reviewId) => {
    const ok = await confirm({ title: 'Delete review?', message: 'This cannot be undone.', confirmLabel: 'Delete' });
    if (!ok) return;
    try {
      await del(`/api/reviews-admin?id=${reviewId}`);
      await loadReviews();
    } catch (delError) {
      setError(delError.message || 'Failed to delete review');
    }
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <h1 className="page-title">Reviews</h1>
          <p className="page-subtitle">{reviews.length} total · {pendingCount} pending approval</p>
        </div>
      </section>

      {error ? <div className="error-box">{error}</div> : null}

      {loading ? (
        <section className="panel">
          <div className="skeleton skeleton-table" />
        </section>
      ) : reviews.length === 0 ? (
        <section className="panel"><div className="empty-cell">No reviews yet.</div></section>
      ) : (
        <section className="panel">
          <table className="dense-table responsive-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Author</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td data-label="Product"><span className="text-sm">{review.product_name}</span></td>
                  <td data-label="Author">{review.author_name}</td>
                  <td data-label="Rating">
                    <div className="inline-flex items-center gap-1">
                      <Star size={14} className="fill-yellow-500 text-yellow-500" />
                      <span>{review.rating}/5</span>
                    </div>
                  </td>
                  <td data-label="Review">
                    <div className="max-w-xs">
                      {review.title ? <strong className="text-sm block">{review.title}</strong> : null}
                      {review.body ? <p className="text-xs text-gray-400 truncate">{review.body}</p> : null}
                    </div>
                  </td>
                  <td data-label="Date">{formatDate(review.created_at)}</td>
                  <td data-label="Status">
                    <span className={`badge ${review.is_approved ? 'badge-success' : 'badge-warning'}`}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="flex gap-2">
                      <button className="icon-action-link" onClick={() => toggleApproval(review)} title={review.is_approved ? 'Unapprove' : 'Approve'}>
                        <ThumbsUp size={15} className={review.is_approved ? 'text-green-400' : ''} />
                      </button>
                      <button className="icon-action-link icon-action-danger" onClick={() => deleteReview(review.id)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
