const invModel = require("../models/inventory-model")
const Util = {}

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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util