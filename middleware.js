const Listing = require("./models/listing");

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

// Check if logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing || !listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

const Review = require("./models/review");

module.exports.isReviewAuthor = async (req, res, next) => {

    const { reviewId, id } = req.params;

    const review = await Review.findById(reviewId);

    if (!review || !review.author || !review.author.equals(req.user._id)) {

        req.flash("error", "You don't have permission to do that!");

        return res.redirect(`/listings/${id}`);
    }

    next();
};