const express = require("express");
const Transaction = require("../models/transactionModel");
const asynchandler = require("express-async-handler");
const { respondsSender } = require("../middleWare/responseHandler");
const { ResponseCode } = require("../utils/responseCode");
const Account = require("../models/AccountBalanceModel");
const User = require("../models/userModel");

// CREATE

//function to create account
const accountCreator = async ({ userId }) => {
  try {
    const newAccount = await Account.create({
      userId,
      accounts: [
        {
          accountType: "checking",
          balance: "0.00",
          accountNumber: Math.floor(Math.random() * 1_000_000_000 + 1),
        },
        {
          accountType: "savings",
          balance: "0.00",
          accountNumber: Math.floor(Math.random() * 1_000_000_000 + 1),
        },
      ],
    });

    return newAccount;
  } catch (error) {
    console.log("Error creating account: ", error);
    throw new Error("Account creation failed");
  }
};

// Create a transaction
const createTransaction = asynchandler(async (req, res) => {
  const {
    userId,
    transactionName,
    transactionStatus,
    transactionDate = null,
    receiverName,
    bankName,
    transactionAmount,
    transactionType,
    accountType,
    accountNumber,
    routineNumber,
    remarks,
    accountMode,
  } = req.body;

  if (
    !userId ||
    !transactionName ||
    !transactionStatus ||
    !receiverName ||
    !bankName ||
    !transactionAmount ||
    !transactionType ||
    !accountType
  ) {
    const responseMessage =
      "User ID, Transaction Name, Transaction Status, Transaction Date, Receiver Name, Bank Name, Transaction Amount, or Transaction Type not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    // Find or create user account
    let userAccount = await Account.findOne({ userId });

    if (!userAccount) {
      userAccount = await accountCreator({ userId });
    }

    // Find the correct account based on the accountType
    const account = userAccount.accounts.find(
      (acc) => acc.accountType === accountType
    );

    if (!account) {
      const responseMessage = `No account found for type: ${accountType}`;
      return respondsSender(
        null,
        responseMessage,
        ResponseCode.badRequest,
        res
      );
    }

    // Perform arithmetic operations to debit or credit based on the transaction type
    const newBalance =
      transactionType === "Debit"
        ? Number(account.balance) - Number(transactionAmount)
        : Number(account.balance) + Number(transactionAmount);

    // Update the account balance
    account.balance = newBalance.toFixed(2);

    // Save the updated account document
    await userAccount.save();

    // Create the transaction
    const transaction = await Transaction.create({
      userId,
      transactionName,
      transactionStatus,
      transactionDate,
      receiverName,
      bankName,
      transactionAmount,
      transactionType,
      accountBalance: account.balance,
    });

    // Return success response
    const responseMessage = "Transaction created";
    return respondsSender(
      transaction,
      responseMessage,
      ResponseCode.successful,
      res
    );
  } catch (error) {
    const responseMessage = "Error: " + error.message;
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }
});

// READ
// Get all transactions
const getAllTransactions = asynchandler(async (req, res) => {
  // Collect data from body
  const { userId } = req.query;
  // Validate data
  if (!userId) {
    // Send error message
    const responseMessage = "User ID not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    // Check if transactions exist
    if (!transactions) {
      // Send error message if no transactions found
      const responseMessage = "No Transaction found";
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }

    // Return success response with transactions
    const responseMessage = "Transactions retrieved successfully";
    return respondsSender(
      transactions,
      responseMessage,
      ResponseCode.successful,
      res
    );
  } catch (error) {
    // Handle errors
    const responseMessage = "Error: " + error.message;
    return respondsSender(
      null,
      responseMessage,
      ResponseCode.internalServerError,
      res
    );
  }
});

// Get a single transaction
const getSingleTransaction = asynchandler(async (req, res) => {
  // Collect data from body
  const { userId, transactionId } = req.query;
  // Validate data
  if (!userId || !transactionId) {
    // Send error message
    const responseMessage =
      "User ID or Transaction Id not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    const transaction = await Transaction.findOne({
      $and: [{ userId }, { _id: transactionId }],
    });

    if (!transaction) {
      const responseMessage = `No transaction found with id: ${transactionId} for user: ${userId}`;
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }
    const responseMessage = "Transaction retrieved successfully";
    return respondsSender(
      transaction,
      responseMessage,
      ResponseCode.successful,
      res
    );
  } catch (error) {
    const responseMessage = "Error: " + error.message;
    return respondsSender(
      null,
      responseMessage,
      ResponseCode.internalServerError,
      res
    );
  }
});

