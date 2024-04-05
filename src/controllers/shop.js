const Shop = require('../models/Shop');
const getBlurDataURL = require('../config/getBlurDataURL');
const { singleFileDelete } = require('../config/uploader');
const {getVendor,getAdmin} = require("../config/getUser");

// Admin apis
const getShopsByAdmin = async (req, res) => {
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
const createShopByAdmin = async (req, res) => {
  try {
    const admin = await getAdmin(req,res)
    const { logo, cover, ...others } = req.body;
    const logoBlurDataURL = await getBlurDataURL(logo.url);
    const coverBlurDataURL = await getBlurDataURL(cover.url);
    const shop = await Shop.create({
      vendor:admin._id.toString(),
      ...others,
      logo: {
        ...logo,
        logoBlurDataURL,
      },
      cover: {
        ...cover,
        coverBlurDataURL,
      },
      status: 'active',
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

const getOneShopByAdmin = async (req, res) => {
  try {
    const admin = await getAdmin(req,res)
    const { sid } = req.params;
    const shop = await Shop.findOne({ _id: sid,vendor:admin._id});
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
const updateOneShopByAdmin = async (req, res) => {
  try {
    const { sid } = req.params;
     const admin = await getAdmin(req,res)
    const { logo, cover, ...others } = req.body;
    const logoBlurDataURL = await getBlurDataURL(logo.url);
    const coverBlurDataURL = await getBlurDataURL(cover.url);
    const updateShop = await Shop.findOneAndUpdate(
      {
        _id: sid,
        vendor: admin._id
      },
      {
        ...others,
        logo: {
          ...logo,
          logoBlurDataURL
        },
         cover: {
          ...cover,
          coverBlurDataURL
        }
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
const updateShopStatusByAdmin = async (req, res) => {
  try {
    const { sid } = req.params;
     const admin = await getAdmin(req,res)
    const { status} = req.body;
    const updateStatus = await Shop.findOneAndUpdate(
      {
        _id: sid,
        vendor: admin._id
      },
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      });

    return res.status(200).json({
      success: true,
      data:updateStatus,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const deleteOneShopByAdmin = async (req, res) => {
  try {
    const admin = await getAdmin(req,res)
    const { sid } = req.params;
    const shop = await Shop.findOne({_id:sid,vendor:admin._id});
    if (!shop) {
      return res.status(404).json({ message: 'Shop Not Found' });
    }
    // const dataaa = await singleFileDelete(shop?.logo?._id,shop?.cover?._id);
    await Shop.deleteOne({ _id: sid }); // Corrected to pass an object to deleteOne method
    return res.status(200).json({
      success: true,
      message: "Shop Deleted Successfully" // Corrected message typo
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
// Vendor apis
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
const getOneShopByVendor = async (req, res) => {
  try {
    const { sid } = req.params;
    const vendor = await getVendor(req,res)
    const shop = await Shop.findOne({ _id: sid, vendor: vendor._id });
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

const updateOneShopByVendor = async (req, res) => {
  try {
    const { sid } = req.params;
     const vendor = await getVendor(req,res)
    const { logo, cover, ...others } = req.body;
    const logoBlurDataURL = await getBlurDataURL(logo.url);
    const coverBlurDataURL = await getBlurDataURL(cover.url);
    const updateShop = await Shop.findOneAndUpdate(
      {
        _id: sid,
        vendor: vendor._id.toString()
      },
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

const deleteOneShopByVendor = async (req, res) => {
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

//User apis
const getAllShops = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1; // default page to 1 if not provided
    limit = parseInt(limit) || null; // default limit to null if not provided

    let shopsQuery = Shop.find();

    // Apply pagination only if limit is provided
    if (limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const totalShops = await Shop.countDocuments();
      const totalPages = Math.ceil(totalShops / limit);

      shopsQuery = shopsQuery.limit(limit).skip(startIndex);

      const pagination = {
        currentPage: page,
        totalPages: totalPages,
        totalShops: totalShops
      };

      const shops = await shopsQuery.exec();

      return res.status(200).json({
        success: true,
        data: shops,
        pagination: pagination
      });
    } else {
      const shops = await shopsQuery.exec();

      return res.status(200).json({
        success: true,
        data: shops
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getOneShopByUser = async (req, res) => {
  try {
    const { sid } = req.params;
    const shop = await Shop.findOne({ _id: sid })
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

module.exports = {
  getShopsByAdmin,
  createShopByAdmin,
  getOneShopByAdmin,
  updateOneShopByAdmin,
  updateShopStatusByAdmin,
  deleteOneShopByAdmin,
  createShopByVendor,
  getOneShopByVendor,
  updateOneShopByVendor,
  deleteOneShopByVendor,
  getAllShops,
  getOneShopByUser
};
