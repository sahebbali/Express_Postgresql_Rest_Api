import pool from "../config/db.js";

const createEmployeeTable = async () => {
  const queryText = `
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
    `;

  try {
    pool.query(queryText);
    console.log("Employee table created if not exists");
  } catch (error) {
    console.log("Error creating users table : ", error);
  }
};

export default createEmployeeTable;
