const multer = require("multer");
const { storage } = require("../cloudConfig");

const upload = multer({ storage });
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const Listing = require("../models/listing");
const { listingSchema } = require("../schema");

const listingController = require("../controllers/listings");

const { isLoggedIn, isOwner } = require("../middleware");

// Joi Validation
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// INDEX Route
router.get("/", wrapAsync(listingController.index));

// Search Route
router.get("/search", wrapAsync(async (req, res) => {

    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.redirect("/listings");
    }

    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    });

    res.render("listings/index", { allListings });

}));

// NEW Route
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

// CREATE Route
router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

router.get("/search", wrapAsync(async (req, res) => {

    const { q } = req.query;

    const listings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    });

    res.render("listings/index", { allListings: listings });

}));

// SHOW Route
router.get(
    "/:id",
    wrapAsync(listingController.showListing)
);

// EDIT Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

// UPDATE Route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
);

// DELETE Route
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

module.exports = router;