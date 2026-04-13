import jwt from "jsonwebtoken";

// GENERATE AN ACCESSTOKEN
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
    });
}

// VERIFY ACCESSTOKEN
const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

// GENERATE REFRESH TOKEN
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
         expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "5d",
    });
};

// VERIFY REFRESH TOKEN
const verifyRefreshTokne = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}


export {
    generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshTokne
}