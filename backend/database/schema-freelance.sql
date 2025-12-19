-- Freelance Platform Database Schema
-- Educational Application with Intentional Vulnerabilities
-- WARNING: FOR SECURITY TRAINING ONLY - NOT FOR PRODUCTION USE

-- Drop existing tables if they exist
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS proposals;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS gigs;
DROP TABLE IF EXISTS users;

-- 1. Users table (Enhanced for freelance platform)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK(role IN ('client', 'freelancer', 'admin')) NOT NULL DEFAULT 'client',
  bio TEXT,
  avatar_url TEXT,
  hourly_rate REAL,
  location TEXT,
  joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  balance REAL DEFAULT 0,
  total_earned REAL DEFAULT 0,
  rating REAL DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0
);

-- 2. Gigs table (Service offerings by freelancers)
CREATE TABLE gigs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  freelancer_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  delivery_days INTEGER NOT NULL,
  status TEXT CHECK(status IN ('active', 'paused', 'deleted')) DEFAULT 'active',
  views INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);

-- 3. Projects table (Client job postings)
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget REAL NOT NULL,
  status TEXT CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  deadline DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id)
);

-- 4. Proposals table (Freelancer bids on projects)
CREATE TABLE proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  freelancer_id INTEGER NOT NULL,
  cover_letter TEXT NOT NULL,
  bid_amount REAL NOT NULL,
  delivery_days INTEGER NOT NULL,
  status TEXT CHECK(status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);

-- 5. Orders table (Accepted work)
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gig_id INTEGER,
  project_id INTEGER,
  proposal_id INTEGER,
  client_id INTEGER NOT NULL,
  freelancer_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  status TEXT CHECK(status IN ('pending', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
  requirements TEXT,
  delivery_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (gig_id) REFERENCES gigs(id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (proposal_id) REFERENCES proposals(id),
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);

-- 6. Messages table (Private messaging)
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  order_id INTEGER,
  subject TEXT,
  body TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 7. Reviews table (Ratings & feedback)
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,
  reviewee_id INTEGER NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (reviewee_id) REFERENCES users(id)
);

-- 8. Skills table (Freelancer skills)
CREATE TABLE skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE user_skills (
  user_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- 9. Files table (Attachments)
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uploader_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  entity_type TEXT CHECK(entity_type IN ('gig', 'project', 'proposal', 'order', 'message', 'profile')) NOT NULL,
  entity_id INTEGER NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id)
);

