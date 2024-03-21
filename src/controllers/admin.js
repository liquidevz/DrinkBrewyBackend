// eslint-disable-next-line no-undef
const User = require("../models/user")
// eslint-disable-next-line no-undef
const Order = require("../models/order")

const getUsersForAdmin = async (req, res) => {
	try {
		const { limit = 10, page = 1, search = "" } = req.query

		const skip = parseInt(limit) * (parseInt(page) - 1) || 0

		// Constructing nameQuery based on search input
		const nameQuery = search
			? {
					$or: [
						{ firstName: { $regex: search, $options: "i" } },
						{ lastName: { $regex: search, $options: "i" } },
						{ email: { $regex: search, $options: "i" } },
					],
				}
			: {}

		const totalUserCounts = await User.countDocuments(nameQuery)

		const users = await User.find(nameQuery, null, {
			skip: skip,
			limit: parseInt(limit),
		}).sort({
			createdAt: -1,
		})

		return res.status(200).json({
			success: true,
			data: users,
			count: Math.ceil(totalUserCounts / parseInt(limit)),
		})
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message })
	}
}
const getOrdersByUid = async (req, res) => {
	try {
		const id = req.params.id
		const { limit = 10, page = 1 } = req.query

		const skip = parseInt(limit) * (parseInt(page) - 1) || 0

		const currentUser = await User.findById(id)

		const totalOrders = await Order.countDocuments({ "user._id": id })

		const orders = await Order.find({ "user._id": id }, null, {
			skip: skip,
			limit: parseInt(limit),
		}).sort({
			createdAt: -1,
		})

		if (!currentUser) {
			return res.status(404).json({ success: false, message: "User Not Found" })
		}

		return res.status(200).json({
			success: true,
			user: currentUser,
			orders,
			count: Math.ceil(totalOrders / parseInt(limit)),
		})
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message })
	}
}

const UpdateRoleForAdmin = async (req, res) => {
	try {
		const id = req.params.id
		const userToUpdate = await User.findById(id)

		if (!userToUpdate) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." })
		}

		// Check if the user to update is a super admin
		if (userToUpdate.role === "super admin") {
			return res.status(403).json({
				success: false,
				message: "Cannot change the role of a super admin.",
			})
		}

		// Toggle the user's role
		const newRole = userToUpdate.role === "user" ? "admin" : "user"

		// Update the user's role
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ role: newRole },
			{ new: true, runValidators: true }
		)

		return res.status(200).json({
			success: true,
			message: `${updatedUser.firstName} is now ${newRole}.`,
		})
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message })
	}
}
// eslint-disable-next-line no-undef
module.exports = { getUsersForAdmin, getOrdersByUid, UpdateRoleForAdmin }
