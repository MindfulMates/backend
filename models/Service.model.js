const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    place: {
      type: String,
      required: [true, "Place is required."],
    },
    date: {
      type: Date,
      required: [true, "Date is required."],
    },
    category: {
      type: String,
      enum: ["Yoga", "Meditation", "Massage", "SoundHealing", "Other"]
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    review: [{ type: Schema.Types.ObjectId, ref: 'Review' }] 
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Service = model("Service", serviceSchema);

module.exports = Service;