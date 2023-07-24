"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (user) => (0, jsonwebtoken_1.sign)({
    userId: user.id,
}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
});
exports.createToken = createToken;
//# sourceMappingURL=auth.js.map