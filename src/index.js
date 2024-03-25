"use strict";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
	.connect(
		"mongodb+srv://vercel-admin-user:uKWAWdCpSoBDdApC@cluster0.whfrnxl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch(error => {
		console.error("Error connecting to MongoDB:", error);
	});

// Routes
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const brandRoutes = require("./routes/brand");
const categoryRoutes = require("./routes/category");
const subcategoryRoutes = require("./routes/subcategory");
const newsletterRoutes = require("./routes/newsletter");
const productRoutes = require("./routes/product");
const dashboardRoutes = require("./routes/dashboard");
const searchRoutes = require("./routes/search");
const best_sellerRoutes = require("./routes/best-seller");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const couponCodeRoutes = require("./routes/coupon-code");
const reviewRoutes = require("./routes/review");
const wishlistRoutes = require("./routes/wishlist");
const OrderRoutes = require("./routes/order");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment-intents");

app.use("/api", homeRoutes);
app.use("/api", authRoutes);
app.use("/api", brandRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subcategoryRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", productRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", searchRoutes);
app.use("/api", best_sellerRoutes);
app.use("/api", userRoutes);
app.use("/api", cartRoutes);
app.use("/api", couponCodeRoutes);
app.use("/api", reviewRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", OrderRoutes);
app.use("/api", adminRoutes);
app.use("/api", paymentRoutes);

// GET API
app.get("/", (req, res) => {
	res.send("This is a GET API");
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
