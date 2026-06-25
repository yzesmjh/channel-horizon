const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../utils/constants");

const transactionPinSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["success", "failed", "hold", "custom"], // Define allowed statuses
    },
    pin: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 4, // Assuming PINs are always 4 digits
    },
  },
  { _id: false } // Disable _id for this sub-schema (optional)
);

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please add a First Name"],
    },

    lastname: {
      type: String,
      required: [true, "Please add a Last Name"],
    },
    profilePicx: {
      type: String,
      required: [false, "Please add a profilePicx"],
      default:
        "https://newaccessbank.onrender.com/api/uploads/pictures/user.png",
    },

    email: {
      type: String,
      required: [true, "Please add a Email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid Email",
      ],
    },

    customerId: {
      type: String,
      required: [true, "Please add a customerId"],
    },
    gender: {
      type: String,
      required: [true, "Please add a gender"],
    },
    transactionPin: {
      type: [transactionPinSchema], // Store an array of objects
      default: [
        { status: "success", pin: "1234" },
        { status: "failed", pin: "0000" },
        { status: "hold", pin: "0090" },
        { status: "custom", pin: "9876" },
      ],
      validate: {
        validator: function (pins) {
          const statuses = pins.map((pin) => pin.status);
          return statuses.length === new Set(statuses).size; // Ensure no duplicate statuses
        },
        message:
          "Pin already exist for user, do not create new, rather edit old pin",
      },
    },
    country: {
      type: String,
      required: [true, "Please add a country"],
    },
    city: {
      type: String,
      required: [true, "Please add a city"],
    },
    cotCode: {
      type: String,
      required: [true, "Please add a cotCode"],
    },
    role: {
      type: String,
      required: [true, "Please add a gender"],
      default: ROLES.USER,
      enum: [ROLES.ADMIN, ROLES.USER],
    },

    password: {
      type: String,
      required: [true, "Please add your Password"],
      minLength: [6, "password must be up to 6 characters"],
    },
    message: {
      type: String,
      minLength: [6, "password must be up to 6 characters"],
      default: "your transaction cannot be processed right now",
    },
  },
  { timestamps: true }
);

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
