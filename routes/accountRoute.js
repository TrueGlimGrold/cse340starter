const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index.js");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

router.get("/update/:id", utilities.checkLogin, utilities.handleErrors(accountController.renderUpdateAccount));
router.post("/update/:id", utilities.checkLogin, regValidate.updateAccountRules(), regValidate.checkUpdateAccountData, utilities.handleErrors(accountController.updateAccount));
router.post("/updatePassword/:id", utilities.checkLogin, regValidate.updatePasswordRules(), regValidate.checkUpdatePasswordData, utilities.handleErrors(accountController.updatePassword));

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

// Account Route
router.get("/account", async (req, res) => {
    let nav;
    try {
        nav = await utilities.getNav();
    } catch (error) {
        console.error('Failed to fetch nav:', error);
        nav = []; // Default value if nav fetching fails
    }
    router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))
    res.render("account/account", { title: "Account", nav });
});

// router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    (req, res) => {
        console.log(req.body); // Log the request body
        utilities.handleErrors(accountController.registerAccount)(req, res);
    }
)


// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)

)

// Process the logout attempt
router.post("/logout", utilities.checkLogin, (req, res) => {
    res.clearCookie("jwt"); // Clear the JWT token cookie
    res.redirect("/"); // Redirect to the home view
});

module.exports = router;