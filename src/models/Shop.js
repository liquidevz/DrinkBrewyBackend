const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Shop name is required.'],
    },
    description: {
      type: String,
    },
    logo: {
      url: {
        type: String,
      },
      _id: {
        type: String,
      },
      blurDataURL: {
        type: String,
      },
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive', 'disabled'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create a default shop if none exists
const createDefaultShop = async () => {
  try {
    const Shop = mongoose.models.Shop || mongoose.model('Shop', shopSchema);
    const count = await Shop.countDocuments();
    
    if (count === 0) {
      await Shop.create({
        name: 'Default Shop',
        description: 'This is a default shop created automatically by the system',
        status: 'active'
      });
      console.log('Default shop created successfully');
    }
  } catch (error) {
    console.error('Error creating default shop:', error);
  }
};

// Call this function when the model is first loaded
if (mongoose.connection.readyState === 1) {
  createDefaultShop();
} else {
  mongoose.connection.once('connected', createDefaultShop);
}

const Shop = mongoose.models.Shop || mongoose.model('Shop', shopSchema);

module.exports = Shop; 