// eslint-disable-next-line no-undef
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  // eslint-disable-next-line no-undef
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   // eslint-disable-next-line no-undef
  api_key: process.env.CLOUDINARY_PUBLISHABLE_KEY,
   // eslint-disable-next-line no-undef
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});
 // eslint-disable-next-line no-undef
module.exports = { cloudinary };
