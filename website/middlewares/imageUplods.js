const cloudinary = require("../utils/cloudinary");
// Define the Cloudinary upload middleware
const uploadToCloudinary = async (req, res, next) => {
    // console.log(req.file, "req file");
  try {
    if (!req.file) {
    // console.log(req.file, "under if req file");

      return res.status(400).json({ error: 'No file uploaded' });
    }
    const data = req.file?.path;
    // console.log(data, "data");

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(data);
    req.cloudinaryUrl = result.url; // Store the Cloudinary URL in the request object

    next(); // Continue to the next middleware or route
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Error uploading to Cloudinary' });
  }
};

module.exports = { uploadToCloudinary };
