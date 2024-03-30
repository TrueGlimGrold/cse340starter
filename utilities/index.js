const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
    list += '<li><a href="/inv/favorites" title="Favorites">Favorites</a></li>'
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

// * Added week 3 
Util.buildInventoryGrid = async function(data){
  let grid

  if(data.length > 0){
    grid = '<ul id="item-display">'
    grid += '<p>This vehicle has passed inspection by an ASE-certified technitian.</p>'
    grid += '<img src="' + vehicle.inv_image +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motors" />'
    grid += '<h1>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>'

    grid += '<div class="item-listing">' 
    grid += '<p>' + vehicle.inv_miles + '</p>'
    grid += '<h1>No-Haggle Price</h1>'
    grid += '<h1>' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '$</h1>'
    grid += '</div>'

    grid += '<div>'
    grid += '<p>Milage: ' + vehicle.inv_miles + '</p>'
    grid += '<p>MPG: 29/37 (City/Hwy) </p>'
    grid += '<p>Ext. Color: Unknown </p>'
    grid += '<p>Int. Color:' + vehicle.inv_color + '</p>'
    grid += '<p>Fuel Type: Gasoline</p>'
    grid += '<p>Drivetrain: Front Wheel Drive </p>'
    grid += '<p>Transmission: Xronic CVT</p>'
    grid += '<p>Stock #: 8DLCBQ </p>'
    grid += '<p>VIN: 3N1AB7AP3KY62032 </p>'
    grid += '<li>MPG</li>'
    grid += '<h2>The principlal prior use of this vehicle was as a rental vehicle.</h2>'
    grid += '</div>'

    grid += '<div>'
    grid += '<button>START MY PURCHASE</button>'
    grid += '<button>CONTACT US</button>'
    grid += '<button>SCHEDULE TEST DRIVE</button>'
    grid += '<button>APPLY FOR FINANCING</button>'
    grid += '<h3>Call Us</h3>'
    grid += '<h3>801-396-7886</h3>'
    grid += '<h3>Visit Us</h3>'
    grid += '</div>'
    
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  // Get the JWT token from the request header
  const token = req.headers.authorization.split(' ')[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.redirect('/account/login?error=Unauthorized');
    }

    // Check if the account type is valid
    if (decodedToken.accountType !== 'Employee' && decodedToken.accountType !== 'Admin') {
      return res.redirect('/account/login?error=Unauthorized');
    }

    next(); // Move to the next middleware
  });
}

// * personal project
/* ***************************
 * Get favorites by user id
 ************************** */
Util.getFavoritesByUserId = async function (user_id) {
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

module.exports = Util