-- 10. Transactions table (Payment history)
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  type TEXT CHECK(type IN ('payment', 'refund', 'withdrawal', 'deposit')) NOT NULL,
  status TEXT CHECK(status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_gigs_freelancer ON gigs(freelancer_id);
CREATE INDEX idx_gigs_status ON gigs(status);
CREATE INDEX idx_gigs_category ON gigs(category);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_proposals_project ON proposals(project_id);
CREATE INDEX idx_proposals_freelancer ON proposals(freelancer_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_freelancer ON orders(freelancer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Seed data for testing

-- Insert admin user
-- Password is: admin123 (hashed with bcrypt)
INSERT INTO users (email, password, full_name, role, bio, location, joined_date) VALUES
('admin@platform.com', '$2b$10$rH8QnQZ0LqK3jGvYvX.ZBOKqNJ3k3NJxYqhCqkO6xVk0fG8wqXTzm', 'Platform Administrator', 'admin', 'System administrator with full access', 'San Francisco, CA', datetime('now'));

-- Insert freelancers
-- Password is: freelancer123
INSERT INTO users (email, password, full_name, role, bio, hourly_rate, location, rating, completed_jobs, joined_date) VALUES
('john.dev@example.com', '$2b$10$H0KLV8w7u5fJ5rZ8XqF6EO5gKF.qp1kXZYLK7zXLY.7N8BqQYdZ0q', 'John Developer', 'freelancer', 'Full-stack developer with 5 years experience in React and Node.js. Specialized in building scalable web applications.', 75.00, 'New York, NY', 4.8, 24, datetime('now', '-6 months')),
('sarah.design@example.com', '$2b$10$H0KLV8w7u5fJ5rZ8XqF6EO5gKF.qp1kXZYLK7zXLY.7N8BqQYdZ0q', 'Sarah Designer', 'freelancer', 'UI/UX designer passionate about creating beautiful and intuitive user experiences.', 60.00, 'Los Angeles, CA', 4.9, 18, datetime('now', '-4 months')),
('mike.writer@example.com', '$2b$10$H0KLV8w7u5fJ5rZ8XqF6EO5gKF.qp1kXZYLK7zXLY.7N8BqQYdZ0q', 'Mike Writer', 'freelancer', 'Professional content writer and copywriter. SEO expert with proven track record.', 45.00, 'Austin, TX', 4.7, 31, datetime('now', '-8 months'));

-- Insert clients
-- Password is: client123
INSERT INTO users (email, password, full_name, role, bio, location, joined_date) VALUES
('alice.startup@example.com', '$2b$10$YR5WjJB6rJ7kZ9X.qF6EO5gKF.qp1kXZYLK7zXLY.7N8BqQYdZ0q', 'Alice Startup', 'client', 'Founder of a growing tech startup looking for talented freelancers.', 'Seattle, WA', datetime('now', '-3 months')),
('bob.business@example.com', '$2b$10$YR5WjJB6rJ7kZ9X.qF6EO5gKF.qp1kXZYLK7zXLY.7N8BqQYdZ0q', 'Bob Business', 'client', 'Small business owner seeking quality freelance services.', 'Chicago, IL', datetime('now', '-5 months'));

-- Insert skills
INSERT INTO skills (name) VALUES
('React'), ('Node.js'), ('TypeScript'), ('Python'), ('JavaScript'),
('UI/UX Design'), ('Graphic Design'), ('Content Writing'), ('SEO'),
('Vue.js'), ('Angular'), ('PHP'), ('WordPress'), ('Mobile Development'), ('Data Science');

-- Link freelancers to skills
INSERT INTO user_skills (user_id, skill_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 5),
(3, 6), (3, 7),
(4, 8), (4, 9);

-- Insert gigs
INSERT INTO gigs (freelancer_id, title, description, category, price, delivery_days, status, views, orders, rating) VALUES
(2, 'Full-Stack Web Application Development', '<p>I will build a complete web application using <strong>React</strong> and <strong>Node.js</strong>.</p><ul><li>Responsive design</li><li>RESTful API</li><li>Database integration</li></ul><script>console.log(''XSS Test'')</script>', 'Web Development', 500.00, 14, 'active', 124, 8, 4.9),
(2, 'React Component Library', '<p>Custom reusable React components for your project.</p>', 'Web Development', 300.00, 7, 'active', 89, 5, 4.8),
(3, 'Professional Logo Design', '<img src=x onerror=alert(''XSS'')><p>Modern and unique logo design for your brand.</p>', 'Design', 150.00, 5, 'active', 156, 12, 4.9),
(3, 'Complete Website UI/UX Design', '<p>Full website design with user flow and wireframes.</p>', 'Design', 400.00, 10, 'active', 93, 4, 4.8),
(4, 'SEO-Optimized Blog Posts', '<p>High-quality blog content optimized for search engines.</p>', 'Writing', 80.00, 3, 'active', 201, 15, 4.7),
(4, 'Website Copy Writing', '<p>Engaging copy for your landing pages and website.</p>', 'Writing', 120.00, 5, 'active', 145, 9, 4.6);

-- Insert projects
INSERT INTO projects (client_id, title, description, category, budget, status, deadline) VALUES
(5, 'E-commerce Platform Development', '<p>Need a full e-commerce platform with payment integration and admin panel.</p><script>alert(''Stored XSS'')</script>', 'Web Development', 5000.00, 'open', datetime('now', '+60 days')),
(5, 'Mobile App UI Design', '<p>Looking for modern mobile app design for iOS and Android.</p>', 'Design', 1500.00, 'open', datetime('now', '+30 days')),
(6, 'Company Website Redesign', '<p>Redesign existing company website with modern look.</p>', 'Design', 2000.00, 'open', datetime('now', '+45 days')),
(6, 'SEO Content Strategy', '<p>Need comprehensive SEO content strategy and 20 blog posts.</p>', 'Writing', 1000.00, 'open', datetime('now', '+90 days'));

-- Insert proposals
INSERT INTO proposals (project_id, freelancer_id, cover_letter, bid_amount, delivery_days, status) VALUES
(1, 2, '<p>Hello! I have extensive experience building e-commerce platforms. I can deliver this within your timeline.</p>', 4500.00, 50, 'pending'),
(2, 3, '<p>Hi! I specialize in mobile app design and would love to work on your project.</p>', 1400.00, 25, 'pending'),
(3, 3, '<p>I can help redesign your website with a modern, professional look.</p>', 1800.00, 35, 'accepted'),
(4, 4, '<p>SEO is my specialty! I can create a comprehensive strategy and deliver quality content.</p>', 950.00, 80, 'pending');

-- Insert orders (from accepted proposals and direct gig orders)
INSERT INTO orders (gig_id, client_id, freelancer_id, amount, status, requirements, delivery_date, created_at) VALUES
(1, 5, 2, 500.00, 'completed', 'Build a task management dashboard with user authentication', datetime('now', '-5 days'), datetime('now', '-14 days')),
(3, 6, 3, 150.00, 'completed', 'Logo for coffee shop', datetime('now', '-10 days'), datetime('now', '-15 days')),
(5, 5, 4, 80.00, 'in_progress', '5 blog posts about technology trends', datetime('now', '+2 days'), datetime('now', '-1 day'));

INSERT INTO orders (project_id, proposal_id, client_id, freelancer_id, amount, status, requirements, delivery_date, created_at) VALUES
(3, 3, 6, 3, 1800.00, 'in_progress', 'Redesign company website as per proposal', datetime('now', '+30 days'), datetime('now', '-3 days'));

-- Insert messages
INSERT INTO messages (sender_id, receiver_id, order_id, subject, body, read) VALUES
(5, 2, 1, 'Project Requirements', '<p>Hi John, can you clarify the authentication requirements?</p>', 1),
(2, 5, 1, 'RE: Project Requirements', '<p>Sure! I will use JWT authentication with refresh tokens.</p>', 1),
(6, 3, 2, 'Logo Revisions', '<p>The logo looks great! Can we try it in blue?</p><img src=x onerror=alert(document.cookie)>', 1),
(3, 6, 2, 'RE: Logo Revisions', '<p>Absolutely! I will send you 3 blue variations by tomorrow.</p>', 1);

-- Insert reviews
INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating, comment) VALUES
(1, 5, 2, 5, '<p>Excellent work! John delivered ahead of schedule and the code quality is outstanding.</p>'),
(1, 2, 5, 5, '<p>Great client with clear requirements. Highly recommended!</p>'),
(2, 6, 3, 5, '<p>Amazing logo design! Sarah is very talented and professional.</p><script>alert(''XSS in review'')</script>'),
(2, 3, 6, 5, '<p>Wonderful client to work with. Clear communication throughout.</p>');

-- Insert transactions
INSERT INTO transactions (order_id, from_user_id, to_user_id, amount, type, status) VALUES
(1, 5, 2, 500.00, 'payment', 'completed'),
(2, 6, 3, 150.00, 'payment', 'completed');
