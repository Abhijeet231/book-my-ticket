import { Router } from "express";
import * as authController from "./auth.controller.js";
import validate from "../../common/middleware/validate.middleware.js";

import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";

import { authenticate } from "./auth.middleware.js";

const router = Router();

// Register route
router.post('/register',validate(RegisterDto), authController.registerUser);

// Login route
router.post('/login', validate(LoginDto), authController.loginUser);

// Logout route
 







export default router;
