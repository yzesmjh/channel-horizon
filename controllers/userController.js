const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { respondsSender } = require("../middleWare/responseHandler");
const { ResponseCode } = require("../utils/responseCode");
const { ROLES, BANKNAME } = require("../utils/constants");
const dotenv = require("dotenv").config();

const generateToken = (id) => {
  const timestamp = Date.now();
  const expirationTime = 6 * 60 * 1000; // 6 minutes in milliseconds
  const expirationDate = timestamp + expirationTime;
  const mySecretKey = process.env.JWT_SECRET || "changethisShit1928";
  const token = jwt.sign({ id, exp: expirationDate }, mySecretKey);
  return token;
};

const Beneficiary = require("../models/beneficiaryModel");

const registerUser = asynchandler(async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      customerId,
      email,
      password,
      role = ROLES.USER,
      gender,
      country,
      city,
      cotCode,
    } = req.body;
    const userRole = role.toUpperCase();

    // Validation Check
    if (
      !firstname ||
      !lastname ||
      !email ||
      !customerId ||
      !password ||
      !gender ||
      !country ||
      !city ||
      !cotCode
    ) {
      return respondsSender(
        null,
        "Please fill in all required fields, firstname, lastname, customerId, role, email, password gender, country, city ,cotCode ",
        ResponseCode.badRequest,
        res
      );
    }
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //regex for email

    if (!emailRegex.test(email)) {
      return respondsSender(
        null,
        "Invalid email format",
        ResponseCode.badRequest,
        res
      );
    }
    const lowerEmail = email.toLowerCase();

    // Validation check if user email already exists
    const userExists = await User.findOne({
      $or: [{ email: lowerEmail }, { customerId: customerId }],
    });
    if (userExists) {
      return respondsSender(
        null,
        "User email or Customer Id already registered",
        ResponseCode.dataDuplication,
        res
      );
    }

    // Add user info to the database
    const user = await User.create({
      firstname,
      lastname,
      customerId,
      email: lowerEmail,
      password,
      role: userRole,
      gender,
      country,
      city,
      cotCode,
    });

    // User was successfully created, perform your desired action here

    // Construct Verify URL

    //res.status(200).json(response);
    return respondsSender(
      user,
      "Registration successful",
      ResponseCode.successful,
      res
    );
  } catch (error) {
    // Handle any errors that occurred during user registration
    return respondsSender(
      null,
      "Registration Failed" + error.message,
      ResponseCode.internalServerError,
      res
    );
  }
});

// Verify User Registration
const verifyUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  //check if User exist
  const user = await User.findOne({ _id: id });
  if (!user) {
    return respondsSender(
      null,
      "User not Found Please Sign-up",
      ResponseCode.noData,
      res
    );
  }
  // check if user already verified
  if (user.verified == true) {
    return respondsSender(
      null,
      "User Already Verified,  please Login",
      ResponseCode.dataDuplication,
      res
    );
  } else {
    // set Verification to true
    user.verified = true;
    await user.save();
    return respondsSender(
      null,
      "User Successfully Verified",
      ResponseCode.successful,
      res
    );
  }
});

//Login user
const loginUser = asynchandler(async (req, res) => {
  const { customerId, password } = req.body;

  //validate Request
  if (!customerId || !password) {
    return respondsSender(
      null,
      "Please Add customerId and password",
      ResponseCode.badRequest,
      res
    );
  }

  // const lowerEmail = email.toLowerCase();
  //Check if user Exists
  const user = await User.findOne({ customerId });
  if (!user) {
    return respondsSender(
      null,
      "User not Found Please Sign-up",
      ResponseCode.noData,
      res
    );
  }
  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (user && passwordIsCorrect) {
    //Generate Login Token
    const token = generateToken(user._id);

    //delete all user previous token
    const deletionResult = await Token.deleteMany({ userId: user._id });

    //save token to token db
    const savedToken = await Token.create({
      userId: user._id,
      token,
    });

    const data = {
      userInfo: user,
      token: token,
    };

    //send email

    // await notificationSender({user})
    return respondsSender(
      data,
      "Login successful",
      ResponseCode.successful,
      res
    );
  } else {
    return respondsSender(
      null,
      "Invalid customer ID or Password",
      ResponseCode.noData,
      res
    );
  }
});

