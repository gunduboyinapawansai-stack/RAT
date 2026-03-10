-- Users: Admin and Workers
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  username VARCHAR(50),
  password VARCHAR(50),
  role VARCHAR(20),
  stall_id INT
);

-- Stalls
CREATE TABLE stalls(
  id SERIAL PRIMARY KEY,
  stall_name VARCHAR(100),
  location VARCHAR(100)
);

-- Menu Items
CREATE TABLE menu_items(
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(100),
  price INT,
  ingredient_cost INT
);

-- Orders
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  item_id INT,
  quantity INT,
  payment_mode VARCHAR(20),
  stall_id INT,
  worker_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses
CREATE TABLE expenses(
  id SERIAL PRIMARY KEY,
  stall_id INT,
  description VARCHAR(100),
  amount INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);-- Sample Users
INSERT INTO users(name, username, password, role, stall_id) VALUES
('Admin', 'admin', 'admin123', 'admin', NULL),
('Worker 1', 'worker1', 'pass1', 'worker', 1);

-- Sample Stall
INSERT INTO stalls(stall_name, location) VALUES
('Street Stall 1', 'Corner A');

-- Sample Menu Items
INSERT INTO menu_items(item_name, price, ingredient_cost) VALUES
('Burger', 100, 60),
('Hotdog', 50, 30),
('French Fries', 40, 20);