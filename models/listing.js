const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    image: {
      filename: {
        type: String,
        default: "listingimage",
      },
      url: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      },
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    category: {
    type: String,
    enum: [
        "Beach",
        "Mountains",
        "Camping",
        "Pools",
        "City",
        "Tropical",
        "Farm",
        "Castle",
        "Arctic",
        "Lake"
    ],
    default: "City",
},

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Listing", listingSchema);