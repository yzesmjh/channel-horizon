const mongoose = require("mongoose");
const { ACCOUNTTYPE } = require("../utils/constants");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Please add a user"],
      unique: true
    },
    accounts: [
      {
        accountType: {
          type: String,
          required: [true, "Please specify the account type"],
          enum: [ACCOUNTTYPE.SAVING, ACCOUNTTYPE.CHECKING, ACCOUNTTYPE.OTHERS], // You can add more types if necessary
        },
        balance: {
          type: String,
          required: [true, "Please add a balance"],
          default: "0.00",
        
        },
        totalCredit: {
          type: String,
          required: [false, "Please add a balance"],
          default: "0.00",
        
        },
        totalDebit: {
          type: String,
          required: [false, "Please add a balance"],
          default: "0.00",
        
        },
        accountNumber: {
          type: String,
          required: [false, "account Number"],
          default: Math.floor((Math.random()*1_000_000_000)+1),
        }
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
