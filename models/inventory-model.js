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

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  insertClassification
}