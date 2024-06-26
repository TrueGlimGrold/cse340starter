const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// * Added week 3 
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,  
      [inv_id]
    )
    console.log('Fetched data:', data.rows);
    return data.rows
  } catch (error) {
    console.error("getInventorybyid error " + error)
    throw error;
  }
}

/* ****************************************
*  Insert classification into the database
* *************************************** */
async function insertClassification(req, res, next) {
  try {
      const { classification } = req.body;
      await pool.query("INSERT INTO public.classification (classification_name) VALUES ($1)", [classification]);
      res.redirect('/');
  } catch (error) {
      console.error("Error inserting classification: " + error);
      res.status(500).send("Error inserting classification");
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "Insert public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

async function getFavoritesByUserId(user_id) {
  try {
    const data = await pool.query(
      `SELECT i.*
       FROM public.inventory AS i
       JOIN public.favorites AS f ON i.inv_id = f.inv_id
       WHERE f.user_id = $1`,
      [user_id]
    );
    return data.rows;
  } catch (error) {
    console.error("Error fetching favorites by user ID: " + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  insertClassification,
  updateInventory,
  deleteInventoryItem,
  getFavoritesByUserId
}