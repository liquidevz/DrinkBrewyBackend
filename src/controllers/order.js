const Notifications = require('src/models/Notification');
const Products = require('src/models/Product');
const Orders = require('src/models/Order');
const Coupons = require('src/models/CouponCode');
const User = require('src/models/User');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

function isExpired(expirationDate) {
  const currentDateTime = new Date();
  return currentDateTime >= new Date(expirationDate);
}

function readHTMLTemplate() {
  const htmlFilePath = path.join(
    process.cwd(),
    'src/email-templates',
    'order.html'
  );
  return fs.readFileSync(htmlFilePath, 'utf8');
}

const createOrder = async (req, res) => {
  try {
    const { items, user, paymentMethod, paymentId, couponCode, totalItems } =
      await req.body;
    const shipping = parseInt(process.env.SHIPPING_FEE);

    if (!items || !items.length) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide item(s)' });
    }

    const products = await Products.find({
      _id: { $in: items.map((item) => item.pid) },
    });

    const updatedItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.pid);
      const price = product ? product.priceSale : 0;
      const total = price * item.quantity;

      Products.findOneAndUpdate(
        { _id: item.pid, available: { $gte: 0 } },
        { $inc: { available: -item.quantity, sold: item.quantity } },
        { new: true, runValidators: true }
      ).exec();

      return {
        ...item,
        total,
        imageUrl: product.images.length > 0 ? product.images[0].url : '',
      };
    });

    const grandTotal = updatedItems.reduce((acc, item) => acc + item.total, 0);
    let discount = 0;

    if (couponCode) {
      const couponData = await Coupons.findOne({ code: couponCode });

      const expired = isExpired(couponData.expire);
      if (expired) {
        return res
          .status(400)
          .json({ success: false, message: 'Coupon code is expired' });
      }

      if (couponData && couponData.type === 'percent') {
        const percentLess = couponData.discount;
        discount = (percentLess / 100) * grandTotal;
      } else if (couponData) {
        discount = couponData.discount;
      }
    }

    let discountedTotal = grandTotal - discount;
    discountedTotal = discountedTotal || 0;

    const existingUser = await User.findOne({ email: user.email });

    const orderCreated = await Orders.create({
      paymentMethod,
      paymentId,
      discount,
      total: discountedTotal + shipping,
      subTotal: grandTotal,
      shipping,
      items: updatedItems,
      user: existingUser ? { ...user, _id: existingUser._id } : user,
      totalItems,
      status: 'pending',
    });

    await Notifications.create({
      opened: false,
      title: `${user.firstName} ${user.lastName} placed an order from ${user.city}.`,
      paymentMethod,
      orderId: orderCreated._id,
      city: user.city,
      cover: user?.cover?.url || '',
    });

    let htmlContent = readHTMLTemplate();

    htmlContent = htmlContent.replace(
      /{{recipientName}}/g,
      `${user.firstName} ${user.lastName}`
    );

    let itemsHtml = '';
    updatedItems.forEach((item) => {
      itemsHtml += `
        <tr>
          <td style="border-radius: 8px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 62px; height: 62px; object-fit: cover; border-radius: 8px;">
          </td>
          <td style="border-bottom: 1px solid #e4e4e4; padding: 10px;">${item.name}</td>         
          <td style="border-bottom: 1px solid #e4e4e4; padding: 10px">${item.sku}</td>
          <td style="border-bottom: 1px solid #e4e4e4; padding: 10px">${item.quantity}</td>
          <td style="border-bottom: 1px solid #e4e4e4; padding: 10px">${item.priceSale}</td>
        </tr>
      `;
    });

    htmlContent = htmlContent.replace(/{{items}}/g, itemsHtml);
    htmlContent = htmlContent.replace(/{{grandTotal}}/g, orderCreated.subTotal);
    htmlContent = htmlContent.replace(/{{Shipping}}/g, orderCreated.shipping);
    htmlContent = htmlContent.replace(/{{subTotal}}/g, orderCreated.total);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.RECEIVING_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.RECEIVING_EMAIL,
      to: user.email,
      subject: 'Your Order Confirmation',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: 'Order Placed',
      orderId: orderCreated._id,
      data: items.name,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const orderGet = await Orders.findById(id); // Remove curly braces around _id: id

    if (!orderGet) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      data: orderGet,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const getOrderforAdmin = async (request, { query }) => {
  try {
    const { searchParams } = new URL(request.url);
    const pageQuery = searchParams.get('page');
    const limitQuery = searchParams.get('limit');
    const searchQuery = searchParams.get('search');
    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;
    var newQuery = { ...query };
    delete newQuery.page;
    const skip = limit * (page - 1);

    const totalOrders = await Orders.find({
      $or: [
        { 'user.firstName': { $regex: searchQuery, $options: 'i' } },
        { 'user.lastName': { $regex: searchQuery, $options: 'i' } },
      ],
    });

    const orders = await Orders.find(
      {
        $or: [
          { 'user.firstName': { $regex: searchQuery, $options: 'i' } },
          { 'user.lastName': { $regex: searchQuery, $options: 'i' } },
        ],
      },
      null,
      {
        limit: limit,
        skip: skip,
      }
    ).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: orders,
      total: totalOrders,
      count: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getOneOrderForAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    await Notifications.findOneAndUpdate(
      { orderId: id },
      {
        opened: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const orderGet = await Orders.findById({ _id: id });
    if (!orderGet) {
      return res.status(404).json({
        success: false,
        message: 'Order Not Found',
      });
    }

    return res.status(200).json({
      success: true,
      data: orderGet,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const updateOrderForAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await req.body;
    const order = await Orders.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order Not Found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Order Updated',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const deleteOrderForAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find the order to be deleted
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order Not Found',
      });
    }

    // Delete the order from the Orders collection
    await Orders.findByIdAndDelete(orderId);

    // Remove the order ID from the user's order array
    await User.findOneAndUpdate(
      { _id: order.user },
      { $pull: { orders: orderId } }
    );

    // Delete notifications related to the order
    await Notifications.deleteMany({ orderId });

    return res.status(200).json({
      success: true,
      message: 'Order Deleted',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrderforAdmin,
  getOneOrderForAdmin,
  updateOrderForAdmin,
  deleteOrderForAdmin,
};
