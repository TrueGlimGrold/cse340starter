const utilities = require("../utilities/")
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    // errors: null,
  })
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account", {
    title: "Account",
    nav,
    // errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  console.log(req.body); // Add this line to check the contents of req.body
  const { firstName, lastName, email, password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav
    })
  }

  const regResult = await accountModel.registerAccount(
    firstName,
    lastName,
    email,
    hashedPassword
  )

  console.log(regResult)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${firstName}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ****************************************
 *  Process account request
 * ************************************ */
async function account(req, res) {
  let nav = await utilities.getNav()
  
  
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Account",
    nav,
    errors: null,
   })
  return
  }
 }

 async function renderUpdateAccount(req, res) {
  const accountId = req.params.id;
  const accountData = await accountModel.getAccountById(accountId);
  res.render("account/update", { title: "Update Account", accountId, firstName: accountData.account_firstname, lastName: accountData.account_lastname, email: accountData.account_email });
}

async function updateAccount(req, res) {
  const accountId = req.params.id;
  const { firstName, lastName, email } = req.body;
  await accountModel.updateAccount(accountId, firstName, lastName, email);
  req.flash("notice", "Account updated successfully.");
  res.redirect("/account/management");
}

async function updatePassword(req, res) {
  const accountId = req.params.id;
  const { newPassword } = req.body;
  await accountModel.updatePassword(accountId, newPassword);
  req.flash("notice", "Password updated successfully.");
  res.redirect("/account/management");
}

async function logout(req, res) {
  res.clearCookie("jwt"); // Clear the JWT token cookie
  res.redirect("/"); // Redirect to the home view
}
 

module.exports = {
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  account, 
  buildAccount, 
  renderUpdateAccount, 
  updateAccount, 
  updatePassword, 
  logout}