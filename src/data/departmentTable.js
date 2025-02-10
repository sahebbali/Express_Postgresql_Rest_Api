import pool from "../config/db.js";

const createDepartmentTable = async () => {
  const queryText = `
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
    `;

  try {
    pool.query(queryText);
    console.log("Department table created if not exists");
  } catch (error) {
    console.log("Error creating users table : ", error);
  }
};

export default createDepartmentTable;
