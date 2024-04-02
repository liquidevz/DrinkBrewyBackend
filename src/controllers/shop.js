const Shop = require('../models/Shop');
const getBlurDataURL = require('../config/getBlurDataURL');
const { singleFileDelete } = require('../config/uploader');
const {getVendor} = require("../config/getUser");


const getShopsByAdmin = async (req, res) => {
  try {
    const vendor = await getVendor(req,res)

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

const createShopByVendor = async (req, res) => {
  try {
        const vendor = await getVendor(req,res)
    const { logo, cover, ...others } = req.body;
    const logoBlurDataURL = await getBlurDataURL(logo.url);
    const coverBlurDataURL = await getBlurDataURL(cover.url);
    console.log(vendor)
    const shop = await Shop.create({
      vendor:vendor._id.toString(),
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
    const vendor = await getVendor(req,res)
    const shop = await Shop.find({ _id: sid, vendor: vendor._id });
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
     const vendor = await getVendor(req,res)
    const { logo, cover, ...others } = req.body;
    const logoBlurDataURL = await getBlurDataURL(logo.url);
    const coverBlurDataURL = await getBlurDataURL(cover.url);
    const updateShop = await Shop.findOneAndUpdate(
       {_id:sid,vendor:vendor._id} ,
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
     const vendor = await getVendor(req,res)
    const shop = await Shop.findOne({_id:sid,vendor:vendor._id});
    if (!shop) {
      return res.status(404).json({ message: 'Shop Not Found' });
    }
    // const dataaa = await singleFileDelete(shop?.logo?._id,shop?.cover?._id);
    await Shop.deleteOne({ _id: sid,vendor:vendor._id }); // Corrected to pass an object to deleteOne method
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
  getShopsByAdmin,
  createShopByVendor,
  getShopById,
  updateShopById,
  deleteShopById,
  getAllShops
};