//Logout User
const logout = asynchandler(async (req, res) => {
  //delete all token related to a user from db

  if (!req.body.userId) {
    return respondsSender(
      null,
      "No user id Passed",
      ResponseCode.badRequest,
      res
    );
  }
  try {
    // Assuming the field name in your Token model is 'userId'
    const result = await Token.deleteMany({ userId: req.body.userId });

    if (result.deletedCount > 0) {
      //token deleted from db
      //clear token saved in server cookies
      res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,
      });
      return respondsSender(
        null,
        "Successfully Logged out",
        ResponseCode.successful,
        res
      );
    } else {
      //clear token saved in server cookies
      res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,
      });
      return respondsSender(
        null,
        "User was not logged in, all token linked to user cleared anyway",
        ResponseCode.successful,
        res
      );
    }
  } catch (error) {
    return respondsSender(
      null,
      `Error deleting tokens:  ${error.message}`,
      ResponseCode.internalServerError,
      res
    );
  }
});

// Change Password
const changePassword = asynchandler(async (req, res) => {
  const user = await User.findById(req.userId);
  const { oldPassword, newPassword } = req.body;
  if (!user) {
    return respondsSender(
      null,
      "User Not Found, Please Sign-up",
      ResponseCode.noData,
      res
    );
  }
  //validate
  if (!oldPassword || !newPassword) {
    return respondsSender(
      null,
      "Please add old and New Password",
      ResponseCode.noData,
      res
    );
  }

  //check if old password matched password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //Save new Password
  if (user && passwordIsCorrect) {
    user.password = newPassword;
    await user.save();

    return respondsSender(
      null,
      "Password changed Successfully",
      ResponseCode.successful,
      res
    );
  } else {
    return respondsSender(
      null,
      "Old Password is Incorrect",
      ResponseCode.noData,
      res
    );
  }
});
// Change Pin
const changePin = asynchandler(async (req, res) => {
  const user = await User.findById(req.userId);
  const { oldPin, newPin, password, pinType } = req.body;

  if (!user) {
    return respondsSender(
      null,
      "User Not Found, Please Sign-up",
      ResponseCode.noData,
      res
    );
  }

  // Validate input
  if (!oldPin || !newPin || !password || !pinType) {
    return respondsSender(
      null,
      "Please add old and New Password",
      ResponseCode.noData,
      res
    );
  }

  // Check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    return respondsSender(
      null,
      "Password is Incorrect",
      ResponseCode.noData,
      res
    );
  }

  // Find the index of the transaction pin that matches the pinType
  const pinIndex = user.transactionPin.findIndex(
    (pin) => pin.status === pinType
  );

  if (pinIndex === -1) {
    return respondsSender(null, "Invalid PIN type", ResponseCode.noData, res);
  }

  // Check if the old PIN matches
  const pinIsCorrect = user.transactionPin[pinIndex].pin === oldPin;

  // Save new PIN
  if (pinIsCorrect) {
    user.transactionPin[pinIndex].pin = newPin; // Update the pin at the found index
    await user.save();

    return respondsSender(
      null,
      "PIN changed Successfully",
      ResponseCode.successful,
      res
    );
  } else {
    return respondsSender(
      null,
      "Old PIN is Incorrect",
      ResponseCode.noData,
      res
    );
  }
});
const changeMessage = asynchandler(async (req, res) => {
  const user = await User.findById(req.userId);
  const { message } = req.body;

  if (!user) {
    return respondsSender(
      null,
      "User Not Found, Please Sign-up",
      ResponseCode.noData,
      res
    );
  }

  // Validate input
  if (!message) {
    return respondsSender(null, "Please add message", ResponseCode.noData, res);
  }

  user.message = message; // Update the pin at the found index
  await user.save();

  return respondsSender(
    null,
    "Message changed Successfully",
    ResponseCode.successful,
    res
  );
});

