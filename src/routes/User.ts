import express from "express"
import EditController from "../controllers/User/EditUserProfile"
import upload from "../middlewares/multer.middleware";
import FollowController from "../controllers/User/FollowController";
import UploadPostControllers from "../controllers/User/Post.Controllers"
import { GetProfile } from "../controllers/User/GetProfile";
import { authenticateToken } from "../middlewares/AuthenticateToken.middleware";


const UserRoutes=express.Router();

UserRoutes.get("/user/:id",authenticateToken,GetProfile);
UserRoutes.get("/GetFollowers",authenticateToken,FollowController.getFollowers);
UserRoutes.get("/GetFollowing",authenticateToken,FollowController.getFollowing);

UserRoutes.put("/EditUserbio/:id",authenticateToken,EditController.editUserBio);
UserRoutes.put("/EditProfilePic/:id",upload.single("file"),EditController.editUserProfilePic);

UserRoutes.post("/followUser",authenticateToken,FollowController.followUser);
UserRoutes.post("/UnfollowUser",authenticateToken,FollowController.unfollowUser);
UserRoutes.post("/UploadPost",upload.single("file"),authenticateToken,UploadPostControllers.uploadPost);
UserRoutes.post("/AddComment",authenticateToken,UploadPostControllers.addComment);

UserRoutes.delete("/DeletePost",authenticateToken,UploadPostControllers.deletePost);
UserRoutes.delete("/DeleteComment",authenticateToken,UploadPostControllers.deleteComment);

export default UserRoutes;