// UPDATE
// Update a single field
const updateSingleTransaction = asynchandler(async (req, res) => {
  // Collect data from URL parameters
  const {
    transactionId,
    transactionName,
    transactionStatus,
    transactionDate,
    receiverName,
    bankName,
    transactionAmount,
    transactionType,
  } = req.body;

  // Validate data
  if (
    !transactionId ||
    !transactionName ||
    !transactionStatus ||
    !transactionDate ||
    !receiverName ||
    !bankName ||
    !transactionAmount ||
    !transactionType
  ) {
    // Send error message
    const responseMessage =
      "transaction ID, Transaction Name, Transaction Status, Transaction Date, Receiver Name, Bank Name, Transaction Amount, or Transaction Type not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    // Find and update the transaction
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId }, // Criteria to find the transaction
      {
        transactionName,
        transactionStatus,
        transactionDate,
        receiverName,
        bankName,
        transactionAmount,
        transactionType,
      }, // Fields to update
      { new: true } // Option to return the updated document
    );

    if (!updatedTransaction) {
      const responseMessage = `No transaction found with id: ${transactionId} for user: ${userId}`;
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }

    const responseMessage = "Transaction updated successfully";
    return respondsSender(
      updatedTransaction,
      responseMessage,
      ResponseCode.successful,
      res
    );
  } catch (error) {
    const responseMessage = "Error: " + error.message;
    return respondsSender(
      null,
      responseMessage,
      ResponseCode.internalServerError,
      res
    );
  }
});

// DELETE
// Delete a single transaction
const deleteTransaction = asynchandler(async (req, res) => {
  const { transactionId } = req.body;
  // Validate data
  if (!transactionId) {
    // Send error message
    const responseMessage = "Transaction Id not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
    });

    if (!transaction) {
      // If no transaction was found and deleted
      const responseMessage = `No transactions with id: ${transactionId}`;
      return respondsSender(
        null,
        responseMessage,
        ResponseCode.badRequest,
        res
      );
    }

    // If transaction was successfully deleted
    const responseMessage = `Transaction deleted successfully`;
    return respondsSender(
      transaction,
      responseMessage,
      ResponseCode.successful,
      res
    );
  } catch (error) {
    // If an error occurred during the deletion process
    const responseMessage = error.message;
    return respondsSender(null, responseMessage, ResponseCode.successful, res);
  }
});

// Delete all transactions
const deleteAllTransactions = asynchandler(async (req, res) => {
  // Collect data from body
  const { userId } = req.query;
  // Validate data
  if (!userId) {
    // Send error message
    const responseMessage = "User ID not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    // Delete all transactions associated with the user
    const result = await Transaction.deleteMany({ userId });

    // Check if any transactions were deleted
    if (result.deletedCount === 0) {
      // Send error message if no transactions were deleted
      const responseMessage = "No transactions found for the user";
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }

    // Return success response
    const responseMessage = "All transactions deleted successfully";
    return respondsSender(null, responseMessage, ResponseCode.successful, res);
  } catch (error) {
    // Handle errors
    const responseMessage = "Error: " + error.message;
    return respondsSender(
      null,
      responseMessage,
      ResponseCode.internalServerError,
      res
    );
  }
});

// Delete all transactions
const runScript = asynchandler(async (req, res) => {
  // Collect data from body

  try {
    // Run update
    const defaultTransactionPin = [
      { status: "success", pin: "1234" },
      { status: "failed", pin: "0000" },
      { status: "hold", pin: "0090" },
    ];

    // Update all users with the default transactionPin
    const result = await User.updateMany(
      {},
      { $set: { transactionPin: defaultTransactionPin } }
    );
    console.log(result);

    return respondsSender(null, responseMessage, ResponseCode.successful, res);
  } catch (error) {
    // Handle errors
    const responseMessage = "Error: " + error.message;
    return respondsSender(
      null,
      responseMessage,
      ResponseCode.internalServerError,
      res
    );
  }
});

const transfer = asynchandler(async (req, res) => {
  const { userId } = req.userId;
  return respondsSender(userId, "successful", ResponseCode.successful, res);
});
const wiretransfer = asynchandler(async (req, res) => {
  const { userId } = req.userId;
  return respondsSender(userId, "successful", ResponseCode.successful, res);
});

module.exports = {
  runScript,
  createTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateSingleTransaction,
  deleteTransaction,
  deleteAllTransactions,
  transfer,
  wiretransfer,
};