// Change add benefitiary
const addBeneficiary = asynchandler(async (req, res) => {
  const userId = req.userId;
  const { accountName, accountNumber, bankName, routineNumber } = req.body;

  // Check for missing fields
  if (!accountName || !accountNumber || !bankName || !routineNumber) {
    return respondsSender(
      null,
      "accountName, accountNumber, bankName, and routineNumber must be included",
      ResponseCode.badRequest,
      res
    );
  }

  try {
    // Check if accountNumber already exists
    const existingBeneficiary = await Beneficiary.findOne({ accountNumber });
    if (existingBeneficiary) {
      return respondsSender(
        null,
        "Beneficiary with this account number already exists",
        ResponseCode.dataDuplication,
        res
      );
    }

    // Create and save new beneficiary
    const newBeneficiary = new Beneficiary({
      userId,
      accountName,
      accountNumber,
      bankName,
      routineNumber,
    });

    await newBeneficiary.save();

    return respondsSender(
      null,
      "Beneficiary added successfully",
      ResponseCode.successful,
      res
    );
  } catch (error) {
    console.error("Error adding beneficiary", error);
    return respondsSender(
      null,
      "Failed to add beneficiary",
      ResponseCode.internalServerError,
      res
    );
  }
});
// get all Beneficiary
const allBeneficiary = asynchandler(async (req, res) => {
  const userId = req.userId;

  try {
    // Check if accountNumber already exists
    const existingBeneficiary = await Beneficiary.find({ userId });
    return respondsSender(
      existingBeneficiary,
      "Beneficiary with this account number already exists",
      ResponseCode.successful,
      res
    );
  } catch (error) {
    console.error("Error adding beneficiary", error);
    return respondsSender(
      null,
      "Failed to add beneficiary",
      ResponseCode.internalServerError,
      res
    );
  }
});

//Forgot Password Process
const forgotPassword = asynchandler(async (req, res) => {
  const { email, userId } = req.body;
  if (!email || !userId) {
    return respondsSender(
      null,
      "Please add email and userId",
      ResponseCode.badRequest,
      res
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    return respondsSender(
      null,
      "User email does not exist",
      ResponseCode.noData,
      res
    );
  }

  // Delete token if it exists in DB
  try {
    // Find and delete the token based on userId
    const deletedToken = await Token.findOneAndDelete({ userId: userId });

    if (deletedToken) {
      console.log(`Token for userId deleted: ${userId}`);
    } else {
      console.log(`No token found for userId: ${userId}`);
    }
  } catch (error) {
    console.error(`Error deleting token: ${error.message}`);
  }

  //create Reset token
  const resetToken = generateToken(userId);

  //Hash token before Saving to DB
  //  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  //Save Token to DB
  await new Token({
    userId: userId,
    token: resetToken,
  }).save();

  //construct Reset URL
  const backendBaseUrl = process.env.BACKENDURL;

  const resetUrl = `${backendBaseUrl}reset-password?token=${resetToken}`;

  // Reset Email
  const message = `
                <h2> Hello ${user.lastname},</h2>
                <p> Please use the url below to reset your password </p>
                <p> This reset link is valid for only 5 minutes </p>
                
                <a href=${resetUrl} clicktracking = off > ${resetUrl}</a>
                
                <p> Regards ... </p>
                <p> NIYO Groups. </p>`;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    return respondsSender(
      resetUrl,
      "Reset Email Sent",
      ResponseCode.successful,
      res
    );
  } catch (error) {
    return respondsSender(
      null,
      "Email not Sent, Please try again" + error.message,
      ResponseCode.internalServerError,
      res
    );
  }
});

//Reset Password
const resetPassword = asynchandler(async (req, res) => {
  const { password, resetToken, userId } = req.body;

  if (!password || !resetToken || !userId) {
    return respondsSender(
      null,
      "password and reset token needed",
      ResponseCode.badRequest,
      res
    );
  }

  //Hash token,  then Compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Find Token in DB before reseting
  const userToken = await Token.findOne({
    token: resetToken,
  });

  if (!userToken) {
    return respondsSender(
      null,
      "Invalid or Expired Token",
      ResponseCode.invalidToken,
      res
    );
  }

  //Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  //delete token from db
  try {
    // Find and delete the token based on userId
    const deletedToken = await Token.findOneAndDelete({ userId: userId });

    if (deletedToken) {
      console.log(`Deleted token for userId: ${userId}`);
    } else {
      console.log(`No token found for userId: ${userId}`);
    }
  } catch (error) {
    console.error(`Error deleting token: ${error.message}`);
  }
  return respondsSender(
    null,
    "Password Reset Successful, Please Login",
    ResponseCode.successful,
    res
  );
});

