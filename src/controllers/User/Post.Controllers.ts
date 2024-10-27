import { Response } from 'express';
import { CustomRequest } from '../../middlewares/AuthenticateToken.middleware';
import { JwtPayload } from 'jsonwebtoken';
import User from '../../models/User';
import Post from '../../models/Post';
import { uploadOnCloudinary } from '../../utils/cloudinary';
import fs, { PathLike } from 'fs';
import { Types } from 'mongoose';
import { deleteOnCloudinary } from '../../utils/cloudinary';

class UploadPostControllers {
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

  async uploadPost(req: CustomRequest, res: Response) {
    try {
      const file = req.file?.path;
      const { caption } = req.body;
      const user = req.user;

      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'file cannot be empty',
        });
      }

      const findUser = await User.findById(userId);
      if (!findUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const cloudinaryResponse = await uploadOnCloudinary(file);
      if (!cloudinaryResponse) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading to Cloudinary',
        });
      }

      const newPost = new Post({
        image: cloudinaryResponse.secure_url,
        caption: caption,
        author: userId,
      });

      await newPost.save();
      findUser.posts?.push(newPost._id);
      await findUser.save();
      return res.status(201).json({
        success: true,
        message: 'Post uploaded successfully',
        post: newPost,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    } finally {
      if (req.file?.path) {
        setTimeout(() => this.removeFile(req.file!.path), 5000);
      }
    }
  }
  async deletePost(req: CustomRequest, res: Response) {
    try {
      const { postId } = req.query;
      if (!postId) {
        return res.status(400).json({
          success: false,
          message: 'postId is required',
        });
      }
      const user = req.user;
      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }
      if (post.author.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this post',
        });
      }

      const deleteResponse = await deleteOnCloudinary(post.image);
      if (deleteResponse?.result !== 'ok') {
        console.error('Failed to delete image on Cloudinary');
      } else {
        console.log('Image deleted successfully from Cloudinary');
      }
      await Post.findByIdAndDelete(postId);
      const userUpdate = await User.findById(userId);
      if (userUpdate) {
        userUpdate.posts = userUpdate.posts?.filter(
          (postId) => postId.toString() !== post._id.toString()
        );
        await userUpdate.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async addComment(req: CustomRequest, res: Response) {
    try {
      const { postId, content } = req.body;
      if (!postId || !content) {
        return res.status(400).json({
          success: false,
          message: 'Give postId and content',
        });
      }
      const user = req.user;
      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;
      const findPostAndAddComment = await Post.findById({ _id: postId });

      if (!findPostAndAddComment) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }
      const newComment = {
        user: new Types.ObjectId(userId),
        content,
        createdAt: new Date(),
        _id: new Types.ObjectId(),
      };
      findPostAndAddComment?.comments?.push(newComment);
      await findPostAndAddComment.save();
      return res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        comment: newComment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  async deleteComment(req: CustomRequest, res: Response) {
    try {
      const { postId, commentId } = req.query;

      if (!postId || !commentId) {
        return res.status(400).json({
          success: false,
          message: 'postId and commentId are required',
        });
      }

      const user = req.user;
      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      post.comments = post.comments || [];
      const commentIndex = post.comments.findIndex(
        (comment) =>
          comment._id.toString() === commentId &&
          comment.user.toString() === userId
      );

      if (commentIndex === -1) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this comment',
        });
      }

      post.comments.splice(commentIndex, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

export default new UploadPostControllers();
