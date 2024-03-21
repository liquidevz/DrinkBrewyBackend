// controllers/newsController.js
// eslint-disable-next-line no-undef
const Brand = require("../models/brand")
// eslint-disable-next-line no-undef
const Product = require("../models/product")
// eslint-disable-next-line no-undef
const Category = require("../models/category")
// eslint-disable-next-line no-undef
const SubCategory = require("../models/sub-category")
// eslint-disable-next-line no-undef
const _ = require("lodash")
// eslint-disable-next-line no-undef
const blurDataUrl = require("../config/getBlurDataURL")
const getProducts = async (req, res) => {
	try {
		const query = req.query // Extract query params from request

		var newQuery = { ...query }
		delete newQuery.page
		delete newQuery.prices
		delete newQuery.sizes
		delete newQuery.colors
		delete newQuery.name
		delete newQuery.date
		delete newQuery.price
		delete newQuery.top
		delete newQuery.brand
		delete newQuery.category
		delete newQuery.subCategory
		delete newQuery.gender
		for (const [key, value] of Object.entries(newQuery)) {
			newQuery = { ...newQuery, [key]: value.split("_") }
		}
		const brand = await Brand.findOne({
			slug: query.brand,
		}).select("slug")
		const category = await Category.findOne({
			slug: query.category,
		}).select("slug")

		const subCategory = await SubCategory.findOne({
			slug: query.subCategory,
		}).select("slug")

		console.log(category, subCategory, "subCategory")
		const skip = query.limit || 12
		const totalProducts = await Product.countDocuments({
			...newQuery,
			...(Boolean(query.brand) && { brand: brand._id }),
			...(Boolean(query.category) && { category: category._id }),
			...(Boolean(query.subCategory) && { subCategory: subCategory._id }),
			...(query.sizes && { sizes: { $in: query.sizes.split("_") } }),
			...(query.colors && { colors: { $in: query.colors.split("_") } }),

			priceSale: {
				$gt: query.prices ? Number(query.prices.split("_")[0]) : 1,
				$lt: query.prices ? Number(query.prices.split("_")[1]) : 1000000,
			},
			status: { $ne: "disabled" },
		}).select([""])

		const minPrice = query.prices ? Number(query.prices.split("_")[0]) : 1
		const maxPrice = query.prices
			? Number(query.prices.split("_")[1])
			: 10000000

		const products = await Product.aggregate([
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
				$match: {
					...(Boolean(query.category) && {
						category: category._id,
					}),
					...(Boolean(query.subCategory) && {
						subCategory: subCategory._id,
					}),

					...(Boolean(query.brand) && {
						brand: query.brand,
					}),
					...(query.isFeatured && {
						isFeatured: Boolean(query.isFeatured),
					}),

					...(query.gender && {
						gender: { $in: query.gender.split("_") },
					}),
					...(query.sizes && {
						sizes: { $in: query.sizes.split("_") },
					}),

					...(query.colors && {
						colors: { $in: query.colors.split("_") },
					}),
					...(query.prices && {
						priceSale: {
							$gt: minPrice,
							$lt: maxPrice,
						},
					}),
					status: { $ne: "disabled" },
				},
			},
			{
				$project: {
					image: { url: "$image.url", blurDataURL: "$image.blurDataURL" },
					name: 1,
					slug: 1,
					colors: 1,
					discount: 1,
					likes: 1,
					rating: { $avg: "$reviews.rating" }, // Assuming rating is the average of reviews' ratings
					priceSale: 1,
					price: 1,
					averageRating: 1,
				},
			},
			{
				$sort: {
					...((query.date && { createdAt: Number(query.date) }) ||
						(query.price && {
							priceSale: Number(query.price),
						}) ||
						(query.name && { name: Number(query.name) }) ||
						(query.top && { averageRating: Number(query.top) }) || {
							averageRating: -1,
						}),
				},
			},
			{
				$skip: Number(skip * parseInt(query.page ? query.page[0] - 1 : 0)),
			},
			{
				$limit: Number(skip),
			},
		])

		res.status(201).json({
			success: true,
			data: products,
			total: totalProducts,
			count: Math.ceil(totalProducts / skip),
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		})
	}
}

