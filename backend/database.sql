-- ============================
-- USERS TABLE
-- ============================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin','worker')),
    stall_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- STALLS TABLE
-- ============================

CREATE TABLE IF NOT EXISTS stalls (
    id SERIAL PRIMARY KEY,
    stall_name VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- MENU ITEMS TABLE
-- ============================

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) UNIQUE NOT NULL,
    price INT NOT NULL,
    ingredient_cost INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- ORDERS TABLE
-- ============================

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    items JSON NOT NULL,
    payment_mode VARCHAR(20),
    stall_id INT,
    worker_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (stall_id) REFERENCES stalls(id) ON DELETE SET NULL,
    FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================
-- EXPENSES TABLE
-- ============================

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    stall_id INT,
    description VARCHAR(100),
    amount INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (stall_id) REFERENCES stalls(id) ON DELETE SET NULL
);

-- ============================
-- SAMPLE DATA
-- ============================

-- Stalls
INSERT INTO stalls (stall_name, location) VALUES
('Street Stall 1', 'Corner A'),
('Street Stall 2', 'Corner B')
ON CONFLICT (stall_name) DO NOTHING;

-- Users
INSERT INTO users (name, username, password, role, stall_id) VALUES
('Admin', 'admin', 'admin123', 'admin', NULL),
('Worker 1', 'stall1', '1111', 'worker', 1),
('Worker 2', 'stall2', '2222', 'worker', 2)
ON CONFLICT (username) DO NOTHING;

-- Menu Items
INSERT INTO menu_items (item_name, price, ingredient_cost) VALUES
('Burger', 100, 60),
('Hotdog', 50, 30),
('Fries', 40, 20),
('Sandwich', 60, 35)
ON CONFLICT (item_name) DO NOTHING;