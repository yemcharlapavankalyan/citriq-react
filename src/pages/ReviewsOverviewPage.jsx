import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { reviewsAPI, tasksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ReviewsOverviewPage = () => {
  const { user } = useApp();
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [givenRes, receivedRes, projectsRes] = await Promise.all([
          reviewsAPI.getAssigned(),
          reviewsAPI.getReceived(),
          tasksAPI.getAll()
        ]);

        if (givenRes.data) setReviewsGiven(givenRes.data);
        if (receivedRes.data) setReviewsReceived(receivedRes.data);
        if (projectsRes.data) setProjects(projectsRes.data);
      } catch (error) {
        console.error("Error fetching reviews overview:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group reviews by project
  const reviewsByProject = {};

  // Helper to get project details
  const getProject = (id) => projects.find(p => p.id === id);

  // Process reviews given
  reviewsGiven.forEach(review => {
    // In the new API, review has submission_id. We need to link it to project (task).
    // The API response for getAssigned includes submission_title but maybe not task_id directly?
    // Let's assume we can map it or the API returns it.
    // Actually, getMyAssignedReviews returns `s.title as submission_title`.
    // It doesn't return task_id. I should update the controller to return task_id.
    // But for now, let's group by submission_title or just show a flat list if grouping is hard.
    // Or better, update controller to return task_id.

    // Let's assume we can't easily group by project without task_id.
    // I'll just list them.
  });

  if (isLoading) return <LoadingSpinner message="Loading reviews..." />;

  return (
    <div>
      <h1 className="page-title">CITRIQ - Reviews Overview</h1>
      <p className="page-subtitle">View all your reviews</p>

      <div className="grid grid-2">
        {/* Reviews Given Stats */}
        <div className="card">
          <h3 className="card-title">Reviews Given</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
            {reviewsGiven.filter(r => r.rating).length} / {reviewsGiven.length}
          </div>
          <p style={{ color: '#666' }}>Completed / Assigned</p>
        </div>

        {/* Reviews Received Stats */}
        <div className="card">
          <h3 className="card-title">Reviews Received</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ed8936' }}>
            {reviewsReceived.length}
          </div>
          <p style={{ color: '#666' }}>Total Feedback Received</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        {/* Reviews Given List */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Assigned to You</h3>
          {reviewsGiven.length === 0 ? (
            <p>No reviews assigned.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviewsGiven.map(review => (
                <div key={review.id} className="card">
                  <h4>{review.submission_title}</h4>
                  <p>Student: {review.student_name}</p>
                  {review.rating ? (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span className="badge badge-success">Completed</span>
                      <div style={{ marginTop: '0.5rem' }}>
                        <strong>Your Rating:</strong> {review.rating}/10
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>"{review.comments}"</p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span className="badge badge-warning">Pending</span>
                      <div style={{ marginTop: '0.5rem' }}>
                        <Link to={`/review/${review.id}`} className="btn btn-primary btn-sm">
                          Complete Review
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Received List */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Feedback for You</h3>
          {reviewsReceived.length === 0 ? (
            <p>No feedback received yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviewsReceived.map(review => (
                <div key={review.id} className="card">
                  <h4>{review.submission_title}</h4>
                  <p>Reviewer: {review.reviewer_name}</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Rating:</strong> {review.rating}/10
                    <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>"{review.comments}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsOverviewPage;
