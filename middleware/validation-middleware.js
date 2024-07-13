// middleware/validation-middleware.js

const validateClassificationName = (req, res, next) => {
    const { classification_name } = req.body;
    if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
      req.flash('error', 'Classification name cannot contain spaces or special characters.');
      return res.redirect('/inv/add-classification');
    }
    next();
  };
  
  module.exports = { validateClassificationName };
  