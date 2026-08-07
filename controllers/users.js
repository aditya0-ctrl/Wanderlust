const User = require("../models/user");

// Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

// Register User
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to WanderLust!");

            res.redirect("/listings");
        });

    } catch (e) {

        req.flash("error", e.message);

        res.redirect("/signup");
    }
};

// Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

// Login Success
module.exports.login = (req, res) => {

    req.flash("success", "Welcome Back!");

    res.redirect("/listings");
};

// Logout
module.exports.logout = (req, res, next) => {

    req.logout(function (err) {

        if (err) {
            return next(err);
        }

        req.flash("success", "Logged Out Successfully!");

        res.redirect("/listings");
    });
};