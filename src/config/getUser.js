// eslint-disable-next-line no-undef
const Users = require("../models/user")
// eslint-disable-next-line no-undef
exports.getUser = async (req, res) => {
	if (!req.user) {
		return res
			.status(401)
			.json({ success: false, message: "You must be logged in." })
	}

	try {
		const user = await Users.findById(req.user._id)
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." })
		}

		return user
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal server error." })
	}
}
// eslint-disable-next-line no-undef
exports.getAdmin = async (req, res) => {
	try {
		if (!req.user) {
			return res
				.status(401)
				.json({ success: false, message: "You must be logged in." })
		}

		const user = await Users.findById(req.user._id)
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." })
		}
		if (!user.role.includes("admin")) {
			return { error: "Access denied.", status: 401 }
		}

		return user
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal server error." })
	}
}
