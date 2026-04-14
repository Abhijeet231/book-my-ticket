import "dotenv/config";

import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { pool } from "./src/common/config/db.js";
import authRoutes from "./src/modules/auth/auth.route.js";
import cookieParser from "cookie-parser";
import { authenticate } from "./src/modules/auth/auth.middleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

const app = express();


app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
//get all seats
app.get("/seats", authenticate, async (req, res) => {
  const result = await pool.query("select * from seats"); // equivalent to Seats.find() in mongoose
  res.send(result.rows);
});

app.put("/book/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.user.name;

    const conn = await pool.connect();
    await conn.query("BEGIN");

    const sql = "SELECT * FROM seats where id = $1 and isbooked = 0 FOR UPDATE";
    const result = await conn.query(sql, [id]);

    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      conn.release();
      res.send({ error: "Seat already booked" });
      return;
    }

    const sqlU = "update seats set isbooked = 1, name = $2 where id = $1";
    const updateResult = await conn.query(sqlU, [id, name]);

    await conn.query("COMMIT");
    conn.release();
    res.send(updateResult);
  } catch (ex) {
    console.log(ex);
    res.send(500);
  }
});

// auth routes
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

app.listen(port, () => console.log("Server starting on port: " + port));
