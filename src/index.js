"use strict"
// eslint-disable-next-line no-undef
const express = require("express")
// eslint-disable-next-line no-undef
const mongoose = require("mongoose")
// eslint-disable-next-line no-undef
const cors = require("cors")
// eslint-disable-next-line no-undef
const dotenv = require("dotenv")
// eslint-disable-next-line no-undef
const bodyParser = require("body-parser")
// Load environment variables from .env file
dotenv.config()

const app = express()
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080

// Middleware
app.use(cors())
app.use(bodyParser.json())

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
		console.log("Connected to MongoDB")
	})
	.catch(error => {
		console.error("Error connecting to MongoDB:", error)
	})

// Routes
// eslint-disable-next-line no-undef
const homeRoutes = require("./routes/home")
// eslint-disable-next-line no-undef
const authRoutes = require("./routes/auth")
// eslint-disable-next-line no-undef
const brandRoutes = require("./routes/brand")
// eslint-disable-next-line no-undef
const categoryRoutes = require("./routes/category")
// eslint-disable-next-line no-undef
const subcategoryRoutes = require("./routes/subcategory")
// eslint-disable-next-line no-undef
const newsletterRoutes = require("./routes/newsletter")
// eslint-disable-next-line no-undef
const productRoutes = require("./routes/product")
// eslint-disable-next-line no-undef
const dashboardRoutes = require("./routes/dashboard")
// eslint-disable-next-line no-undef
const searchRoutes = require("./routes/search")
// eslint-disable-next-line no-undef
const best_sellerRoutes = require("./routes/best-seller")
// eslint-disable-next-line no-undef
const userRoutes = require("./routes/user")
// eslint-disable-next-line no-undef
const cartRoutes = require("./routes/cart")
// eslint-disable-next-line no-undef
const couponCodeRoutes = require("./routes/coupon-code")
// eslint-disable-next-line no-undef
const reviewRoutes = require("./routes/review")
// eslint-disable-next-line no-undef
const wishlistRoutes = require("./routes/wishlist")
// eslint-disable-next-line no-undef
const OrderRoutes = require("./routes/order")
// eslint-disable-next-line no-undef
const adminRoutes = require("./routes/admin")

app.use("/api", homeRoutes)
app.use("/api", authRoutes)
app.use("/api", brandRoutes)
app.use("/api", categoryRoutes)
app.use("/api", subcategoryRoutes)
app.use("/api", newsletterRoutes)
app.use("/api", productRoutes)
app.use("/api", dashboardRoutes)
app.use("/api", searchRoutes)
app.use("/api", best_sellerRoutes)
app.use("/api", userRoutes)
app.use("/api", cartRoutes)
app.use("/api", couponCodeRoutes)
app.use("/api", reviewRoutes)
app.use("/api", wishlistRoutes)
app.use("/api", OrderRoutes)
app.use("/api", adminRoutes)

// GET API
app.get("/", (req, res) => {
	res.send("This is a GET API")
})

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
