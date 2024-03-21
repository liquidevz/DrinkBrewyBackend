// eslint-disable-next-line no-undef
const Product = require("../models/product")

const BestSellerProducts = async (req, res) => {
	try {
		// Aggregate orders to calculate total quantity of each product sold
		const bestSellingProduct = await Product.find()
			.sort({ sold: -1 })
			.limit(8)
			.select([
				"images",
				"name",
				"slug",
				"brand",
				"colors",
				"sizes",
				"discount",
				"likes",
				"rating",
				"priceSale",
				"price",
			])
		return res.status(200).json({ success: true, data: bestSellingProduct })
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message })
	}
}
// eslint-disable-next-line no-undef
module.exports = { BestSellerProducts }
