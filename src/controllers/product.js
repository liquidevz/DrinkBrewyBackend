// controllers/newsController.js
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Review = require('../models/Review');
const _ = require('lodash');
const getProducts = async (req, res) => {
  try {
    const query = req.query; // Extract query params from request

    var newQuery = { ...query };
    delete newQuery.page;
    delete newQuery.prices;
    delete newQuery.sizes;
    delete newQuery.colors;
    delete newQuery.name;
    delete newQuery.date;
    delete newQuery.price;
    delete newQuery.top;
    delete newQuery.brand;
    delete newQuery.category;
    delete newQuery.subCategory;
    delete newQuery.gender;
    for (const [key, value] of Object.entries(newQuery)) {
      newQuery = { ...newQuery, [key]: value.split('_') };
    }
    const brand = await Brand.findOne({
      slug: query.brand,
    }).select(['_id']);
    const category = await Category.findOne({
      slug: query.category,
    }).select(['_id']);
    const subCategory = await SubCategory.findOne({
      slug: query.subCategory,
    }).select(['_id']);
    const skip = query.limit || 12;
    const totalProducts = await Product.countDocuments({
      ...newQuery,
      ...(Boolean(query.brand) && { brand: brand._id }),
      ...(Boolean(query.category) && { category: category._id }),
      ...(Boolean(query.subCategory) && { subCategory: subCategory._id }),
      ...(query.sizes && { sizes: { $in: query.sizes.split('_') } }),
      ...(query.colors && { colors: { $in: query.colors.split('_') } }),

      priceSale: {
        $gt: query.prices ? Number(query.prices.split('_')[0]) : 1,
        $lt: query.prices ? Number(query.prices.split('_')[1]) : 1000000,
      },
      status: { $ne: 'disabled' },
    }).select(['']);

    const minPrice = query.prices ? Number(query.prices.split('_')[0]) : 1;
    const maxPrice = query.prices
      ? Number(query.prices.split('_')[1])
      : 10000000;

    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
          image: { $arrayElemAt: ['$images', 0] },
        },
      },
      {
        $lookup: {
          from: 'categories', // Update with the actual collection name for brands
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'subCategories', // Update with the actual collection name for brands
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategory',
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ['$category', 0] }, // Assuming brandInfo is an array with one element
          subCategory: { $arrayElemAt: ['$subCategory', 0] }, // Assuming brandInfo is an array with one element
        },
      },
      {
        $lookup: {
          from: 'brands', // Update with the actual collection name for brands
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $addFields: {
          brand: { $arrayElemAt: ['$brand', 0] }, // Assuming brandInfo is an array with one element
        },
      },
      {
        $match: {
          ...(Boolean(query.category) && {
            'category.slug': query.category,
          }),
          ...(Boolean(query.subCategory) && {
            'subCategory.slug': subCategory.slug,
          }),
          ...(Boolean(query.brand) && {
            'brand.slug': query.brand,
          }),
          ...(query.isFeatured && {
            isFeatured: Boolean(query.isFeatured),
          }),

          ...(query.gender && {
            gender: { $in: query.gender.split('_') },
          }),
          ...(query.sizes && {
            sizes: { $in: query.sizes.split('_') },
          }),

          ...(query.colors && {
            colors: { $in: query.colors.split('_') },
          }),
          ...(query.prices && {
            priceSale: {
              $gt: minPrice,
              $lt: maxPrice,
            },
          }),
          status: { $ne: 'disabled' },
        },
      },
      {
        $project: {
          image: { url: '$image.url' },
          name: 1,
          slug: 1,
          colors: 1,
          sizes: 1,
          discount: 1,
          likes: 1,
          rating: { $avg: '$reviews.rating' }, // Assuming rating is the average of reviews' ratings
          priceSale: 1,
          price: 1,
        },
      },
      {
        $sort: {
          ...((query.date && { createdAt: Number(query.date) }) ||
            (query.price && {
              priceSale: Number(query.price),
            }) ||
            (query.name && { name: Number(query.name) }) ||
            (query.top && { averageRating: Number(query.top) }) || {
              averageRating: -1,
            }),
        },
      },
      {
        $skip: Number(skip * parseInt(query.page ? query.page[0] - 1 : 0)),
      },
      {
        $limit: Number(skip),
      },
    ]);

    res.status(201).json({
      success: true,
      data: products,
      total: totalProducts,
      count: Math.ceil(totalProducts / skip),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getFilters = async (req, res) => {
  try {
    const totalProducts = await Product.find({
      status: { $ne: 'disabled' },
    }).select(['colors', 'sizes', 'gender', 'price']);
    const brands = await Brand.find({
      status: { $ne: 'disabled' },
    }).select(['name', 'slug']);
    const total = totalProducts.map((item) => item.gender);
    const totalGender = total.filter((item) => item !== '');
    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }
    const mappedColors = totalProducts?.map((v) => v.colors);
    const mappedSizes = totalProducts?.map((v) => v.sizes);
    const mappedPrices = totalProducts?.map((v) => v.price);
    const min = mappedPrices[0] ? Math.min(...mappedPrices) : 0;
    const max = mappedPrices[0] ? Math.max(...mappedPrices) : 100000;
    const response = {
      colors: _.union(...mappedColors),
      sizes: _.union(...mappedSizes),
      prices: [min, max],
      genders: totalGender.filter(onlyUnique),
      brands: brands,
    };
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
async function GetAllProductsForAdmin(request, response) {
  try {
    const { searchParams } = new URL(request.url);
    const pageQuery = searchParams.get('page');
    const limitQuery = searchParams.get('limit');
    const searchQuery = searchParams.get('search');
    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;

    // Calculate skip correctly
    const skip = limit * (page - 1);

    const totalProducts = await Product.countDocuments({
      name: { $regex: searchQuery || '', $options: 'i' },
    });

    const products = await Product.aggregate([
      {
        $match: {
          name: { $regex: searchQuery || '', $options: 'i' },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
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
            name: 1, // Include the fields you need from the category
          },
          reviews: 1,
          averageRating: 1,
        },
      },
    ]);

    response.status(200).json({
      success: true,
      data: products,
      total: totalProducts,
      count: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
}
async function createProduct(req, res) {
  try {
    const { images, ...body } = req.body;
    const blurDataUrl = await blurDataUrl(images[0].url);
    const data = await Product.create({
      ...body,
      cover: images[0].url,
      blurDataUrl: blurDataUrl,
      likes: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product Created',
      data: data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function getOneProductBySlug(req, res) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    const category = await Category.findById(product.category).select('name');
    const brand = await Brand.findById(product.brand).select('name');

    if (!product) {
      notFound();
    }

    const getProductRatingAndReviews = () => {
      return Product.aggregate([
        {
          $match: { slug: req.params.slug },
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'product',
            as: 'reviews',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            rating: { $avg: '$reviews.rating' },
            totalReviews: { $size: '$reviews' },
          },
        },
      ]);
    };

    const reviewReport = await getProductRatingAndReviews();
    return res.status(201).json({
      success: true,
      data: JSON.parse(JSON.stringify(product)),
      totalRating: JSON.parse(JSON.stringify(reviewReport[0]?.rating)),
      totalReviews: JSON.parse(JSON.stringify(reviewReport[0]?.totalReviews)),
      brand: JSON.parse(JSON.stringify(brand)),
      category: JSON.parse(JSON.stringify(category)),
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
const updateProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { images, ...body } = req.body;
    const coverUrl = images[0].url;
    const blurDataUrl = await blurDataUrl(coverUrl);

    const updated = await Product.findOneAndUpdate(
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
      message: 'Product Updated',
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
async function deletedProductBySlug(req, res) {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug: slug });
    const length = product?.images?.length || 0;
    for (let i = 0; i < length; i++) {
      await multiFilesDelete(product?.images[i]);
    }

    const deleteProduct = await Product.deleteOne({ slug: req.params.slug });
    if (!deleteProduct) {
      return res.status(400).json({
        success: false,
        message:
          'Product deletion failed. Please check if the product exists or try again later.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Product Deleted ',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

const getFiltersByCategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;

    let categoryQuery = { slug: category };
    if (subcategory) {
      categoryQuery = { slug: subcategory, parent: category };
    }

    const categoryData = await Category.findOne(categoryQuery);
    if (!categoryData) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }
    const totalProducts = await Product.find({
      status: { $ne: 'disabled' },
      category: categoryData._id,
    }).select(['colors', 'sizes', 'gender']);
    const brands = await Brands.find({
      status: { $ne: 'disabled' },
    }).select(['name', 'slug']);

    const total = totalProducts.map((item) => item.gender);
    const totalGender = total.filter((item) => item !== '');

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
const getAllProductSlug = async (req, res) => {
  try {
    const products = await Product.find().select('slug');

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = {
  getProducts,
  getFilters,
  GetAllProductsForAdmin,
  createProduct,
  getOneProductBySlug,
  updateProductBySlug,
  deletedProductBySlug,
  getFiltersByCategory,
  getAllProductSlug,
};
