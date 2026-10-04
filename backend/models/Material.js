const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    unit: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    filename: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);

