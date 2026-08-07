const wishlistRouter = require("./routes/wishlist");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routes/users");
const reviewRouter = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");
const { listingSchema } = require("./schema");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const listingRouter = require("./routes/listings");

const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Database Connection
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middlewares

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Home Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Validate listing data
const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {

        let errMsg = error.details.map(el => el.message).join(",");

        throw new ExpressError(400, errMsg);

    }

    next();
};

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    // Logged-in user available in all EJS views
    res.locals.currUser = req.user;

     // Search value available in navbar
    res.locals.search = req.query.search || "";

    next();
});

// Listing Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/wishlist", wishlistRouter);

// Server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;

    res.status(statusCode).render("error", {
        err: {
            statusCode,
            message,
        },
    });
});