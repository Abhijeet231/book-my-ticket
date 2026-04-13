import bcrypt from "bcryptjs";
import { pool } from "../../common/config/db.js";

export const registerUserService = async (data) => {
    const {fullname, email, password} = data;

    // check duplicate user
    const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if(existingUser.rows.length > 0) {
        throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password,10);

    // Insert into DB
    const result = await pool.query(
        `INSERT INTO users (fullname, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, fullname, email,
         `
         [fullname, email, hashedPassword]
    )

    return result.rows[0];
}
