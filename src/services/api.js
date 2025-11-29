// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Call Error:', error);
    return { data: null, error: error.message };
  }
};

// Users API
export const usersAPI = {
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
  create: (user) => apiCall('/users', { method: 'POST', body: JSON.stringify(user) }),
  register: (user) => apiCall('/users/register', { method: 'POST', body: JSON.stringify(user) }),
};

// Submissions API
export const submissionsAPI = {
  create: (formData) => apiCall('/submissions', {
    method: 'POST',
    body: formData // FormData object
  }),
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiCall(`/submissions?${queryParams}`);
  },
  getById: (id) => apiCall(`/submissions/${id}`),
  updateStatus: (id, status) => apiCall(`/submissions/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
};

// Reviews API
export const reviewsAPI = {
  assign: (data) => apiCall('/reviews/assign', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  submit: (id, data) => apiCall(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getAssigned: () => apiCall('/reviews/assigned'),
  getReceived: () => apiCall('/reviews/received')
};

// Notifications API
export const notificationsAPI = {
  getAll: () => apiCall('/notifications'),
  markRead: (id) => apiCall(`/notifications/${id}/read`, { method: 'PUT' })
};

// Tasks API
export const tasksAPI = {
  getAll: () => apiCall('/tasks'),
  getById: (id) => apiCall(`/tasks/${id}`),
  create: (task) => apiCall('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  delete: (id) => apiCall(`/tasks/${id}`, { method: 'DELETE' })
};

export default {
  users: usersAPI,
  submissions: submissionsAPI,
  reviews: reviewsAPI,
  notifications: notificationsAPI,
  tasks: tasksAPI
};
