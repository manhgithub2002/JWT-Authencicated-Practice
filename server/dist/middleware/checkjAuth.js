"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const console_1 = require("console");
const jsonwebtoken_1 = require("jsonwebtoken");
const checkAuth = ({ context }, next) => {
    try {
        const authHeader = context.req.header("Authorization");
        const accessToken = authHeader && authHeader.split(" ")[2];
        if (!accessToken) {
            throw new apollo_server_express_1.AuthenticationError("Not authenticated to perform GraphQl");
        }
        const decodedUser = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
        context.user = decodedUser;
        console.log("ACCESS TOKEN RECEIVED", decodedUser);
        return next();
    }
    catch (error) { }
    throw new apollo_server_express_1.AuthenticationError(`Error authenticating user, ${JSON.stringify(console_1.error)}`);
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkjAuth.js.map