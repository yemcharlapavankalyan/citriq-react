# API Integration Guide

This project now includes full API integration using Fetch API with JSON Server as the backend.

## Features

**Complete API Integration**
- Users API (GET all, GET by ID)
- Projects API (GET, POST, PUT, DELETE)
- Reviews API (GET with filters, POST)
- Submissions API (GET with filters, POST)

**Loading States**
- Global loading spinner on initial load
- Loading indicators for async operations
- Disabled buttons during API calls

**Error Handling**
- Comprehensive error handling with fallback to localStorage
- Error messages displayed to users
- Graceful degradation when API is unavailable

**Data Persistence**
- Automatic sync to localStorage as backup
- Fallback to localStorage if API fails
- Seamless user experience

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `json-server` - Mock REST API server
- `concurrently` - Run multiple commands simultaneously

### 2. Start the API Server

In one terminal, start the JSON Server:

```bash
npm run api
```

This will start the API server on `http://localhost:3001`

### 3. Start the Development Server

In another terminal, start the React app:

```bash
npm run dev
```

Or run both simultaneously:

```bash
npm run dev:all
```

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Reviews
- `GET /reviews` - Get all reviews
- `GET /reviews?projectId=:id` - Get reviews by project
- `GET /reviews?userId=:id` - Get reviews by user
- `POST /reviews` - Create new review

### Submissions
- `GET /submissions` - Get all submissions
- `GET /submissions?projectId=:id` - Get submissions by project
- `GET /submissions?userId=:id` - Get submissions by user
- `POST /submissions` - Create new submission

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
```

For production, update this to your production API URL.

## How It Works

1. **Initial Load**: The app tries to fetch data from the API first
2. **Fallback**: If API fails, it falls back to localStorage or default JSON data
3. **Operations**: All CRUD operations try API first, then fallback to local state
4. **Sync**: Data is automatically synced to localStorage as backup

## API Service File

The API service is located at `src/services/api.js` and provides:
- Centralized API configuration
- Error handling
- Consistent response format
- Easy to switch between different API providers

## Testing Without API

The app works perfectly without the API server running - it will automatically use localStorage as fallback. This ensures:
- Development can continue even if API is down
- Offline functionality
- Better user experience

## Deployment

For production deployment:

1. Update `VITE_API_URL` in `.env` to your production API
2. Build the app: `npm run build`
3. Deploy the `dist` folder to your hosting service

## Notes

- The API uses JSON Server which is perfect for development and prototyping
- For production, replace with your actual backend API
- All API calls include proper error handling and loading states
- Data is automatically persisted to localStorage as backup


