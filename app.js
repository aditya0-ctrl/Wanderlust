const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const Listing = require("./models/listing");

const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

// Enable PUT & DELETE
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Welcome to WanderLust");
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});

//index route
// Show all listings
app.get("/listings", async (req, res) => {

    // Get all listings
    const allListings = await Listing.find({});

    // Open index page
    res.render("listings/index", { allListings });
});

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// Save new listing
app.post("/listings", async (req, res) => {

    // Create listing object
    const newListing = new Listing(req.body.listing);

    // Save in database
    await newListing.save();

    // Go back to listings
    res.redirect("/listings");
});
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/show", { listing });
});

// Show edit form
app.get("/listings/:id/edit", async (req, res) => {

    // Get listing id
    const { id } = req.params;

    // Find listing
    const listing = await Listing.findById(id);

    // Open edit page
    res.render("listings/edit", { listing });
});

// Update listing
app.put("/listings/:id", async (req, res) => {

    // Get listing id
    const { id } = req.params;

    // Update listing
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Open updated listing
    res.redirect(`/listings/${id}`);
});

// Delete listing
app.delete("/listings/:id", async (req, res) => {

    // Get listing id
    const { id } = req.params;

    // Remove listing
    await Listing.findByIdAndDelete(id);

    // Go back to listings
    res.redirect("/listings");
});