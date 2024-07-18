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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  try {
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    const classificationSelect = await invModel.getClassifications(); // Fetch classifications directly from the model

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect.rows, // Pass the rows directly
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    });
  } catch (error) {
    console.error("Error building edit inventory view: ", error);
    next(error);
  }
};

/* ***************************
 *  Deliver Delete Inventory View
 * ************************** */
invController.getDeleteInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  try {
    const inventoryItem = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();
    const name = `${inventoryItem.inv_make} ${inventoryItem.inv_model}`;
    res.render('inventory/delete-confirm', {
      title: 'Delete ' + name,
      nav,
      errors: null,
      inv_id,
      make: inventoryItem.inv_make,
      model: inventoryItem.inv_model,
      year: inventoryItem.inv_year,
      price: inventoryItem.inv_price,
    });
  } catch (error) {
    console.error("Error delivering delete confirmation view: ", error);
    next(error);
  }
};

/* ***************************
 *  Handle Delete Inventory
 * ************************** */
invController.deleteInventoryItem = async (req, res, next) => {
  const inv_id = parseInt(req.body.inv_id);
  try {
    const result = await invModel.deleteInventoryItem(inv_id);
    if (result.rowCount > 0) {
      req.flash('success', 'Inventory item deleted successfully');
      res.redirect('/inv');
    } else {
      req.flash('error', 'Failed to delete inventory item');
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    console.error("Error deleting inventory item: ", error);
    req.flash('error', 'Failed to delete inventory item');
    res.redirect(`/inv/delete/${inv_id}`);
  }
};

module.exports = invController;
