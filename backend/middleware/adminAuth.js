const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // Assuming this middleware runs after the standard auth middleware
    if (!req.user) {
      return res.status(401).json({ msg: 'No user found in request, authorization denied' });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (err) {
    next(err);
  }
};
