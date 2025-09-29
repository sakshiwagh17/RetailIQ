import bcrypt from "bcrypt";
import { getpool } from "../lib/db.js";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  const { name, email, password, address } = req.body;
  const role = "user"; // default role

  try {
    // Validation
    if (!name || !email || !password || !address) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const pool = getpool();
    if (!pool) {
      return res.json({
        success: false,
        message: "Database pool is not available",
      });
    }

    // if user exists
    const [existingUser] = await pool.query(
      "SELECT email, name FROM users WHERE email=?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashPassword, address, role]
    );

    // Fetch new user
    const [newUser] = await pool.query(
      "SELECT id, name, email, address, created_at, role FROM users WHERE id=?",
      [result.insertId]
    );

    res.json({
      success: true,
      message: "User created successfully",
      user: newUser[0],
    });
  } catch (error) {
    console.log("Error in register function", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

//login

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const pool = getpool();
    const [user] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (user.length === 0) {
      return res.json({ success: false, message: "No user found" });
    }

    const dbUser = user[0];
    const valid = await bcrypt.compare(password, dbUser.password);

    if (!valid) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: dbUser.id, email: dbUser.email, role: dbUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // For JWT, logout = frontend deletes the token.
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};
