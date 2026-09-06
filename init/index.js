require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDB();

    mongoose.connection.close();
}

const initDB = async () => {

    console.log("Deleting old data...");

    await Listing.deleteMany({});

    console.log("Adding new data...");

    await Listing.insertMany(initData.data);

    console.log("Data was initialized");
};

main().catch(console.log);