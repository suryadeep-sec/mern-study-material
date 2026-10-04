const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

async function auth(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Please log in to continue",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  if (
    !decoded ||
    typeof decoded !== "object" ||
    typeof decoded.userId !== "string" ||
    !mongoose.isObjectIdOrHexString(decoded.userId)
  ) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  try {
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User account not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(500).json({
      message: "Could not verify user",
    });
  }
}

module.exports = auth;