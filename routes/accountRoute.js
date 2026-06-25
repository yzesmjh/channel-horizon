const express = require("express");
const protect = require("../middleWare/authMiddleware");
const {
  createAccount,
  getAccountDetails,
  getSingleAccount,
  updateSingleAccount,
  deleteAccount,
  deleteAllAccounts
} = require("../controllers/accountController");


const router = express.Router();

router.put("/createaccount", createAccount);
router.get("/getaccountdetails", protect, getAccountDetails);
router.get("/getsingleAccount", protect, getSingleAccount);
router.post("/updatesingleAccount", protect, updateSingleAccount);
router.delete("/deletesingleAccount", protect, deleteAccount);
router.delete("/deleteallAccounts", protect, deleteAllAccounts);

module.exports = router;
