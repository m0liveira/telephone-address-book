CREATE DATABASE phoneBook;

CREATE TABLE book (
    phone INT PRIMARY KEY,
    indicative varchar(16),
    first_name VARCHAR(16),
    last_name VARCHAR(16),
    household VARCHAR(255),
    email VARCHAR(255) UNIQUE
);