const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invController = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classificationId);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view: ", error);
    next(error);
  }
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invController.buildByVehicleId = async function (req, res, next) {
  const vehicleId = req.params.vehicleId;
  try {
    const vehicle = await invModel.getVehicleById(vehicleId);
    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
    const nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title,
      nav,
      vehicle,
    });
  } catch (error) {
    console.error("Error building vehicle detail view: ", error);
    next(error);
  }
};


/* ***************************
 *  Build Management View
 * ************************** */
invController.buildManagementView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications(); // Fetch classifications
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      classifications: classifications.rows, // Pass classifications to the view
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};
/* ***************************
 *  Render Add Classification View
 * ************************** */
invController.addClassificationView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      messages: req.flash(),
      classification_name: ''
    });
  } catch (error) {
    next(error);
  }
};

// Add Classification
invController.addClassification = async (req, res, next) => {
  const { classification_name } = req.body;
  try {
    const newClassification = await invModel.addClassification(classification_name);
    if (newClassification) {
      req.flash('info', 'Classification added successfully!');
      res.redirect('/inv');
    } else {
      req.flash('error', 'Failed to add classification.');
      res.redirect('/inv/add-classification');
    }
  } catch (error) {
    req.flash('error', 'An error occurred.');
    res.redirect('/inv/add-classification');
  }
};

/* Placeholder for add inventory view */
invController.addInventoryView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render('inventory/add-inventory', {
      title: 'Add New Inventory',
      nav,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

// Function to render the Add Inventory View
invController.addInventoryView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      title: 'Add New Inventory',
      nav,
      classifications,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

// Function to handle adding a new inventory item
invController.addInventory = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, classification_id, inv_image, inv_thumbnail } = req.body;
  try {
    const newInventoryItem = await invModel.addInventoryItem({
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_image,
      inv_thumbnail
    });

    if (newInventoryItem) {
      req.flash('success', 'Inventory item added successfully!');
      res.redirect('/inv');
    } else {
      req.flash('error', 'Failed to add inventory item.');
      res.redirect('/inv/add-inventory');
    }
  } catch (error) {
    req.flash('error', 'An error occurred.');
    res.redirect('/inv/add-inventory');
  }
};

/* ***************************
 * Render Add Inventory View
 * ************************** */
invController.addInventoryView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    res.render('inventory/add-inventory', {
      title: 'Add New Inventory',
      nav,
      classifications: classifications.rows,
      messages: req.flash(),
    });
  } catch (error) {
    next(error);
  }
};

// Add Inventory
invController.addInventory = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    classification_id,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_description
  } = req.body;

  try {
    const newInventory = await invModel.addInventory({
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_description
    });
    if (newInventory) {
      req.flash('info', 'Inventory item added successfully!');
      res.redirect('/inv');
    } else {
      req.flash('error', 'Failed to add inventory item.');
      res.redirect('/inv/add-inventory');
    }
  } catch (error) {
    req.flash('error', 'An error occurred.');
    res.redirect('/inv/add-inventory');
  }
};

/* ***************************
 *  Return Inventory by Selected Classifications As JSON
 * ************************** */
invController.getInventoryByClassifications = async (req, res, next) => {
  const classifications = req.query.classifications.split(',');
  try {
    const invData = await Promise.all(classifications.map(id => invModel.getInventoryByClassificationId(id)));
    const flattenedData = invData.flat(); // Flatten the array
    res.json(flattenedData);
  } catch (error) {
    next(error);
  }
};

module.exports = invController;