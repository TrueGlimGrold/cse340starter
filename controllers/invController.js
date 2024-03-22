const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  })
}

// * Week 3 assignment
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id; 
  const data = await invModel.getInventoryById(inv_id);
  console.log("The data is: " + data)

  if (data && data.length > 0) {
    const grid = await utilities.buildInventoryGrid(data, inv_id);
    let nav = await utilities.getNav();
    const classMake = data[0].inv_make; 
    res.render("./inventory/item", {
      title: classMake,
      nav,
      grid
    });
  } else {
    res.render("./inventory/item", {
      title: "Vehicle not found",
      nav: "",
      grid: "<p>Sorry, the requested vehicle could not be found.</p>"
    });
  }
};

/* ****************************************
*  Deliver classification view
* *************************************** */
async function addClassification(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/add-classification", {
    title: "Add-Classification",
    nav,
    // errors: null,
  })
}

const addInventory = async (req, res, next) => {
  try {
      // Assuming successful addition, render success message
      const Message = "Inventory item added successfully!";
      let nav = await utilities.getNav();
      res.render("your-management-view", {
        title: "Management",
        nav,
        Message
      });
  } catch (err) {
      // Handle error if inventory item addition fails
      next(err);
  }
};

module.exports = {
  invCont,
  addClassification,
  addInventory
};