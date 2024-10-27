import { Response } from 'express';
import { CustomRequest } from '../../middlewares/AuthenticateToken.middleware';
import User from '../../models/User';
import { deleteOnCloudinary, uploadOnCloudinary } from '../../utils/cloudinary';
import fs, { PathLike } from 'fs';
import { JwtPayload } from 'jsonwebtoken';

class EditController {
  async editUserBio(req: CustomRequest, res: Response) {
    try {
      const user = req.user;
      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;

      const findUser = await User.findById({ _id: userId });
      const { bio } = req.body;

      if (!bio) {
        return res.status(400).json({
          success: false,
          message: 'Bio cannot be empty',
        });
      }
      if (!findUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      findUser.bio = bio;
      await findUser.save();
      return res.status(200).json({
        success: true,
        message: 'Bio updated successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async editUserProfilePic(req: CustomRequest, res: Response) {
    try {
      const user = req.user;

      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;

      const file = req.file?.path;
      const findUser = await User.findById({ _id: userId });

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Photo cannot be empty',
        });
      }
      if (!findUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      if (findUser.profilePicture) {
        const deleteResponse = await deleteOnCloudinary(
          findUser.profilePicture
        );
        if (deleteResponse?.result !== 'ok') {
          console.error('Failed to delete image on Cloudinary');
        } else {
          console.log('Image deleted successfully from Cloudinary');
        }
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const cloudinaryResponse = await uploadOnCloudinary(file);

      if (!cloudinaryResponse) {
        return res
          .status(500)
          .json({ message: 'Error uploading to Cloudinary' });
      }
      findUser.profilePicture = cloudinaryResponse.secure_url;
      await findUser.save();
      return res.status(200).json({
        success: true,
        message: 'Image updated successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      if (req.file?.path) {
        setTimeout(() => this.removeFile(req.file!.path), 5000);
      }
    }
  }

  private removeFile(path: PathLike) {
    if (!path) return;
    fs.unlink(path, (err) => {
      if (err) {
        console.error('Error removing file:', err);
      } else {
        console.log('File removed successfully');
      }
    });
  }
}

export default new EditController();
