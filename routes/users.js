const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/users");

// Signup Form
router.get("/signup", userController.renderSignupForm);

// Signup
router.post("/signup", wrapAsync(userController.signup));

// Login Form
router.get("/login", userController.renderLoginForm);

// Login
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);

// Logout
router.get("/logout", userController.logout);

module.exports = router;