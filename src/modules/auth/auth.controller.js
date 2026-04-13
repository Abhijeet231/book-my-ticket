import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import cookieOptions from "../../common/utils/cookie.utils.js";

// REGISTER CONTROLLER
export const registerUser = async (req, res) => {
  try {
    const user = await authService.registerUserService(req.body);

    ApiResponse.created(res, "User Registered Successfully", user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// LOGIN CONTROLLER
export const loginUser = async (req, res) => {
  try {
    const { user, accessToken, refreshtoken } =
      await authService.loginUserService(req.body);

    // Send Refresh token in cookie
    res.cookie("refreshtoken", refreshtoken, cookieOptions);

    ApiResponse.ok(res, "LoggedIn successfully", {
      user,
      accessToken,
      refreshtoken,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// REFRESH CONTROLLER
export const refresh = async (req, res) => {
  const token =
    req.cookies.refreshtoken ||
    req.body.refreshtoken ||
    req.headers["x-refresh-token"];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const { accessToken } = await authService.refreshService(token);
    ApiResponse.ok(res, "Token refreshed successfully", { accessToken });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// LOGOUT CONTROLLER
export const logout = async (req, res) => {
  await authService.logout(req.user.id);

  // Clear cookies
  res.clearCookie("refreshtoken", cookieOptions);

  ApiResponse.ok(res, "Logout Success.");
};
