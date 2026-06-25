const mongoose = require("mongoose");
const {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  TRANSACTION_NAME,
} = require("../utils/constants");

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Please add a user"],
    },
    transactionType: {
      type: String,
      required: [true, "Please add a transaction type"],
      enum: [TRANSACTION_TYPE.CREDIT, TRANSACTION_TYPE.DEBIT],
    },
    transactionAmount: {
      type: String,
      required: true,
    },
    transactionStatus: {
      type: String,
      required: true,
      default: TRANSACTION_STATUS.PENDING,
      enum: [
        TRANSACTION_STATUS.PENDING,
        TRANSACTION_STATUS.CANCELED,
        TRANSACTION_STATUS.IN_PROGRESS,
        TRANSACTION_STATUS.COMPLETED,
      ],
    },
    receiverName: {
      type: String,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    transactionName: {
      type: String,
      required: true,
      default: TRANSACTION_NAME.DEPOSIT,
      enum: [
        TRANSACTION_NAME.DEPOSIT,
        TRANSACTION_NAME.TRANSFER,
        TRANSACTION_NAME.WITHDRAWAL,
      ],
    },
    accountBalance: {
      type: String,
      required: false,
      default: "0.00",
    },
    transactionDate: {
      type: String,
      required: false,
      default: Date.now,
    },
    accountNumber: {
      type: String,
      required: false,
    },
    routineNumber: {
      type: String,
      required: false,
    },
    remarks: {
      type: String,
      required: false,
    },
    accountMode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
