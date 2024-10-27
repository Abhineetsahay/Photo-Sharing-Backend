import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

export const generateJWTToken = (user: IUser) => {
  const payload = {
    id:user.id,
    username: user.username,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "24hrs",  
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",  
  });
  
  return { accessToken, refreshToken };
};
