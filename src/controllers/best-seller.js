
const Product =require('../models/Product');

const BestSellerProducts=async(req,res)=> {
  try {
    // Aggregate orders to calculate total quantity of each product sold
    const bestSellingProduct = await Product.find()
    .sort({sold: -1})
    .limit(8)
    .select([
    'images',
    'name',
    'slug',
    'brand',
    'colors',
    'sizes',
    'discount',
    'likes',
    'rating',
    'priceSale',
    'price'
  ]);
    return res.status(200).json({ success: true, data: bestSellingProduct });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
module.exports = { BestSellerProducts };