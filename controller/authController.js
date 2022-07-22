const express = require("express");
const path = require("path");
const userModel = require("../models/userModel");
const {sendMail} = require('../utility/nodemailer');
const jwt = require("jsonwebtoken");
require('dotenv').config()
const JWT_KEY  = process.env.JWT_KEY;

// signup
module.exports.getSignUp = function getSignUp(req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "../public") });
};

module.exports.postSignup = async function postSignup(req, res) {
  try {
    let user = await userModel.create(req.body);
    if (user) {
      sendMail("signup",user);
      res.json({
        Message: "user signed up",
        data: user,
      });
    } else {
      res.json({
        Message: "error while sighning up",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

// login
module.exports.postLogin = async function postLogin(req, res) {
  let fdata = req.body;
  try {
    //check if email not Null?
    if (fdata.email) {
      // check whether user exist?
      let user = await userModel.findOne({ email: fdata.email });
      if (user) {
        //compare password (// TODO -> bcrypt compare)
        if (fdata.password === user.password) {
          //generate JWT signature
          let uid = user._id;
          let token = jwt.sign({ payload: uid }, JWT_KEY);
          res.cookie("login", token, { httpOnly: true }); // send jwt
          res.json({
            message: "Logged-In successfully",
            data: fdata,
          });
        } else {
          res.json({
            message: "invalid password",
            data: fdata,
          });
        }
      } else {
        res.json({
          message: "User Not Exist",
          data: fdata,
        });
      }
    } else {
      res.json({
        message: "email field missing",
        data: fdata,
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
      data: fdata,
    });
  }
};

// logout
module.exports.getLogout =  function getLogout(req, res) {
  try {
    res.cookie('login',' ',{maxAge:1});
    res.json({
      message:'Logout successfully'
    })
  } catch (err) {
    return res.json({
      message: err.message,
      data: fdata,
    });
  }
};

//To check user's Role ['admin','user','restaurantowner','deliveryboy']
module.exports.isAuthorised = function isAuthorised(roles) {
  try {
    return (req, res, next) => {
      if (roles.includes(req.role) == true) {
        next();
      } else {
        res.status(401).json({
          message: "unauthorised",
        });
      }
    };
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

//protectRoute
module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    if (req.cookies.login) {
      let token = jwt.verify(req.cookies.login, JWT_KEY);
      if (token) {
        let uid = token.payload;
        let user = await userModel.findById(uid);
        req.role = user.role;
        req.id = uid;
        next();
      } else {
        return res.json({ message: "Not Authorised...please login again" });
      }
    } else {
      //browser
      const client = req.get('user-Agent');
      if(client.includes("Mozilla")){
        return res.redirect('/login');
      }
      //postman
      return res.json({
        message: "Not Authorised...please login again",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

//Forget Password
module.exports.forgetPassword = async function forgetPassword(req, res) {
  const {email} = req.body;
  try {
    let user = await userModel.findOne({email:email}); // Returns a Document
    if(user){
      //create unique token to verify user in resetPassword route
      const resetToken = user.createResetToken();
      let resetPasswordLink = `${req.protocol}://${req.get('host')} /resetPassword/ ${resetToken}`
      // Send email to user using Nodemailer
      let obj = {
        resetPasswordLink: resetPasswordLink,
        email:email
      }
      sendMail("resetPassword",obj);
      return res.json({
        message: 'Mail sent successfully'
      })
    } else {
      res.json({
        message: 'user not exist'
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

//Reset Password
module.exports.resetPassword = async function resetPassword(req, res) {
  try {
      const token = req.params.token;
      const {password, confirmPassword} = req.body;
      const user = await userModel.findOne({resetToken:token});
      if(user){
        //resetPassword Handler will update  user password in Db and Remove resetToken from dB
        user.resetPasswordHandler(password,confirmPassword);
        await user.save();
        res.json({
          message:"password changed successfully, Login again"
        })
      } else {
        res.json({
          message:'Oops..something went wrong!'
        })
      }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};
