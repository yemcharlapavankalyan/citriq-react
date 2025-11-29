import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { submissionsAPI, reviewsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user, getProjectsByUserId, isLoading: appLoading } = useApp();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedReviews, setAssignedReviews] = useState([]);

  const userProjects = getProjectsByUserId(user?.id || 0);

  useEffect(() => {
    // Fetch assigned reviews
    const fetchReviews = async () => {
      try {
        const { data } = await reviewsAPI.getAssigned();
        if (data) setAssignedReviews(data);
      } catch (error) {
        console.error("Error fetching assigned reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (selectedProject && submissionTitle && submissionFile) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('taskId', selectedProject);
        formData.append('title', submissionTitle);
        formData.append('description', submissionDescription);
        formData.append('file', submissionFile);

        const { error } = await submissionsAPI.create(formData);

        if (error) throw new Error(error);

        setSubmissionSuccess(true);
        setShowSubmitForm(false);
        setSelectedProject(null);
        setSubmissionTitle('');
        setSubmissionDescription('');
        setSubmissionFile(null);

        setTimeout(() => {
          setSubmissionSuccess(false);
        }, 3000);
      } catch (error) {
        console.error("Error submitting work:", error);
        alert("Failed to submit work: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (appLoading && userProjects.length === 0) {
    return <LoadingSpinner message="Loading your projects..." />;
  }

  return (
    <div>
      <h1 className="page-title">CITRIQ - Student Dashboard</h1>
      <p className="page-subtitle">View your assigned projects and submit your work</p>

      {submissionSuccess && (
        <div className="alert alert-success">
          Your work has been submitted successfully!
        </div>
      )}

      <div className="grid grid-2">
        {userProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="card-header">
              <h3 className="card-title">{project.title}</h3>
              <span className={`project-status status-${project.status}`}>
                {project.status}
              </span>
            </div>

            <p style={{ marginBottom: '1rem', color: '#666' }}>{project.description}</p>

            <div className="card-meta" style={{ marginBottom: '1rem' }}>
              <strong>Due Date:</strong> {new Date(project.dueDate).toLocaleDateString()}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedProject(project.id);
                  setShowSubmitForm(true);
                }}
              >
                Submit Work
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Assigned Peer Reviews</h2>
      {assignedReviews.length === 0 ? (
        <p>No peer reviews assigned yet.</p>
      ) : (
        <div className="grid grid-2">
          {assignedReviews.map(review => (
            <div key={review.id} className="project-card">
              <h3 className="card-title">Review: {review.submission_title}</h3>
              <p>Student: {review.student_name}</p>
              <Link to={`/review/${review.id}`} className="btn btn-success btn-sm">
                Start Review
              </Link>
            </div>
          ))}
        </div>
      )}

      {showSubmitForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h2 className="card-title">Submit Work</h2>
            <form onSubmit={handleSubmitWork}>
              <div className="form-group">
                <label className="form-label">Submission Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  value={submissionDescription}
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">File Upload (PDF, Doc)</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={(e) => setSubmissionFile(e.target.files[0])}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSubmitForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
