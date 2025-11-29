-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin')) NOT NULL
);

-- REVIEW TASKS TABLE
CREATE TABLE IF NOT EXISTS review_tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  assigned_to INT REFERENCES users(id),
  created_by INT REFERENCES users(id),
  due_date DATE
);

-- SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  task_id INT REFERENCES review_tasks(id),
  title VARCHAR(255),
  description TEXT,
  file_path TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, assigned, reviewed
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- PEER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS peer_reviews (
  id SERIAL PRIMARY KEY,
  reviewer_id INT REFERENCES users(id),
  submission_id INT REFERENCES submissions(id),
  rating INT,
  comments TEXT,
  reviewed_at TIMESTAMP DEFAULT NOW()
);

-- COMMENTS TABLE (Collaboration)
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  submission_id INT REFERENCES submissions(id),
  user_id INT REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);
