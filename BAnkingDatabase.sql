CREATE DATABASE banking_system;

USE banking_system;

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    balance DECIMAL(10, 2)
);

CREATE TABLE transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    amount DECIMAL(10, 2),
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES customers(id),
    FOREIGN KEY (receiver_id) REFERENCES customers(id)
);

-- Insert dummy data
INSERT INTO customers (name, email, balance) VALUES
('Alice', 'alice@example.com', 5000.00),
('Bob', 'bob@example.com', 3000.00),
('Charlie', 'charlie@example.com', 7000.00),
('David', 'david@example.com', 10000.00),
('Eva', 'eva@example.com', 2500.00),
('Frank', 'frank@example.com', 8000.00),
('Grace', 'grace@example.com', 4000.00),
('Hannah', 'hannah@example.com', 3500.00),
('Ivy', 'ivy@example.com', 4500.00),
('Jack', 'jack@example.com', 6000.00);