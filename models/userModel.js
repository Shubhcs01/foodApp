const express = require("express");
const { default: mongoose } = require("mongoose");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require('dotenv').config()

// Connect mongodB
const db_link = process.env.MONGO_URL;
mongoose
  .connect(db_link)
  .then((db) => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Make Schema (document format)
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 15,
  },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 15,
    validate: function () {
      return this.confirmPassword === this.password;
    },
  },
  // Authorizatrion
  role: {
    type: String,
    enum: ["admin", "user", "restaurantowner", "deliveryboy"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: "img/users/default.jpeg",
  },
  resetToken: {
    type: String,
  }
});

//Remove redundant data from being saved (Before Model)
userSchema.pre("save", function () {
  this.confirmPassword = undefined;
});

// Hashed Password
// userSchema.pre('save',async function(){
//     const salt = await bcrypt.genSalt();
//     const hashedString = await bcrypt.hash(this.password,salt);
//     // console.log(hashedString);
//     this.password = hashedString;
// })

// Attach methods to schema (Attach Instance Method ): (https://mongoosejs.com/docs/guide.html#methods)
userSchema.methods.createResetToken = function () {
    ///create unique token using npm crypto
    const uniqueToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = uniqueToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function (password, confirmPassword) {
    // Save new data to dB
    this.password = password;
    this.confirmPassword = confirmPassword;
    // Remove token after successfull reset
    this.resetToken = undefined; 
}

//Make model (collection) and connect model to schema
const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
