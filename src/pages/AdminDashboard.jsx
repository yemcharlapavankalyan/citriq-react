import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AddTeacherForm from '../components/AddTeacherForm';
import { tasksAPI, usersAPI, submissionsAPI, reviewsAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useApp();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectSubmissions, setProjectSubmissions] = useState([]);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedStudents: []
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, usersRes] = await Promise.all([
        tasksAPI.getAll(),
        usersAPI.getAll()
      ]);

      if (tasksRes.data) setProjects(tasksRes.data);
      if (usersRes.data) setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const { error } = await tasksAPI.create(newProject);
      if (error) throw new Error(error);

      await fetchData(); // Refresh list
      setNewProject({ title: '', description: '', dueDate: '', assignedStudents: [] });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await tasksAPI.delete(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleViewSubmissions = async (projectId) => {
    setSelectedProject(projectId);
    setShowSubmissions(true);
    try {
      const { data } = await submissionsAPI.getAll({ taskId: projectId });
      if (data) setProjectSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleAssignReviewer = async (submissionId, reviewerId) => {
    try {
      const { error } = await reviewsAPI.assign({
        submissionId,
        reviewerId
      });

      if (error) throw new Error(error);

      // Refresh submissions to show updated status (if we were tracking it)
      // For now just alert
      alert("Reviewer assigned successfully");
      handleViewSubmissions(selectedProject); // Refresh list
    } catch (error) {
      console.error("Error assigning reviewer:", error);
      alert(error.message);
    }
  };

  const students = users.filter(u => u.role === 'student');

  if (isLoading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">CITRIQ - Admin Dashboard</h1>
          <p className="page-subtitle">Manage peer review assignments and monitor progress</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddTeacherForm(true)}
          >
            + Add Teacher/Admin
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Project
          </button>
        </div>
      </div>

      {showAddTeacherForm && (
        <AddTeacherForm
          onSuccess={() => {
            setShowAddTeacherForm(false);
            fetchData();
          }}
          onCancel={() => setShowAddTeacherForm(false)}
        />
      )}

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">Add New Project</h2>
          <form onSubmit={handleAddProject}>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className="form-input"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assign Students</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                {students.map(student => (
                  <label key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={newProject.assignedStudents?.includes(student.id)}
                      onChange={() => {
                        const current = newProject.assignedStudents || [];
                        const updated = current.includes(student.id)
                          ? current.filter(id => id !== student.id)
                          : [...current, student.id];
                        setNewProject({ ...newProject, assignedStudents: updated });
                      }}
                    />
                    {student.name}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Create Project</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="card-header">
              <h3 className="card-title">{project.title}</h3>
              <span className="project-status status-active">Active</span>
            </div>
            <p style={{ marginBottom: '1rem', color: '#666' }}>{project.description}</p>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Assigned Students:</strong>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.assignedStudents && project.assignedStudents.map(studentId => {
                  const student = users.find(u => u.id === studentId);
                  return (
                    <span key={studentId} style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}>
                      {student?.name || 'Unknown'}
                    </span>
                  );
                })}
                {(!project.assignedStudents || project.assignedStudents.length === 0) && (
                  <span style={{ color: '#666', fontStyle: 'italic' }}>No students assigned</span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleViewSubmissions(project.id)}
              >
                View Submissions
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteProject(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <h3>No projects yet</h3>
          <p>Create your first peer review project to get started.</p>
        </div>
      )}

      {showSubmissions && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '900px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className="card-title">Submissions</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSubmissions(false)}>Close</button>
            </div>

            {projectSubmissions.length === 0 ? (
              <p>No submissions found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projectSubmissions.map(sub => (
                  <div key={sub.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{sub.student_name}</strong>
                      <span>{new Date(sub.submitted_at).toLocaleDateString()}</span>
                    </div>
                    <p>{sub.title}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                      <a href={`http://localhost:5001/${sub.file_path}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>
                        Download File
                      </a>
                    </div>
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                      <label style={{ marginRight: '0.5rem' }}>Assign Reviewer:</label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleAssignReviewer(sub.id, e.target.value);
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Student</option>
                        {students.filter(s => s.id !== sub.user_id).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