// Get all users
const getAllUsers = asynchandler(async (req, res) => {
  // Collect data from body
  try {
    const users = await User.find({ role: { $ne: "ADMIN" } });

    // Check if transactions exist
    if (!users) {
      // Send error message if no transactions found
      const responseMessage = "No user found";
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }

    // Return success response with transactions
    const responseMessage = "Users retrieved successfully";
    return respondsSender(users, responseMessage, ResponseCode.successful, res);
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

// Delete a single user
const deleteUser = asynchandler(async (req, res) => {
  const { userId } = req.body;

  // Validate data
  if (!userId) {
    const responseMessage = "User ID is required";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      // If no user was found
      const responseMessage = `No User with id: ${userId}`;
      return respondsSender(
        null,
        responseMessage,
        ResponseCode.badRequest,
        res
      );
    }

    // Check if the user is an admin
    if (user.role === "admin") {
      const responseMessage = `Cannot delete an admin user.`;
      return respondsSender(
        null,
        responseMessage,
        ResponseCode.badRequest,
        res
      );
    }

    // Proceed with deletion if the user is not an admin
    await User.findOneAndDelete({ userId });

    // If user was successfully deleted
    const responseMessage = `User deleted successfully`;
    return respondsSender(user, responseMessage, ResponseCode.successful, res);
  } catch (error) {
    // If an error occurred during the deletion process
    const responseMessage = error.message;
    return respondsSender(null, responseMessage, ResponseCode.serverError, res);
  }
});

// Get a single transaction
const getSingleUser = asynchandler(async (req, res) => {
  // Collect data from body
  const { userId } = req.query;
  // Validate data
  if (!userId) {
    // Send error message
    const responseMessage =
      "User ID or Transaction Id not included in body request";
    return respondsSender(null, responseMessage, ResponseCode.badRequest, res);
  }

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      const responseMessage = `No User found`;
      return respondsSender(null, responseMessage, ResponseCode.noData, res);
    }
    const responseMessage = "User retrieved successfully";
    return respondsSender(user, responseMessage, ResponseCode.successful, res);
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

// Edit User
// const editUser = asynchandler(async (req, res) => {
//   try {
//     const {
//       userId,
//       firstname,
//       lastname,
//       customerId,
//       email,
//       password = null,
//       role = ROLES.USER,
//       gender,
//       country,
//       city,
//       cotCode,
//       transactionPin,
//     } = req.body;

//     // Validation Check
//     if (
//       !userId ||
//       !firstname ||
//       !lastname ||
//       !email ||
//       !customerId ||
//       !gender ||
//       !country ||
//       !city ||
//       !cotCode ||
//       !transactionPin
//     ) {
//       return respondsSender(
//         null,
//         "Please fill in all required fields: firstname, lastname, customerId, email, gender, country, city, cotCode",
//         ResponseCode.badRequest,
//         res
//       );
//     }

//     const emailRegex =
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//     if (!emailRegex.test(email)) {
//       return respondsSender(
//         null,
//         "Invalid email format",
//         ResponseCode.badRequest,
//         res
//       );
//     }

//     const lowerEmail = email.toLowerCase();

//     // Dynamically build the update object
//     const updateFields = {
//       firstname,
//       lastname,
//       customerId,
//       email: lowerEmail,
//       role: role.toUpperCase(),
//       gender,
//       country,
//       city,
//       cotCode,
//       transactionPin,
//     };

//     // Update password only if provided
//     if (password) {
//       updateFields.password = password; // Ensure you hash it if necessary
//     }

//     // Array filters to update specific transactionPin items by their status
//     const arrayFilters = transactionPin.map((pin, index) => ({
//       [`pin${index}.status`]: pin.status, // Filtering based on status
//     }));

//     // Update the user in the database
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         $set: {
//           ...updateFields,
//           // This will update specific elements in the transactionPin array
//           ...transactionPin.reduce((acc, pin, index) => {
//             acc[`transactionPin.$[pin${index}].pin`] = pin.pin; // Set the new pin values
//             return acc;
//           }, {}),
//         },
//       },
//       {
//         new: true, // Return the updated user
//         runValidators: true, // Ensure schema validation is applied
//         arrayFilters, // Apply filters to match specific elements in the transactionPin array
//       }
//     );

//     if (!updatedUser) {
//       return respondsSender(
//         null,
//         "User not found",
//         ResponseCode.badRequest,
//         res
//       );
//     }

//     // Respond with the updated user information
//     return respondsSender(
//       updatedUser,
//       "User updated successfully",
//       ResponseCode.successful,
//       res
//     );
//   } catch (error) {
//     // Handle any errors that occurred during user update
//     return respondsSender(
//       null,
//       "User update failed: " + error.message,
//       ResponseCode.internalServerError,
//       res
//     );
//   }
// });

const editUser = asynchandler(async (req, res) => {
  try {
    const {
      userId,
      firstname,
      lastname,
      customerId,
      email,
      password = null,
      role = ROLES.USER,
      gender,
      country,
      city,
      message,
      cotCode,
      transactionPin, // Keep this for validation but not for update here
    } = req.body;

    // Validation Check
    if (
      !userId ||
      !firstname ||
      !lastname ||
      !email ||
      !customerId ||
      !gender ||
      !country ||
      !city ||
      !message ||
      !cotCode ||
      !transactionPin
    ) {
      return respondsSender(
        null,
        "Please fill in all required fields: firstname, lastname, customerId, email, gender, country, city, cotCode",
        ResponseCode.badRequest,
        res
      );
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) {
      return respondsSender(
        null,
        "Invalid email format",
        ResponseCode.badRequest,
        res
      );
    }

    const lowerEmail = email.toLowerCase();

    // Dynamically build the update object without transactionPin for now
    const updateFields = {
      firstname,
      lastname,
      customerId,
      email: lowerEmail,
      role: role.toUpperCase(),
      gender,
      country,
      city,
      message,
      cotCode,
    };

    // Update password only if provided
    if (password) {
      updateFields.password = password; // Ensure you hash it if necessary
    }

    // Update the user (without touching transactionPin for now)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return respondsSender(
        null,
        "User not found",
        ResponseCode.badRequest,
        res
      );
    }

    // Move to step 2: update transactionPin array
    const arrayFilters = transactionPin.map((pin, index) => ({
      [`pin${index}.status`]: pin.status, // Filter based on status
    }));

    // Update only the transactionPin field in the second step
    const updatedUserWithPins = await User.findByIdAndUpdate(
      userId,
      {
        $set: transactionPin.reduce((acc, pin, index) => {
          acc[`transactionPin.$[pin${index}].pin`] = pin.pin;
          return acc;
        }, {}),
      },
      {
        new: true, // Return the updated user
        runValidators: true, // Ensure schema validation is applied
        arrayFilters, // Apply filters to match specific elements in the transactionPin array
      }
    );

    if (!updatedUserWithPins) {
      return respondsSender(
        null,
        "User not found while updating pins",
        ResponseCode.badRequest,
        res
      );
    }

    // Respond with the fully updated user information
    return respondsSender(
      updatedUserWithPins,
      "User and transactionPin updated successfully",
      ResponseCode.successful,
      res
    );
  } catch (error) {
    // Handle any errors that occurred during user update
    return respondsSender(
      null,
      "User update failed: " + error.message,
      ResponseCode.internalServerError,
      res
    );
  }
});

// Controller to handle photo upload and user update
const uploadPhoto = asynchandler(async (req, res) => {
  try {
    const { userId } = req.body;

    // Validation Check
    if (!userId || !req.file) {
      return respondsSender(
        null,
        "Please provide both userId and a file",
        ResponseCode.badRequest,
        res
      );
    }

    // Get the file URL from Cloudinary
    const filePath = req.file.path; // Cloudinary URL

    // Dynamically build the update object
    const updateFields = {
      profilePicx: filePath, // Use Cloudinary URL as the profile picture URL
    };

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return respondsSender(
        null,
        "User not found",
        ResponseCode.badRequest,
        res
      );
    }

    // Respond with the updated user information
    return respondsSender(
      updatedUser,
      "Profile picture updated successfully",
      ResponseCode.successful,
      res
    );
  } catch (error) {
    // Handle any errors that occurred during the update
    return respondsSender(
      null,
      "Profile picture update failed: " + error.message,
      ResponseCode.internalServerError,
      res
    );
  }
});

module.exports = {
  uploadPhoto,
  editUser,
  getSingleUser,
  getAllUsers,
  registerUser,
  loginUser,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyUser,
  deleteUser,
  editUser,
  addBeneficiary,
  allBeneficiary,
  changePin,
  changeMessage,
};
