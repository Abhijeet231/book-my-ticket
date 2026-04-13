import bcrypt from "bcryptjs";
import { pool } from "../../common/config/db.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshTokne,
} from "../../common/utils/jwt.utils.js";

// Register User
export const registerUserService = async (data) => {
  const { fullname, email, password } = data;

  // check duplicate user
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert into DB
  const result = await pool.query(
    `INSERT INTO users (fullname, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, fullname, email,
         `[(fullname, email, hashedPassword)],
  );

  return result.rows[0];
};

// Login User
export const loginUserService = async (data) => {
  const { email, password } = data;

  // find user
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });

  const refreshtoken = generateRefreshToken({
    id: user.id,
    email: user.email,
  });

  // saving refreshtoken
  await pool.query("UPDATE users SET refreshToken = $1 WHERE id = $2", [
    refreshtoken,
    user.id,
  ]);

  // Remove sensitive stuff
  delete user.password;
  delete user.refreshtoken;

  return {
    user,
    accessToken,
    refreshtoken,
  };
};

// Refresh Token Service
export const refreshService = async (token) => {
  if (!token) throw ApiError.unauthorised("Refresh token missing");
  const decoded = verifyRefreshTokne(token);

  const result = await pool.query(
    "SELECT * FROM users WHERE refreshtoken = $1",
    [decoded],
  );

  const user = result.rows[0];
  if (!user) {
    throw new Error("Invalid token");
  }

  const accessToken = generateAccessToken({id: user.id, email: user.email});

 return {accessToken}

};


// Logout service
const logout = async (userId) => {
    const user = await pool.query(
        "SELECT * FROM users"
    )
}