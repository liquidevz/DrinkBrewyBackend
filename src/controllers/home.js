
const BrandModel = require("../models/Brand")

const Category = require("../models/Category")

const Product = require("../models/Product")

const getCategories = async (req, res) => {
	try {
		const categories = await Category.find().select([
			"name",
			"cover",
			"slug",
			"status",
		])
		res.status(201).json({ success: true, data: categories })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		})
	}
}

const getTopProducts = async (req, res) => {
	try {
		const bestSellingProduct = await Product.aggregate([
			{
				$lookup: {
					from: "reviews",
					localField: "reviews",
					foreignField: "_id",
					as: "reviews",
				},
			},
			{
				$addFields: {
					averageRating: { $avg: "$reviews.rating" },
					image: { $arrayElemAt: ["$images", 0] },
				},
			},
			{
				$sort: {
					sold: -1,
				},
			},
			{
				$limit: 8,
			},
			{
				$project: {
					_id: 1,
					name: 1,
					status: 1,
					isFeatured: 1,
					slug: 1,
					sku: 1,
					price: 1,
					priceSale: 1,
					available: 1,
					averageRating: 1,
					image: 1,
					colors: 1,
				},
			},
		])
		res.status(201).json({ success: true, data: bestSellingProduct })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		})
	}
}

const getBrands = async (req, res) => {
	try {
		const brands = await BrandModel.find().select([
			"name",
			"logo",
			"slug",
			"status",
		])

		res.status(201).json({ success: true, data: brands })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		})
	}
}

module.exports = {
	getCategories,
	getTopProducts,
	getBrands,
}
