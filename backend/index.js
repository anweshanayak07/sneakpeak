require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Cloudinary
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "auth-token"],
  })
);

// ------------------ MongoDB ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ------------------ Multer ------------------
// We will use Multer to receive the file, then upload to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "/tmp"), // temp directory (works on Render)
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ------------------ Models ------------------
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
});

const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
});

// ------------------ Auth Middleware ------------------
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Token Missing" });

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid Token" });
  }
};

// ------------------ Upload Product Image ------------------
app.post("/upload", upload.single("product"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "sneakpeak-products",
    });

    res.json({
      success: true,
      image_url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------ Auth Routes ------------------
app.post("/signup", async (req, res) => {
  let existingUser = await Users.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(400).json({ success: false, error: "User already exists" });

  let cart = {};
  for (let i = 1; i <= 300; i++) cart[i] = 0;

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const token = jwt.sign({ user: { id: user._id } }, "secret_ecom");
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) return res.json({ success: false, error: "Wrong Email" });

  if (req.body.password !== user.password)
    return res.json({ success: false, error: "Wrong Password" });

  const token = jwt.sign({ user: { id: user._id } }, "secret_ecom");
  res.json({ success: true, token });
});

// ------------------ Product Routes ------------------
app.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

app.get("/newcollection", async (req, res) => {
  const products = await Product.find({});
  res.json(products.slice(-8));
});

app.get("/popularinmen", async (req, res) => {
  const products = await Product.find({ category: "men" });
  res.json(products.slice(0, 4));
});

// ------------------ Cart Routes ------------------
app.get("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

app.post("/addtocart", fetchUser, async (req, res) => {
  let user = await Users.findById(req.user.id);
  user.cartData[req.body.itemId] += 1;
  await user.save();
  res.json({ success: true });
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  let user = await Users.findById(req.user.id);
  if (user.cartData[req.body.itemId] > 0) user.cartData[req.body.itemId] -= 1;
  await user.save();
  res.json({ success: true });
});

// ------------------ Stripe Checkout ------------------
app.post("/create-checkout-session", async (req, res) => {
  console.log("🔥 Stripe route HIT");          
  console.log("🔥 BODY:", req.body);           
  console.log("🔥 PRODUCTS:", req.body.products); 

  try {
    const items = req.body.products;

    const lineItems = items.map((p) => ({
      price_data: {
        currency: "usd",
        product_data: { name: p.name, images: [p.image] },
        unit_amount: Math.round(Number(p.price || p.new_price) * 100),

      },
      quantity: p.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      
    });

    res.json({ url: session.url });
  } catch (error) {
  console.error("❌ Stripe Error:", error);
  res.status(400).json({ error: error.message });
}

});

// Get Stripe session info
app.get("/checkout-session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json(session);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
