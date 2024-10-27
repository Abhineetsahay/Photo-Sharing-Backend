import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'PhotoApi',
    });
    return response;
  } catch (error) {
    console.error('Error uploading to Cloudinary', error);
    fs.unlinkSync(localFilePath);
  }
};

export const deleteOnCloudinary = async (url: string) => {
  try {
    if (!url) return null;
    const parts = url.split('/');
    const folder = parts[parts.length - 2];
    const publicIdWithExtension = parts.pop(); 
    const publicId = publicIdWithExtension?.split('.')[0]; 

    if (!publicId || !folder) {
      console.error('Invalid URL, could not extract public ID');
      return null;
    }
    const fullPublicId = `${folder}/${publicId}`;

    const response = await cloudinary.uploader.destroy(fullPublicId);

    return response;
  } catch (error) {
    console.error('Error deleting from Cloudinary', error);
    return null;
  }
};
