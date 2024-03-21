
const Products = require("../models/Product")

const createCart = async (request, response) => {
	try {
		const req = await request.body
		const cartItems = []

		for (const item of req.products) {
			const product = await Products.findById(item.pid).select([
				"cover",
				"name",
				"brand",
				"slug",
				"available",
				"images",
				"price",
				"priceSale",
			])

			if (!product) {
				// Handle product not found
				return response
					.status(404)
					.json({ success: false, message: "Products Not Found" })
			}
			const { quantity, color, size, sku } = item
			if (product.available < quantity) {
				return response
					.status(400)
					.json({ success: false, message: "No Products in Stock" })
			}

			const subtotal = (product.priceSale || product.price) * quantity
			// const { _id, ...others } = product.toObject();
			const { ...others } = product.toObject()
			cartItems.push({
				...others,
				pid: item.pid,
				quantity,
				size,
				color,
				subtotal: subtotal.toFixed(2),
				sku: sku,
			})
		}

		return response.status(200).json({
			success: true,
			data: cartItems,
		})
	} catch (error) {
		return response.status(400).json({ success: false, message: error.message })
	}
}

module.exports = { createCart }
