
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../../Database/postgresdb');
const { success, error } = require('../../Middelwares/apiResponse');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
// Middleware to parse JSON request body
router.use(bodyparser.json());

/**
 * @route   POST /api/register
 * @desc    Register a new user via stored procedure
 */
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      employee_id,
      name,
      designation,
      password,
      mobile_number,
      profile_pic_url,
      department
    } = req.body;

    if (!email || !employee_id || !name || !designation || !password) {
      return res.status(400).json(error('Missing required fields', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      SELECT * FROM usp_register_user_json(
        $1, $2, $3, $4, $5, $6, $7, $8
      );
    `;

    const values = [
      email,
      employee_id,
      name,
      designation,
      hashedPassword,
      mobile_number || null,
      profile_pic_url || null,
      department || null
    ];

    const result = await pool.query(query, values);

    res.status(201).json(success("User registered successfully", result.rows[0], 201));
  } catch (err) {
    console.error('Registration error:', err);
    if (err.message.includes("User already exists")) {
      return res.status(409).json(error("User already exists", 409));
    }
    res.status(500).json(error("Internal Server Error", 500));
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Move to .env in prod

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(error('Email and password are required', 400));
    }

    const query = `SELECT id, email, name, designation, password_hash FROM user_master WHERE email = $1 AND is_active = true`;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json(error('Invalid credentials', 401));
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json(error('Invalid credentials', 401));
    }

    // Generate JWT token
    const tokenPayload = {
      user_id: user.id,
      email: user.email,
      name: user.name,
      designation: user.designation
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '2h' });

    return res.status(200).json(success('Login successful', { token, user: tokenPayload }, 200));

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json(error('Something went wrong while logging in', 500));
  }
});


module.exports = router;
