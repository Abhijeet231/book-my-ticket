import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import { pool } from "../../common/config/db.js";

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Checking authorization headers (mobile)
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw ApiError.unauthorised("Not Authenticated");

    console.log("TOKEN RECEIVED:", token);
    // verify token
    const decoded = verifyAccessToken(token);
    console.log("DECODED:", decoded);
    console.log("Token expires at:", new Date(decoded.exp * 1000));
    console.log("Current time:", new Date());

    // Get users from DB
    const result = await pool.query(
      "SELECT id, fullname, email FROM users WHERE id = $1",
      [decoded.id],
    );

    const user = result.rows[0];

    if (!user) {
      throw ApiError.unauthorised("User Not Found!");
    }

    // Attach user to request
    req.user = {
      id: user.id,
      name: user.fullname,
      email: user.email,
    };

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    next(ApiError.unauthorised("Invalid or expired token"));
  }
};

export { authenticate };
