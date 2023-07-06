const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
