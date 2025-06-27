import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error: ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};
export const deletFromCloudinary = async (url) => {
  try {
    if (!url) {
      console.log("No url provided");
      return null;
    }

    function extractPublicId(url) {
      const parts = url.split("/");
      const fileWithExt = parts.pop();
      const publicId = fileWithExt.split(".")[0];
      return publicId;
    }

    const public_id = extractPublicId(url);
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error("Cloudinary delete Error: ", error);
    return null;
  }
};
