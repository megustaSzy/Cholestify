import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "uploads",
        },
        (error, result) => {
          if (error) {
            console.log("Cloudinary Error:", error);

            return reject(error);
          }

          resolve(result);
        },
      )
      .end(buffer);
  });
};
