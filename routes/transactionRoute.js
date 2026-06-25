const express = require("express");
const protect = require("../middleWare/authMiddleware");
const {
  createTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateSingleTransaction,
  deleteTransaction,
  deleteAllTransactions,
  runScript,
  transfer,
  wiretransfer,
} = require("../controllers/transactionController");

const router = express.Router();

router.put("/createtransaction", protect, createTransaction);
router.get("/getallTransactions", protect, getAllTransactions);
router.get("/getsingleTransaction", protect, getSingleTransaction);
router.post("/updatesingletransaction", protect, updateSingleTransaction);
router.delete("/deletesingletransaction", protect, deleteTransaction);
router.delete("/deleteallTransactions", protect, deleteAllTransactions);
router.post("/transfer", protect, transfer);
router.post("/wire-transfer", protect, wiretransfer);
router.get("/runscript", runScript);

module.exports = router;