const getFilters = async (req, res) => {
	try {
		const totalProducts = await Product.find({
			status: { $ne: "disabled" },
		}).select(["colors", "sizes", "gender", "price"])
		const brands = await Brand.find({
			status: { $ne: "disabled" },
		}).select(["name", "slug"])
		const total = totalProducts.map(item => item.gender)
		const totalGender = total.filter(item => item !== "")
		// eslint-disable-next-line no-inner-declarations
		function onlyUnique(value, index, array) {
			return array.indexOf(value) === index
		}
		const mappedColors = totalProducts?.map(v => v.colors)
		const mappedSizes = totalProducts?.map(v => v.sizes)
		const mappedPrices = totalProducts?.map(v => v.price)
		const min = mappedPrices[0] ? Math.min(...mappedPrices) : 0
		const max = mappedPrices[0] ? Math.max(...mappedPrices) : 100000
		const response = {
			colors: _.union(...mappedColors),
			sizes: _.union(...mappedSizes),
			prices: [min, max],
			genders: totalGender.filter(onlyUnique),
			brands: brands,
		}
		res.status(201).json({ success: true, data: response })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		})
	}
}
async function GetAllProductsForAdmin(request, response) {
	try {
		const {
			page: pageQuery,
			limit: limitQuery,
			search: searchQuery,
		} = request.query

		const limit = parseInt(limitQuery) || 10
		const page = parseInt(pageQuery) || 1

		// Calculate skip correctly
		const skip = limit * (page - 1)

		const totalProducts = await Product.countDocuments({
			name: { $regex: searchQuery || "", $options: "i" },
		})

		const products = await Product.aggregate([
			{
				$match: {
					name: { $regex: searchQuery || "", $options: "i" },
				},
			},
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$skip: skip,
			},
			{
				$limit: limit,
			},
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
				},
			},

			{
				$project: {
					_id: 1,
					status: 1,
					createdAt: 1,
					name: 1,
					slug: 1,
					colors: 1,

					images: 1,
					priceSale: 1,
					available: 1,

					// category: {
					//   _id: 1,
					//   name: 1, // Include the fields you need from the category
					// },
					// reviews: 1,
					averageRating: 1,
				},
			},
		])

		response.status(200).json({
			success: true,
			data: products,
			total: totalProducts,
			count: Math.ceil(totalProducts / limit),
			currentPage: page,
		})
	} catch (error) {
		response.status(400).json({ success: false, message: error.message })
	}
}
async function createProduct(req, res) {
	try {
		const { images, ...body } = req.body

		const updatedImages = await Promise.all(
			images.map(async image => {
				const blurDataURL = await blurDataUrl(image.url)
				return { ...image, blurDataURL }
			})
		)
		const data = await Product.create({
			...body,
			images: updatedImages,
			likes: 0,
		})

		res.status(201).json({
			success: true,
			message: "Product Created",
			data: data,
		})
	} catch (error) {
		res.status(400).json({ success: false, message: error.message })
	}
}

async function getOneProductBySlug(req, res) {
	try {
		const product = await Product.findOne({ slug: req.params.slug })
		const category = await Category.findById(product.category).select("name")
		const brand = await Brand.findById(product.brand).select("name")

		if (!product) {
			// eslint-disable-next-line no-undef
			notFound()
		}

		const getProductRatingAndReviews = () => {
			return Product.aggregate([
				{
					$match: { slug: req.params.slug },
				},
				{
					$lookup: {
						from: "reviews",
						localField: "_id",
						foreignField: "product",
						as: "reviews",
					},
				},
				{
					$project: {
						_id: 1,
						name: 1,
						rating: { $avg: "$reviews.rating" },
						totalReviews: { $size: "$reviews" },
					},
				},
			])
		}

		const reviewReport = await getProductRatingAndReviews()
		return res.status(201).json({
			success: true,
			data: product,
			totalRating: reviewReport[0]?.rating,
			totalReviews: reviewReport[0]?.totalReviews,
			brand: brand,
			category: category,
		})
	} catch (error) {
		return res.status(400).json({ success: false, error: error.message })
	}
}
const updateProductBySlug = async (req, res) => {
	try {
		const { slug } = req.params
		const { images, ...body } = req.body

		const updatedImages = await Promise.all(
			images.map(async image => {
				const blurDataURL = await blurDataUrl(image.url)
				return { ...image, blurDataURL }
			})
		)

		const updated = await Product.findOneAndUpdate(
			{ slug: slug },
			{
				...body,
				images: updatedImages,
			},
			{ new: true, runValidators: true }
		)

		return res.status(201).json({
			success: true,
			data: updated,
			message: "Product Updated",
		})
	} catch (error) {
		return res.status(400).json({ success: false, error: error.message })
	}
}
async function deletedProductBySlug(req, res) {
	try {
		const slug = req.params.slug
		const product = await Product.findOne({ slug: slug })
		// eslint-disable-next-line no-unused-vars
		const length = product?.images?.length || 0
		// for (let i = 0; i < length; i++) {
		//   // eslint-disable-next-line no-undef
		//   await multiFilesDelete(product?.images[i]);
		// }

		const deleteProduct = await Product.deleteOne({ slug: req.params.slug })
		if (!deleteProduct) {
			return res.status(400).json({
				success: false,
				message:
					"Product deletion failed. Please check if the product exists or try again later.",
			})
		}
		return res.status(200).json({
			success: true,
			message: "Product Deleted ",
		})
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message })
	}
}

