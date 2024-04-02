CREATE DATABASE phoneBook;

CREATE TABLE book (
    phone INT PRIMARY KEY,
    first_name VARCHAR(16),
    last_name VARCHAR(16),
    home_address VARCHAR(255),
    email VARCHAR(255)
);