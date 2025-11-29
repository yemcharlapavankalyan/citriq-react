import React from 'react';
import { useApp } from '../context/AppContext';

const AnalyticsPage = () => {
  const { projects, users, getAnalytics } = useApp();
  const analytics = getAnalytics();

  const getProjectStats = () => {
    const stats = {
      active: 0,
      upcoming: 0,
      completed: 0
    };
    
    projects.forEach(project => {
      stats[project.status] = (stats[project.status] || 0) + 1;
    });
    
    return stats;
  };

  const getTopPerformers = () => {
    const studentStats = {};
    
    users.filter(u => u.role === 'student').forEach(student => {
      const studentReviews = [];
      projects.forEach(project => {
        project.reviews.forEach(review => {
          if (review.revieweeId === student.id) {
            studentReviews.push(review.rating);
          }
        });
      });
      
      if (studentReviews.length > 0) {
        studentStats[student.id] = {
          name: student.name,
          averageRating: studentReviews.reduce((sum, rating) => sum + rating, 0) / studentReviews.length,
          totalReviews: studentReviews.length
        };
      }
    });
    
    return Object.values(studentStats)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);
  };

  const getMostActiveProjects = () => {
    return projects
      .map(project => ({
        ...project,
        totalActivity: project.reviews.length + project.submissions.length
      }))
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 5);
  };

  const projectStats = getProjectStats();
  const topPerformers = getTopPerformers();
  const mostActiveProjects = getMostActiveProjects();

  return (
    <div>
      <h1 className="page-title">CITRIQ - Analytics Dashboard</h1>
      <p className="page-subtitle">Overview of platform activity and performance metrics</p>

      {/* Key Metrics */}
      <div className="analytics-grid">
        <div className="stat-card">
          <div className="stat-number">{analytics.totalProjects}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{analytics.activeProjects}</div>
          <div className="stat-label">Active Projects</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{analytics.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{analytics.totalReviews}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{analytics.averageRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Project Status Distribution */}
        <div className="card">
          <h3 className="card-title">Project Status Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Active Projects</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '100px', 
                  height: '8px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${(projectStats.active / analytics.totalProjects) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#48bb78' 
                  }}></div>
                </div>
                <span>{projectStats.active}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Upcoming Projects</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '100px', 
                  height: '8px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${(projectStats.upcoming / analytics.totalProjects) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#ed8936' 
                  }}></div>
                </div>
                <span>{projectStats.upcoming}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Completed Projects</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '100px', 
                  height: '8px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${(projectStats.completed / analytics.totalProjects) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#4299e1' 
                  }}></div>
                </div>
                <span>{projectStats.completed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="card">
          <h3 className="card-title">Top Performers</h3>
          {topPerformers.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews submitted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topPerformers.map((student, index) => (
                <div key={student.name} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#f7fafc',
                  borderRadius: '6px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>#{index + 1} {student.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {student.totalReviews} reviews
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: '#667eea' }}>
                      {student.averageRating.toFixed(1)} ⭐
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Most Active Projects */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="card-title">Most Active Projects</h3>
        {mostActiveProjects.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No activity data available.</p>
        ) : (
          <div className="grid grid-2">
            {mostActiveProjects.map(project => (
              <div key={project.id} style={{ 
                padding: '1rem',
                backgroundColor: '#f7fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ marginBottom: '0.5rem' }}>{project.title}</h4>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                  {project.description.substring(0, 100)}...
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#666' }}>
                    {project.reviews.length} reviews, {project.submissions.length} submissions
                  </span>
                  <span className={`project-status status-${project.status}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
