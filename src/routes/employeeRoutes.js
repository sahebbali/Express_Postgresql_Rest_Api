import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import validateUser from "../middlewares/inputValidator.js";
import pool from "../config/db.js";

const router = express.Router();

router.post("/employee", async (req, res, next) => {
  try {
    console.log("hello employee");

    // Extract data from request body
    const {
      first_name,
      last_name,
      email,
      phone_number,
      hire_date,
      job_title,
      department,
      salary,
      manager_id,
    } = req.body;

    // SQL Query
    const query = `
      INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_title, department, salary, manager_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      first_name,
      last_name,
      email,
      phone_number,
      hire_date,
      job_title,
      department,
      salary,
      manager_id || null, // Ensure manager_id is null if not provided
    ];

    // Execute Query
    const result = await pool.query(query, values);

    // Return response
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in createEmployeeService:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/employee/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    console.log({ id });
    let query;
    let values = [];

    if (id) {
      // Fetch a specific employee by ID
      query = `SELECT * FROM employees WHERE employee_id = $1`;
      values = [id];
    } else {
      // Fetch all employees
      query = `SELECT * FROM employees`;
    }

    const result = await pool.query(query, values);

    if (id && result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: id
        ? "Employee fetched successfully"
        : "Employees fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in GET /employee:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone_number,
      hire_date,
      job_title,
      department,
      salary,
      manager_id,
    } = req.body;

    // Check if the employee exists
    const checkQuery = `SELECT * FROM employees WHERE id = $1`;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Update Query
    const updateQuery = `
      UPDATE employees
      SET
        first_name = $1,
        last_name = $2,
        email = $3,
        phone_number = $4,
        hire_date = $5,
        job_title = $6,
        department = $7,
        salary = $8,
        manager_id = $9
      WHERE employee_id = $10
      RETURNING *;
    `;

    const values = [
      first_name,
      last_name,
      email,
      phone_number,
      hire_date,
      job_title,
      department,
      salary,
      manager_id || null,
      id,
    ];

    const result = await pool.query(updateQuery, values);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in PUT /employee:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the employee exists
    const checkQuery = `SELECT * FROM employees WHERE id = $1`;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Delete Query
    const deleteQuery = `DELETE FROM employees WHERE id = $1 RETURNING *`;
    const result = await pool.query(deleteQuery, [id]);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in DELETE /employee:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/employees/high-salary", async (req, res) => {
  try {
    const query = `
      SELECT first_name, last_name, salary 
      FROM employees 
      WHERE salary > (SELECT AVG(salary) FROM employees)
    `;

    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: "Employees earning above average salary",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in GET /employees/high-salary:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/employees/salary-rank", async (req, res) => {
  try {
    const query = `
      SELECT 
        department, 
        first_name, 
        last_name, 
        salary, 
        RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank
      FROM employees
    `;

    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: "Employee salary ranking by department",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in GET /employees/salary-rank:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
export default router;
