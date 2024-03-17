
const Products =require ('../models/Product');
const Users =require ('../models/User');
const { getUser } =require ('../config/getUser');
const  ObjectId =require ('mongodb');

const getWishlist=async(req,res)=> {
  try {
    const user = await getUser();
    const wishlist = user.wishlist || [];
    const products = await Products.aggregate([
      {
        $match: {
          _id: { $in: wishlist } // Match products with IDs present in the Pids array
        }
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
        $project: {
          _id: 1, // Include the product ID
          images: 1,
          name: 1,
          brand: 1,
          description: 1,
          slug: 1,
          colors: 1,
          sizes: 1,
          sku: 1,
          gender: 1,
          available: 1,
          priceSale: 1,
          price: 1,
          averageRating: 1
        }
      }
    ]);

    return res.status(200).json(
      {
        success: true,
        data: products
      }
    );
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

const createWishlist=async(req,res)=>{
  try {
    const user = await getUser();
    const uid = user._id.toString();
    const wishlist = user.wishlist || [];
    const { pid } = await req.body;

    const isAlready = wishlist.filter((id) => id.toString() === pid);

    if (!Boolean(isAlready.length)) {
      await Users.findByIdAndUpdate(
        uid,
        { $addToSet: { wishlist: pid } }, // Add productId to the wishlist if not already present
        { new: true }
      );

      await Products.findByIdAndUpdate(pid, {
        $inc: { likes: 1 }
      });

      const newWishlist = [...wishlist, new ObjectId(pid)];

      const products = await Products.aggregate([
        {
          $match: {
            _id: { $in: newWishlist } // Match products with IDs present in the productsId array
          }
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
          $project: {
            _id: 1, // Include the product ID
            images: 1,
            name: 1,
            brand: 1,
            description: 1,
            slug: 1,
            colors: 1,
            sizes: 1,
            sku: 1,
            gender: 1,
            available: 1,
            priceSale: 1,
            price: 1,
            averageRating: 1
          }
        }
      ]);

      return res.status(201).json(
        {
          success: true,
          data: products,
          type: 'pushed',
          message: 'Added to wishlist'
        }
      );
    }
    await Products.findByIdAndUpdate(pid, {
      $inc: { likes: -1 }
    });

    await Users.findByIdAndUpdate(uid, { $pull: { wishlist: pid } }, { new: true });

    const removedWishlist = wishlist.filter((id) => id.toString() !== pid);
    const products = await Products.aggregate([
      {
        $match: {
          _id: { $in: removedWishlist } // Match products with IDs present in the productsId array
        }
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
        $project: {
          _id: 1,
          images: 1,
          name: 1,
          brand: 1,
          description: 1,
          slug: 1,
          colors: 1,
          sizes: 1,
          sku: 1,
          gender: 1,
          available: 1,
          priceSale: 1,
          price: 1,
          averageRating: 1
        }
      }
    ]);
    return res.status(200).json(
      {
        success: true,
        type: 'pulled',
        message: 'Removed From Wishlist',
        data: products
      }
    );
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
module.exports={
    getWishlist,
    createWishlist
}