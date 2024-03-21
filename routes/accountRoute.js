const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index.js");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

// Login route
router.get("/login", async (req, res) => {
    let nav;
    try {
        nav = await utilities.getNav();
    } catch (error) {
        console.error('Failed to fetch nav:', error);
        nav = []; // Default value if nav fetching fails
    }

    res.render("account/login.ejs", { title: "Login", nav });
});

// Registration route
router.get("/register", async (req, res) => {
    let nav;
    try {
        nav = await utilities.getNav();
    } catch (error) {
        console.error('Failed to fetch nav:', error);
        nav = []; // Default value if nav fetching fails
    }

    res.render("account/register", { title: "Register", nav });
});

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;