const Listing = require("../models/listing");

// Show all listings
module.exports.index = async (req, res) => {
    const { search, category, maxPrice, sort } = req.query;

    let filter = {};

    // Search
    if (search && search.trim() !== "") {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
        ];
    }

    // Category
    if (category) {
        filter.category = category;
    }

    // Price
    if (maxPrice) {
        filter.price = { $lte: Number(maxPrice) };
    }

    let query = Listing.find(filter);

    // Sorting
    if (sort === "low") {
        query = query.sort({ price: 1 });
    } else if (sort === "high") {
        query = query.sort({ price: -1 });
    } else if (sort === "newest") {
        query = query.sort({ createdAt: -1 });
    }

    const allListings = await query;

    res.render("listings/index", {
        allListings,
        search,
        category,
        maxPrice,
        sort,
    });
};

// Render new form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// Show one listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist.");
        return res.redirect("/listings");
    }

    let avgRating = 0;

    if (listing.reviews.length > 0) {
        const total = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
        avgRating = (total / listing.reviews.length).toFixed(1);
    }

    res.render("listings/show", {
        listing,
        avgRating,
    });
};

// Create listing
module.exports.createListing = async (req, res) => {

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await newListing.save();

    req.flash("success", "New Listing Created Successfully!");

    res.redirect(`/listings/${newListing._id}`);
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

// Update listing
module.exports.updateListing = async (req, res) => {

    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };

        await listing.save();
    }

    req.flash("success", "Listing Updated Successfully!");

    res.redirect(`/listings/${id}`);
};

// Delete listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted Successfully!");

  res.redirect("/listings");
};