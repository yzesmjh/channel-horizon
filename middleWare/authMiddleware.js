const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { respondsSender } = require('./responseHandler');
const { ResponseCode } = require('../utils/responseCode');

const protect = asynchandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header is missing
    if (!authHeader) {
        return respondsSender(null, "Authorization header missing please login", ResponseCode.unAuthorized, res);
    }

    try {
        // Split Bearer away from header
        const bearerToken = authHeader.split(' ')[1];

        // Check if token exists in the database
        const tokens = await Token.find({ token: bearerToken });
        if (tokens.length === 0) {
            return respondsSender(null, "Not authorized, Please login: Bad Token", ResponseCode.invalidToken, res);
        }

        // Verify token using jwt.verify
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return respondsSender(null, "Invalid token", ResponseCode.invalidToken, res);
            } else {
                // Save this found user to req id so as to use it in the next stage if need be
                req.userId = tokens[0].userId;
                // Change login status to true here
                req.loginStatus = true;
                req.usertoken = decodedToken; // Attach decoded user data to the request object
                next(); // Proceed to the next middleware or route handler
            }
        });

    } catch (error) {
        return respondsSender(null, "Not authorized, Please login: " + error.message, ResponseCode.unAuthorized, res);
    }
});

module.exports = protect;
