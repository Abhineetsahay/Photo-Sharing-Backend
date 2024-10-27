import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export interface CustomRequest extends Request {
  user?: string | JwtPayload; 
}

export const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided or token format is incorrect",
    });
  }

  const token = header.split(" ")[1];

  if (!process.env.JWT_ACCESS_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: Missing JWT secret",
    });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      }); 
    }
    req.user = decoded; 
    next();
  });
};
