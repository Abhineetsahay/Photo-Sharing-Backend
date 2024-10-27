import express from "express"
import { registerValidation } from "../utils/Validators";
import { Register } from "../controllers/Auth/Register";
import {Login} from "../controllers/Auth/Login"
import { Logout } from "../controllers/Auth/LogOut";
import upload from "../middlewares/multer.middleware";
const AuthRoutes=express.Router();

AuthRoutes.post("/register",upload.single("file"),registerValidation,Register);
AuthRoutes.post("/login",Login)
AuthRoutes.post("/logout",Logout)

export default AuthRoutes; 