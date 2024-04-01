const Shop = require('../models/Shop');

const createShop = async (req, res) => {
  try {
    const shop = await Shop.create({
      ...req.body,
      status: 'pending',
    });

    return res.status(200).json({
      success: true,
      message: 'Shop created',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createShop };
