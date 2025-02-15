CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)

CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    hire_date DATE NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    salary NUMERIC(10, 2) NOT NULL,
    manager_id INT,
    CONSTRAINT fk_manager
        FOREIGN KEY (manager_id) 
        REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
    name VARCHAR(255) NOT NULL, -- Name of the department
    description TEXT, -- Description of the department (optional)
    manager_id INT, -- ID of the department manager (references a user in the user table)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was last updated
    is_active BOOLEAN DEFAULT TRUE, -- Flag to indicate if the department is active
    CONSTRAINT fk_manager
        FOREIGN KEY (manager_id)
        REFERENCES user(id) -- Assuming you have a 'user' table for employees
        ON DELETE SET NULL -- Set manager_id to NULL if the referenced user is deleted
);