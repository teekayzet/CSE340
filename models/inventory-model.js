const pool = require("../database/");

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getInventoryByClassificationId(classificationId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classificationId]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}

async function getVehicleById(vehicleId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE inv_id = $1`,
      [vehicleId]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error: " + error);
  }
}

async function addClassification(classification_name) {
  try {
    const result = await pool.query(
      `INSERT INTO public.classification (classification_name) 
       VALUES ($1) RETURNING classification_id`,
      [classification_name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error: " + error);
    return null;
  }
}

async function addInventory(inventory) {
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
  } = inventory;

  try {
    const result = await pool.query(
      `INSERT INTO public.inventory 
       (inv_make, inv_model, inv_year, classification_id, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id`,
      [
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
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("addInventory error: " + error);
    return null;
  }
}

// Get inventory by ID
async function getInventoryById(id) {
  try {
    const result = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting inventory by ID:', error);
    throw error;
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
      const sql = 'DELETE FROM inventory WHERE inv_id = $1';
      const data = await pool.query(sql, [inv_id]);
      return data;
  } catch (error) {
      throw new Error("Delete Inventory Error");
  }
}

module.exports = {
  getInventoryById,
  deleteInventoryItem,
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
  getInventoryById // Export the new function
};
