import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // Token should come from Authorization header: "Bearer <token>"
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next(); // go to next handler
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
