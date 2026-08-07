const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlist");
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, wishlistController.showWishlist);

router.post("/:id", isLoggedIn, wishlistController.addToWishlist);

router.delete("/:id", isLoggedIn, wishlistController.removeFromWishlist);

module.exports = router;