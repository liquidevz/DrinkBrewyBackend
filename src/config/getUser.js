const jwt = require('jsonwebtoken');
const Users = require('../models/User');

exports.getUser = async (token) => {
  if (!token) {
    return { error: 'You must be logged in.', status: 401 };
  }

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ _id });
    if (!user) {
      return { error: 'User not found.', status: 404 };
    }
    console.log(user, 'user');
    return user;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return { error: 'Internal server error.', status: 500 };
  }
};

exports.getAdmin = async (token) => {
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ _id });
    if (!user) {
      return { error: 'User not found.', status: 404 };
    }
    if (!user.role.includes('admin')) {
      return { error: 'Access denied.', status: 401 };
    }
    console.log(user, 'user');
    return user;
  } catch (error) {
    console.error('Error retrieving admin:', error);
    return { error: 'Internal server error.', status: 500 };
  }
};
