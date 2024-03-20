// eslint-disable-next-line no-undef
const Newsletter = require("../models/Newsletter");

const getNewsletters = async (req, res) => {
  try {
    const skip = 10;
    const NewsletterTotal = await Newsletter.find({}, null, {}).sort({
      createdAt: -1,
    });

    const page = parseInt(req.query.page) || 1;

    const data = await Newsletter.find({}, null, {
      skip: skip * (page - 1),
      limit: skip,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: data,
      count: Math.ceil(NewsletterTotal.length / skip),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createNewsletter = async (req, res) => {
  try {
    // Create a new Newsletter document
    await Newsletter.create({
      email: req.body.email,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "newsletter-added",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "failed-to-add-newsletter",
    });
  }
};
// eslint-disable-next-line no-undef
module.exports = {
  getNewsletters,
  createNewsletter,
};
