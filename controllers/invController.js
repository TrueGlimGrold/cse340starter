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

// * Personal assignment
/* ***************************
 *  Build inventory by favorite view
 * ************************** */
invCont.buildByFavorite = async function (req, res, next) {
  try {
    // Add logic here to fetch favorite inventory items for the current user
    // For now, let's assume you have a function to get favorites from the model
    const favorites = await invModel.getFavoritesByUserId(req.user.id);
    
    // Render the view with the favorite items
    let nav = await utilities.getNav();
    res.render("./inventory/favorites", {
      title: "Your Favorite Vehicles",
      nav,
      favorites
    });
  } catch (error) {
    console.error("Error building favorites view: " + error);
    next(error);
  }
};

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
      const classificationSelect = await utilities.buildClassificationList()
      res.render("/inventory/management", {
        title: "Management",
        nav,
        Message
      });
  } catch (err) {
      // Handle error if inventory item addition fails
      next(err);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory veiw
 * ************************** */
const editInventory = async (req, res, next) => {
  try {
      // Assuming successful addition, render success message
      const inv_id = parseInt(req.params.inventory_id)
      let nav = await utilities.getNav();

      // Call the model function to get inventory item data
      const inventoryItem = await invModel.getInventoryById(inv_id);

      const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)

      // Create the "name" variable
      const name = `${inventoryItem.Make} ${inventoryItem.Model}`;

      res.render("/inventory/edit-inventory", {
        title: "Edit " + name,
        nav,
        classificationSelect: classificationSelect,
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
  } catch (err) {
      // Handle error if inventory item addition fails
      next(err);
  }
};


invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
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
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

// Build delete confirmation view
invCont.buildDeleteConfirmation = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id } = req.body;

  // Get inventory item data for the confirmation view
  const inventoryItem = await invModel.getInventoryById(inv_id);
  const itemName = `${inventoryItem.inv_make} ${inventoryItem.inv_model}`;

  res.render("inventory/delete-confirmation", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make: inventoryItem.inv_make,
    inv_model: inventoryItem.inv_model,
    inv_year: inventoryItem.inv_year,
    inv_description: inventoryItem.inv_description,
    inv_image: inventoryItem.inv_image,
    inv_thumbnail: inventoryItem.inv_thumbnail,
    inv_price: inventoryItem.inv_price,
    inv_miles: inventoryItem.inv_miles,
    inv_color: inventoryItem.inv_color,
    classification_id: inventoryItem.classification_id
  });
};

// Delete inventory item
invCont.deleteInventoryItem = async function (req, res, next) {
  const { inv_id, inv_make, inv_model, classification_id } = req.body;

  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash("notice", "The item was successfully deleted.");
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      classification_id
    });
  }
};

module.exports = {
  invCont,
  addClassification,
  addInventory,
  editInventory
};