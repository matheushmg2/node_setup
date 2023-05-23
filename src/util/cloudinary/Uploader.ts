import cloudinary from 'cloudinary';

export const Uploader = () => {
  const result = cloudinary.v2;
  result.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
  });

  return result.uploader;
}