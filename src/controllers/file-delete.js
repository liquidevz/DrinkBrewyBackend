const { singleFileDelete, multiFilesDelete } = require("../config/uploader");
const deleteFile = async (req, res) => {
	try {
		const { _id } = req.body;
		const result = await singleFileDelete(_id);

		res.status(200).json({ success: true, message: result });
	} catch (error) {
		res.status(400).json({ success: false, message: error });
	}
};
module.exports = { deleteFile };
