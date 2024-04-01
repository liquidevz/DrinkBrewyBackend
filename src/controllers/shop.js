const Shop = require('../models/Shop');
const getBlurDataURL = require('../config/getBlurDataURL');
const { singleFileDelete } = require('../config/uploader');

const getShops = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalShop = await Shop.countDocuments();
    
    const shops = await Shop.find({}, null, {
      skip: skip,
      limit: parseInt(limit),
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: shops,
      count: Math.ceil(totalShop /limit),
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const createShop = async (req, res) => {
  try {
    const { logo, cover, ...others } = req.body;
    const logoBlurDataURL = await getBlurDataURL(logo.url);
    const coverBlurDataURL = await getBlurDataURL(cover.url);

    const shop = await Shop.create({
      ...others,
      logo: {
        ...logo,
        logoBlurDataURL,
      },
      cover: {
        ...cover,
        coverBlurDataURL,
      },
      status: 'pending',
    });

    return res.status(200).json({
      success: true,
      data:shop,
      message: 'Shop created',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const getShopById = async (req, res) => {
  try {
    const { sid } = req.params;
    const shop = await Shop.findById(sid);
    if (!shop) {
      return res.status(404).json({ message: 'Shop Not Found' });
    }
    return res.status(200).json({
      success: true,
      data:shop,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const updateShopById = async (req, res) => {
  try {
    const { sid } = req.params;
    const { logo, cover, ...others } = req.body;
    const logoBlurDataURL = await getBlurDataURL(logo.url);
    const coverBlurDataURL = await getBlurDataURL(cover.url);
    const updateShop = await Shop.findByIdAndUpdate(
       sid ,
      {
        ...others,
        logo: {
          ...logo,
          logoBlurDataURL
        },
         cover: {
          ...cover,
          coverBlurDataURL
        },
         status: 'pending',
      },
      {
        new: true,
        runValidators: true,
      });

    return res.status(200).json({
      success: true,
      data:updateShop,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteShopById = async (req, res) => {
  try {
    const { sid } = req.params;
    const shop = await Shop.findById(sid);
    if (!shop) {
      return res.status(404).json({ message: 'Shop Not Found' });
    }
    const dataaa = await singleFileDelete(shop?.logo?._id, shop?.cover?._id);
    await Shop.deleteOne({ _id: sid }); // Corrected to pass an object to deleteOne method
    return res.status(200).json({
      success: true,
      message: "Shop Deleted Successfully" // Corrected message typo
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();

    return res.status(200).json({
      success: true,
      data:shops,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getShops,
  createShop,
  getShopById,
  updateShopById,
  deleteShopById,
  getAllShops
};
