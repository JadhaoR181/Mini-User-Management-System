-- =============================
-- PurpleMerit Mini User Management System Database Schema
-- =============================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
  status VARCHAR(20) CHECK (status IN ('active', 'inactive')) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role_status ON users(role, status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on any update
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
-- Password: Admin@123 (you'll replace this hash after implementing bcrypt)
INSERT INTO users (email, password_hash, full_name, role, status)
VALUES (
  'admin@purplemerit.com',
  '$2b$10$placeholder_hash_will_update_later',
  'Admin User',
  'admin',
  'active'
);

-- Verify setup
SELECT 'Database schema created successfully!' AS status;