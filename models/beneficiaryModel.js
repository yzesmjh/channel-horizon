const mongoose = require("mongoose");

const beneficiarySchema = mongoose.Schema(
  {
    accountName: {
      type: String,
      required: [true, "Account name is required"],
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      unique: true,
    },
    routineNumber: {
      type: String,
      required: [true, "Routine number is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);

module.exports = Beneficiary;
