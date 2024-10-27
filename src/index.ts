import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { databaseConnect } from "./config/database";
import AuthRoutes from "./routes/Register";
import UserRoutes from "./routes/User";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;
app.use(express.json());
app.use(cors());


const connect = async () => {

  app.use("/api/v1",AuthRoutes);
  app.use("/api/v1",UserRoutes);
  app.use("/",(req,res)=>{
    res.send("IN EXPRESS SERVER")
  })
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
  await databaseConnect();
};

connect();