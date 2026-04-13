import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/api-response.js"
import cookieOptions from "../../common/utils/cookie.utils.js"

// REGISTER CONTROLLER
export const registerUser = async(req, res) => {
    try {
        const user = await authService.registerUserService(req.body);

        ApiResponse.created(res, "User Registered Successfully", user)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}