import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";
import createUserTable from "./data/createUserTable.js";
import createEmployeeTable from "./data/employeeTable.js";
import createDepartmentTable from "./data/departmentTable.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", userRoutes);
app.use("/api/emp", employeeRoutes);

// Error handling middleware
app.use(errorHandling);

//Create table before starting server
createUserTable();
//Create table before starting server
createEmployeeTable();
// create department table starting server
createDepartmentTable()
// Testing POSTGRES Connection
app.get("/", async (req, res) => {
  console.log("Start");
  const result = await pool.query("SELECT current_database()");
  console.log("result", result.rows);
  res.send(`The database name is : ${result.rows[0].current_database}`);
});

// Server running
app.listen(port, () => {
  console.log(`Server is running on http:localhost:${port}`);
});
