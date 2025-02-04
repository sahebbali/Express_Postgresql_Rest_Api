import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "../models/userModel.js";

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createEmployeeService = async (
  first_name,
  last_name,
  email,
  phone_number,
  hire_date,
  job_title,
  department,
  salary,
  manager_id = null
) => {
  try {
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
      manager_id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0]; // Return the newly created employee
  } catch (err) {
    console.error("Error in createEmployeeService:", err);
    throw err; // Re-throw the error for the controller to handle
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    handleResponse(res, 200, "Users fetched successfully", users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User fetched successfully", user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await updateUserService(req.params.id, name, email);
    if (!updatedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User deleted successfully", deleteUser);
  } catch (err) {
    next(err);
  }
};
