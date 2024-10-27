import { Response } from 'express';
import User from '../../models/User';
import { CustomRequest } from "../../middlewares/AuthenticateToken.middleware"; 

export const GetProfile = async (req: CustomRequest, res: Response) => {
  try {
    
    const { id } = req.params||req.user; 
    const findUser = await User.findById({ _id: id });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({ success: true, user: findUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error
    });
  }
};
