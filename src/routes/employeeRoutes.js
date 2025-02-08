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
router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", validateUser, updateUser);
router.delete("/user/:id", deleteUser);

export default router;
