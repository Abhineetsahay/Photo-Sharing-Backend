import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const databaseConnect = async () => {
  const dbUrl: string | undefined = process.env.MONGODB_URL;
  if (!dbUrl) {
    throw new Error('MONGODB_URL is not defined in the environment variables');
  }
  try {
    await mongoose.connect(dbUrl);
    console.log("DB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log("DB CONNECTION ISSUES");
    console.error(error);
    process.exit(1);
  }
};
