const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    review: {
      type: Number,
      required: [true, "Review is required."],
      min: 1,
      max: 5
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    friendly: {
      type: String,
      required: [true, "This field is required."],
    },
  },
  {
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
