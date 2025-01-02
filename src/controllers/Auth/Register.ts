import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../../models/User';
import { generateJWTToken } from '../../utils/GenerateToken';
import { uploadOnCloudinary } from '../../utils/cloudinary';
import fs from 'fs';

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

const removeFile = (path: any) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error('Error removing file:', err);
    } else {
      console.log('File removed successfully');
    }
  });
};

export const Register = async (req: FileRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email or email already exists' }); 
    }
     
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResponse) {
      return res.status(500).json({ message: 'Error uploading to Cloudinary' });
    }

    const newUser: IUser = new User({
      username,
      email,
      password,
      profilePicture: cloudinaryResponse.secure_url,
    });

    const token = generateJWTToken(newUser);

    res.cookie('accessToken', token.accessToken, {
      sameSite: 'strict',
      secure: true,
    });

    res.cookie('refreshToken', token.refreshToken, {
      sameSite: 'strict',
      secure: true,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      ...token,
    });
  } catch (error) {
    console.error('Error in register route:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (req.file && req.file.path) {
      setTimeout(() => removeFile(req.file?.path), 5000);
    }
  }
};
