
const Products = require('../models/Product');
const Reviews = require('../models/Review');
const Categories=require('../models/Category');
const getBlurDataURL = require("../config/getBlurDataURL");
const { multiFilesDelete } = require('../config/uploader');
const { URL } = require('url');

async function GetAllProducts(request, response) {

  try {
    const { searchParams } = new URL(request.url);
    const pageQuery = searchParams.get('page');
    const limitQuery = searchParams.get('limit');
    const searchQuery = searchParams.get('search');
    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;

    // Calculate skip correctly
    const skip = limit * (page - 1);

    const totalProducts = await Products.countDocuments({
      name: { $regex: searchQuery || '', $options: 'i' }
    });

    const products = await Products.aggregate([
      {
        $match: {
          name: { $regex: searchQuery || '', $options: 'i' }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $project: {
          _id: 1,
          cover: 1,
          status: 1,
          createdAt: 1,
          name: 1,
          slug: 1,
          colors: 1,
          sizes: 1,
          images: 1,
          priceSale: 1,
          available: 1,
          category: {
            _id: 1,
            name: 1 // Include the fields you need from the category
          },
          reviews: 1,
          averageRating: 1
        }
      }
    ]);

    response.status(200).json({
      success: true,
      data: products,
      total: totalProducts,
      count: Math.ceil(totalProducts / limit),
      currentPage: page
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
}

async function createProduct(req, res) {
  try {

    const {images,...body} = req.body;
    const blurDataUrl = await getBlurDataURL(images[0].url);
    const data = await Products.create({
      ...body,
      cover: images[0].url,
      blurDataUrl: blurDataUrl,
      likes: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product Created',
      data: data
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function getOneProductBySlug(req, res) {
    try {
        const {slug} = req.params;
        const products = await Products.findOne({slug })
          .populate({
            path: 'category'
          })
          .populate({
            path: 'brand',
            select: 'name'
          });
    
        if (!products) {
          return res.status(404).json({
            success: false,
            message: 'Products Not Found'
          });
        }
    
        const reviews = await Reviews.find({
          product: products._id
        })
          .sort({
            createdAt: -1
          })
          .populate('user')
          .exec();
    
        return res.status(200).json({
          success: true,
          product: products,
          reviews: reviews
        });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
  }
  async function updateProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      const { images, ...body } = req.body;
      const coverUrl = images[0].url;
      const blurDataUrl = await getBlurDataURL(coverUrl);
  
      const updated = await Products.findOneAndUpdate(
        { slug },
        {
          ...body,
          cover: coverUrl,
          blurDataUrl: blurDataUrl,
        },
        { new: true, runValidators: true }
      );
  
      return res.status(201).json({
        success: true,
        data: updated,
        message: 'Product Updated'
      });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async function deletedProductBySlug(req, res) {
    try {
      const slug = req.params.slug;
      const product = await Products.findOne({ slug: slug });
      const length = product?.images?.length || 0;
      for (let i = 0; i < length; i++) {
        await multiFilesDelete(product?.images[i]);
      }
  
      const deleteProduct = await Products.deleteOne({ slug: slug });
      if (!deleteProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product deletion failed. Please check if the product exists or try again later.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Product Deleted '
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  const getAllFilters = async (req, res) => {
    try {
      const totalProducts = await Products.find({
        status: { $ne: "disabled" },
      }).select(["colors", "sizes", "gender", "category"]);
      const brands = await Brands.find({
        status: { $ne: "disabled" },
      }).select(["name", "slug"]);
  
      const total = totalProducts.map((item) => item.gender);
      const totalGender = total.filter((item) => item !== "");
  
      function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
      }
      const mappedColors = totalProducts?.map((v) => v.colors);
      const mappedSizes = totalProducts?.map((v) => v.sizes);
      const mappedPrices = totalProducts?.map((v) => v.price);
      const min = mappedPrices[0] ? Math.min(...mappedPrices[0]) : 0;
      const max = mappedPrices[0] ? Math.max(...mappedPrices[0]) : 100000;
      const response = {
        colors: _.union(...mappedColors),
        sizes: _.union(...mappedSizes),
        prices: [min, max],
        genders: totalGender.filter(onlyUnique),
        brands: brands,
      };
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const getFiltersByCategory = async (req, res) => {
    try {
      const { category, subcategory } = req.params;
  
      let categoryQuery = { slug: category };
      if (subcategory) {
        categoryQuery = { slug: subcategory, parent: category };
      }
  
      const categoryData = await Categories.findOne(categoryQuery);
      if (!categoryData) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      const totalProducts = await Products.find({
        status: { $ne: "disabled" },
        category: categoryData._id,
      }).select(["colors", "sizes", "gender"]);
      const brands = await Brands.find({
        status: { $ne: "disabled" },
      }).select(["name", "slug"]);
  
      const total = totalProducts.map((item) => item.gender);
      const totalGender = total.filter((item) => item !== "");
  
      function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
      }
      const mappedColors = totalProducts?.map((v) => v.colors);
      const mappedSizes = totalProducts?.map((v) => v.sizes);
      const mappedPrices = totalProducts?.map((v) => v.price);
      const min = mappedPrices[0] ? Math.min(...mappedPrices[0]) : 0;
      const max = mappedPrices[0] ? Math.max(...mappedPrices[0]) : 100000;
      const response = {
        colors: _.union(...mappedColors),
        sizes: _.union(...mappedSizes),
        prices: [min, max],
        genders: totalGender.filter(onlyUnique),
        brands: brands,
      };
      res.status(200).json({
        success: true,
        data: { filters: response, category: categoryData },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
module.exports = {
     GetAllProducts,
      createProduct ,
      getOneProductBySlug,
      updateProductBySlug,
      deletedProductBySlug,
      getAllFilters,
      getFiltersByCategory
    };
