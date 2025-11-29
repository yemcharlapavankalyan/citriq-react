import React, { createContext, useContext, useReducer, useEffect } from 'react';
import projectsData from '../data/projects.json';
import usersData from '../data/users.json';

// Initial state
const initialState = {
  user: null,
  projects: projectsData,
  users: usersData,
  reviews: [],
  submissions: [],
  isLoading: false,
  error: null
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_USERS: 'SET_USERS',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_REVIEW: 'ADD_REVIEW',
  UPDATE_REVIEW: 'UPDATE_REVIEW',
  ADD_SUBMISSION: 'ADD_SUBMISSION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload
      };

    case ActionTypes.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload
      };

    case ActionTypes.SET_USERS:
      return {
        ...state,
        users: action.payload
      };

    case ActionTypes.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };

    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };

    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      };

    case ActionTypes.ADD_REVIEW:
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === action.payload.projectId) {
            return {
              ...project,
              reviews: [...project.reviews, action.payload.review]
            };
          }
          return project;
        })
      };

    case ActionTypes.ADD_SUBMISSION:
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === action.payload.projectId) {
            return {
              ...project,
              submissions: [...project.submissions, action.payload.submission]
            };
          }
          return project;
        })
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount and fetch users from backend
  useEffect(() => {
    const savedUser = localStorage.getItem('peerReviewUser');
    const savedProjects = localStorage.getItem('peerReviewProjects');

    if (savedUser) {
      dispatch({ type: ActionTypes.SET_USER, payload: JSON.parse(savedUser) });
    }

    if (savedProjects) {
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: JSON.parse(savedProjects) });
    }

    // Fetch users from backend
    fetch('http://localhost:5001/api/users')
      .then(res => res.json())
      .then(users => {
        dispatch({ type: ActionTypes.SET_USERS, payload: users });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        // Keep using static data as fallback
      });
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('peerReviewProjects', JSON.stringify(state.projects));
  }, [state.projects]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('peerReviewUser', JSON.stringify(state.user));
    }
  }, [state.user]);

  // Actions
  const actions = {
    login: (user) => {
      dispatch({ type: ActionTypes.SET_USER, payload: user });
    },

    logout: () => {
      dispatch({ type: ActionTypes.SET_USER, payload: null });
      localStorage.removeItem('peerReviewUser');
    },

    addProject: (project) => {
      const newProject = {
        ...project,
        id: Date.now(), // Simple ID generation
        reviews: [],
        submissions: []
      };
      dispatch({ type: ActionTypes.ADD_PROJECT, payload: newProject });
    },

    updateProject: (project) => {
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: project });
    },

    deleteProject: (projectId) => {
      dispatch({ type: ActionTypes.DELETE_PROJECT, payload: projectId });
    },

    addReview: (projectId, review) => {
      const newReview = {
        ...review,
        id: Date.now(),
        submittedAt: new Date().toISOString()
      };
      dispatch({
        type: ActionTypes.ADD_REVIEW,
        payload: { projectId, review: newReview }
      });
    },

    addSubmission: (projectId, submission) => {
      const newSubmission = {
        ...submission,
        id: Date.now(),
        submittedAt: new Date().toISOString()
      };
      dispatch({
        type: ActionTypes.ADD_SUBMISSION,
        payload: { projectId, submission: newSubmission }
      });
    },

    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    }
  };

  // Helper functions
  const getProjectById = (id) => {
    return state.projects.find(project => project.id === id);
  };

  const getUserById = (id) => {
    return state.users.find(user => user.id === id);
  };

  const getProjectsByUserId = (userId) => {
    return state.projects.filter(project =>
      project.assignedStudents.includes(userId)
    );
  };

  const getReviewsByUserId = (userId) => {
    const allReviews = [];
    state.projects.forEach(project => {
      project.reviews.forEach(review => {
        if (review.reviewerId === userId || review.revieweeId === userId) {
          allReviews.push({
            ...review,
            project: project
          });
        }
      });
    });
    return allReviews;
  };

  const getSubmissionsByUserId = (userId) => {
    const allSubmissions = [];
    state.projects.forEach(project => {
      project.submissions.forEach(submission => {
        if (submission.studentId === userId) {
          allSubmissions.push({
            ...submission,
            project: project
          });
        }
      });
    });
    return allSubmissions;
  };

  const getAnalytics = () => {
    const totalProjects = state.projects.length;
    const activeProjects = state.projects.filter(p => p.status === 'active').length;
    const totalStudents = state.users.filter(u => u.role === 'student').length;

    const allReviews = [];
    state.projects.forEach(project => {
      allReviews.push(...project.reviews);
    });

    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
      : 0;

    return {
      totalProjects,
      activeProjects,
      totalStudents,
      totalReviews: allReviews.length,
      averageRating: Math.round(averageRating * 10) / 10
    };
  };

  const value = {
    ...state,
    ...actions,
    getProjectById,
    getUserById,
    getProjectsByUserId,
    getReviewsByUserId,
    getSubmissionsByUserId,
    getAnalytics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
