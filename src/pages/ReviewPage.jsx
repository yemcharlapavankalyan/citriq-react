import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ReviewPage = () => {
  const { projectId } = useParams(); // Note: This is actually the review ID in our new routing
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch review details (which includes submission details)
  useEffect(() => {
    const fetchReview = async () => {
      try {
        // We need an endpoint to get a specific review details by ID
        // For now, we'll fetch all assigned and filter (not efficient but works for now)
        const { data } = await reviewsAPI.getAssigned();
        const review = data.find(r => r.id === parseInt(projectId));

        if (review) {
          setReviewData(review);
          if (review.rating) setRating(review.rating);
          if (review.comments) setComments(review.comments);
        } else {
          // Handle not found
          alert("Review not found");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReview();
  }, [projectId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await reviewsAPI.submit(projectId, {
        rating,
        comments
      });

      if (error) throw new Error(error);

      alert("Review submitted successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading review details..." />;
  if (!reviewData) return <div>Review not found</div>;

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title">Peer Review</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title">Submission Details</h2>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Title:</strong> {reviewData.submission_title}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Student:</strong> {reviewData.student_name}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>File:</strong>
          {reviewData.file_path ? (
            <a
              href={`http://localhost:5001/${reviewData.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: '0.5rem', color: '#3182ce' }}
            >
              Download Submission
            </a>
          ) : (
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>No file uploaded</span>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Your Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Rating (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              className="form-input"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Comments & Suggestions</label>
            <textarea
              className="form-input form-textarea"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              rows={6}
              placeholder="Provide constructive feedback..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
