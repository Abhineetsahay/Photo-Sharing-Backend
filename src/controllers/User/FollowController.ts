import { Response } from 'express';
import User, { IUser } from '../../models/User';
import { CustomRequest } from '../../middlewares/AuthenticateToken.middleware';
import { JwtPayload } from 'jsonwebtoken';

class FollowController {
  async followUser(req: CustomRequest, res: Response) {
    try {
      const followUserId = req.query.followUserId as string;
      const user = req.user;

      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;

      if (!followUserId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Enter user id',
        });
      }

      const followedBy: IUser | null = await User.findById({ _id: userId });
      const followedTo: IUser | null = await User.findById({ _id: followUserId });

      if (!followedBy || !followedTo) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      followedBy.following = followedBy.following || [];
      followedTo.followers = followedTo.followers || [];

      if (!followedBy.following.includes(followedTo.username)) {
        followedBy.following.push(followedTo.username);
        followedTo.followers.push(followedBy.username);

        await followedBy.save();
        await followedTo.save();

        return res.status(200).json({
          success: true,
          message: 'Followed successfully',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Already following this user',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async unfollowUser(req: CustomRequest, res: Response) {
    try {
      const unfollowUserId = req.query.UnfollowUserId as string;
      const user = req.user;

      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;

      if (!unfollowUserId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Enter user id',
        });
      }

      const unfollowedBy: IUser | null = await User.findById({ _id: userId });
      const unfollowedTo: IUser | null = await User.findById({ _id: unfollowUserId });

      if (!unfollowedBy || !unfollowedTo) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      unfollowedBy.following = unfollowedBy.following || [];
      unfollowedTo.followers = unfollowedTo.followers || [];

      if (unfollowedBy.following.includes(unfollowedTo.username)) {
        unfollowedBy.following = unfollowedBy.following.filter(
          (follow) => follow !== unfollowedTo.username
        );
        unfollowedTo.followers = unfollowedTo.followers.filter(
          (follower) => follower !== unfollowedBy.username
        );

        await unfollowedBy.save();
        await unfollowedTo.save();

        return res.status(200).json({
          success: true,
          message: 'Unfollowed successfully',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Already not following this user',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getFollowers(req: CustomRequest, res: Response) {
    try {
      const user = req.user;
      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;

      const findUser = await User.findById({ _id: userId });
      if (!findUser) {
        return res.status(404).json({
          success: false,
          message: 'User not available',
        });
      }

      return res.status(200).json({
        success: true,
        followers: findUser.followers,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getFollowing(req: CustomRequest, res: Response) {
    try {
      const user = req.user;
      const userId = typeof user === 'string' ? user : (user as JwtPayload)?.id;

      const findUser = await User.findById({ _id: userId });
      if (!findUser) {
        return res.status(404).json({
          success: false,
          message: 'User not available',
        });
      }

      return res.status(200).json({
        success: true,
        following: findUser.following,
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

export default new FollowController();
