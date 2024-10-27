import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../../models/User';
import { generateJWTToken } from '../../utils/GenerateToken';

export const Login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: 'User Not found',
      });
    }
    if (!(await bcrypt.compare(password, findUser.password))) {
      return res.status(403).json({
        success: false,
        message: 'Incorrect password',
      });
    }
    const token = generateJWTToken(findUser);
    res.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure:true
    });

    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure:true
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      ...token,
    });
  } catch (error) {
    console.error('Error in register route:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
