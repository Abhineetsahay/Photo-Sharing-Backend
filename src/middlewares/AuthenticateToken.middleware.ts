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
  const refreshToken = req.cookies.refreshToken;

  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: Missing JWT secrets",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      throw new jwt.TokenExpiredError("Access token expired", new Date(decoded.exp * 1000));
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Access token expired and no refresh token available",
        });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;

        const refreshCurrentTime = Math.floor(Date.now() / 1000);
        if (decodedRefresh.exp && decodedRefresh.exp < refreshCurrentTime) {
          return res.status(401).json({
            success: false,
            message: "Refresh token expired",
          });
        }

        const accessToken = jwt.sign(
          { id: decodedRefresh.id, username: decodedRefresh.username, email: decodedRefresh.email },
          process.env.JWT_ACCESS_SECRET!,
          { expiresIn: "24h" }
        );

        res.setHeader("x-new-access-token", accessToken);

        req.user = decodedRefresh;
        next();
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token or refresh token expired",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  }
};
