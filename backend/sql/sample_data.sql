-- Sample Admin & Student users
INSERT INTO users (name, email, password, role)
VALUES 
('Admin User', 'admin@citriq.com', 'password123', 'admin'),
('Student User', 'student@citriq.com', 'password123', 'student');

-- Sample Review Task
INSERT INTO review_tasks (title, description, assigned_to, due_date)
VALUES ('Sample Review Task', 'Draft submission for peer review', 2, '2025-12-31');
