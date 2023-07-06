const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    service: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    review: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