const getFiltersByCategory = async (req, res) => {
	try {
		const { category } = req.params

		const categoryData = await Category.findOne({ slug: category }).select([
			"name",
			"slug",
		])
		if (!categoryData) {
			return res
				.status(404)
				.json({ success: false, message: "Category not found" })
		}
		const totalProducts = await Product.find({
			status: { $ne: "disabled" },
			category: categoryData._id,
		}).select(["colors", "sizes", "gender"])
		const brands = await Brand.find({
			status: { $ne: "disabled" },
		}).select(["name", "slug"])

		const total = totalProducts.map(item => item.gender)
		const totalGender = total.filter(item => item !== "")

		// eslint-disable-next-line no-inner-declarations
		function onlyUnique(value, index, array) {
			return array.indexOf(value) === index
		}
		const mappedColors = totalProducts?.map(v => v.colors)
		const mappedSizes = totalProducts?.map(v => v.sizes)
		const mappedPrices = totalProducts?.map(v => v.price)
		const min = mappedPrices[0] ? Math.min(...mappedPrices[0]) : 0
		const max = mappedPrices[0] ? Math.max(...mappedPrices[0]) : 100000
		const response = {
			colors: _.union(...mappedColors),
			sizes: _.union(...mappedSizes),
			prices: [min, max],
			genders: totalGender.filter(onlyUnique),
			brands: brands,
		}
		res.status(200).json({
			success: true,
			data: response,
		})
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}
const getFiltersBySubCategory = async (req, res) => {
	try {
		const { category, subcategory } = req.params

		const categoryData = await Category.findOne({ slug: category }).select([
			"name",
			"slug",
		])
		const subCategoryData = await SubCategory.findOne({
			slug: subcategory,
		}).select(["name", "slug"])
		if (!categoryData) {
			return res
				.status(404)
				.json({ success: false, message: "Category not found" })
		}
		if (!subCategoryData) {
			return res
				.status(404)
				.json({ success: false, message: "SubCategory not found" })
		}
		const totalProducts = await Product.find({
			status: { $ne: "disabled" },
			subCategory: subCategoryData._id,
		}).select(["colors", "sizes", "gender"])
		const brands = await Brand.find({
			status: { $ne: "disabled" },
		}).select(["name", "slug"])

		const total = totalProducts.map(item => item.gender)
		const totalGender = total.filter(item => item !== "")

		// eslint-disable-next-line no-inner-declarations
		function onlyUnique(value, index, array) {
			return array.indexOf(value) === index
		}
		const mappedColors = totalProducts?.map(v => v.colors)
		const mappedSizes = totalProducts?.map(v => v.sizes)
		const mappedPrices = totalProducts?.map(v => v.price)
		const min = mappedPrices[0] ? Math.min(...mappedPrices[0]) : 0
		const max = mappedPrices[0] ? Math.max(...mappedPrices[0]) : 100000
		const response = {
			colors: _.union(...mappedColors),
			sizes: _.union(...mappedSizes),
			prices: [min, max],
			genders: totalGender.filter(onlyUnique),
			brands: brands,
		}
		res.status(200).json({
			success: true,
			data: response,
		})
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

const getAllProductSlug = async (req, res) => {
	try {
		const products = await Product.find().select("slug")

		return res.status(200).json({
			success: true,
			data: products,
		})
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message })
	}
}
// eslint-disable-next-line no-undef
module.exports = {
	getProducts,
	getFilters,
	GetAllProductsForAdmin,
	createProduct,
	getOneProductBySlug,
	updateProductBySlug,
	deletedProductBySlug,
	getFiltersByCategory,
	getAllProductSlug,
	getFiltersBySubCategory,
}
