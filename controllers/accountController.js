const express = require("express");
const Transactions = require("../models/transactionModel");
const AccountBalance = require("../models/AccountBalanceModel");
const asynchandler = require("express-async-handler");
const { respondsSender } = require("../middleWare/responseHandler");
const { ResponseCode } = require("../utils/responseCode");
const User = require("../models/userModel");
const Account = require("../models/AccountBalanceModel");
const { ACCOUNTTYPE } = require("../utils/constants");

// CREATE
//function to create account
const accountCreator = async (userId) => {
  try {
    const newAccount = await AccountBalance.create({
      userId,
      accounts: [
        {
          accountType: ACCOUNTTYPE.CHECKING,
          balance: "0.00",
          accountNumber: Math.floor(Math.random() * 1_000_000_000 + 1),
        },
        {
          accountType: ACCOUNTTYPE.SAVING,
          balance: "0.00",
          accountNumber: Math.floor(Math.random() * 1_000_000_000 + 1),
        },
      ],
    });

    return newAccount;
  } catch (error) {
    throw new Error("Account creation failed");
  }
};
// Create a transaction
const createAccount = asynchandler(async (req, res) => {
  // Collect data from body
  const { userId } = req.body;

  // Validate data
  if (!userId) {
    const responseMessage = "User ID is required";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    // Check if the user already has an account
    const existingAccount = await AccountBalance.findOne({ userId });
    if (existingAccount) {
      const responseMessage = "User already has an account";
      return respondsSender(
        null,
        responseMessage,
        ResponseCode.dataDuplication,
        res
      );
    }

    // Create both a checking and a savings account

    const accountCreatorRequest = await accountCreator(userId);
    // Return success response
    const responseMessage = "Account with both checking and savings created";
    return respondsSender(
      accountCreatorRequest,
      responseMessage,
      ResponseCode.successful,
      res
    );
  } catch (error) {
    // Return failure response
    const responseMessage = "Error: here" + error.message;
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }
});

// READ
// Get all account
const getAccountDetails = asynchandler(async (req, res) => {
  // Collect data from query
  const { userId } = req.query;

  // Validate data
  if (!userId) {
    const responseMessage = "User ID not included in the request query";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    // Find account by userId
    let account = await AccountBalance.findOne({ userId });

    // If account doesn't exist, create a new one
    if (!account) {
      const user = await User.findOne({ _id: userId });

      if (user) {
        account = await accountCreator(userId);
        const responseMessage =
          "New account created and retrieved successfully";
        return respondsSender(
          account,
          responseMessage,
          ResponseCode.successful,
          res
        );
      } else {
        const responseMessage = "User not found";
        return respondsSender(null, responseMessage, ResponseCode.noData, res);
      }
    }

    // Return existing account
    const responseMessage = "Account retrieved successfully";
    return respondsSender(
      account,
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

// Get a single transaction
const getSingleAccount = asynchandler(async (req, res) => {
  // Collect data from body
  const { userId, transactionId } = req.query;
  // Validate data
  if (!userId || !transactionId) {
    // Send error message
    const responseMessage =
      "User ID or Account Id not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    const transaction = await Account.findOne({
      $and: [{ userId }, { _id: transactionId }],
    });

    if (!transaction) {
      const responseMessage = `No transaction found with id: ${transactionId} for user: ${userId}`;
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }
    const responseMessage = "Account retrieved successfully";
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
const updateSingleAccount = asynchandler(async (req, res) => {
  // Collect data from the body
  const {
    userId,
    amount,
    accountType = ACCOUNTTYPE.SAVING,
    totalCredit,
    totalDebit,
  } = req.body;

  // Validate data
  if (!userId || !amount) {
    const responseMessage = "User ID or Amount not included in request body";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    // Find the user's account
    const userAccount = await AccountBalance.findOne({ userId });

    if (!userAccount) {
      const responseMessage = "Account not found";
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }

    // Find the specific account type within the user's accounts
    const account = userAccount.accounts.find(
      (acc) => acc.accountType === accountType
    );

    if (!account) {
      const responseMessage = `Account type ${accountType} not found`;
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }

    // Overwrite the balance with the new amount
    account.balance = amount;
    account.totalCredit = totalCredit;
    account.totalDebit = totalDebit;

    // Save the updated user account
    await userAccount.save();

    // Send success response
    const responseMessage = `${accountType} account balance updated successfully`;
    return respondsSender(
      userAccount,
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

// DELETE
// Delete a single transaction
const deleteAccount = asynchandler(async (req, res) => {
  const { userId, transactionId } = req.body;
  // Validate data
  if (!userId || !transactionId) {
    // Send error message
    const responseMessage =
      "User ID or Account Id not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }
  try {
    const transaction = await Account.findOneAndDelete({
      $and: [{ userId }, { _id: transactionId }],
    });

    if (!transaction) {
      // If no transaction was found and deleted
      const responseMessage = `No account with id: ${transactionId}`;
      return respondsSender(
        null,
        responseMessage,
        ResponseCode.badRequest,
        res
      );
    }

    // If transaction was successfully deleted
    const responseMessage = `Account deleted successfully`;
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

// Delete all account
const deleteAllAccounts = asynchandler(async (req, res) => {
  // Collect data from body
  const { userId } = req.query;
  // Validate data
  if (!userId) {
    // Send error message
    const responseMessage = "User ID not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    // Delete all account associated with the user
    const result = await Account.deleteMany({ userId });

    // Check if any account were deleted
    if (result.deletedCount === 0) {
      // Send error message if no account were deleted
      const responseMessage = "No account found for the user";
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }

    // Return success response
    const responseMessage = "All account deleted successfully";
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

module.exports = {
  createAccount,
  getAccountDetails,
  getSingleAccount,
  updateSingleAccount,
  deleteAccount,
  deleteAllAccounts,
};
