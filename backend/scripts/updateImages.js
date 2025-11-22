require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// MongoDB model
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
});

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const imagesDir = path.join(__dirname, "../upload/images");

async function updateImages() {
  try {
    const files = fs.readdirSync(imagesDir);

    for (const file of files) {
      console.log(`Uploading: ${file}`);

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(
        path.join(imagesDir, file),
        { folder: "sneakpeak-products" }
      );

      const cloudinaryURL = result.secure_url;

      console.log(`Cloudinary URL: ${cloudinaryURL}`);

      // Find product with this image name
      const product = await Product.findOne({
        image: { $regex: file },
      });

      if (!product) {
        console.log(`❌ No product found for: ${file}`);
        continue;
      }

      // Update product image URL
      product.image = cloudinaryURL;
      await product.save();

      console.log(`✅ Updated product: ${product.name}`);
    }

    console.log("🎉 ALL IMAGES UPDATED SUCCESSFULLY!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

updateImages();
