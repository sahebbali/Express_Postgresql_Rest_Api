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
export default router;
