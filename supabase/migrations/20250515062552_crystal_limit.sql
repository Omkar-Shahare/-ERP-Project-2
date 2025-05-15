CREATE DATABASE IF NOT EXISTS erp_system;
USE erp_system;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, name, email, password, role) VALUES
(UUID(), 'Admin User', 'admin@example.com', '$2a$10$XgXB8p6O1m7XpXf6nUFJx.1xz3GYzR3s.1xIB7hl7vI1K4vQ5XK6.', 'admin');