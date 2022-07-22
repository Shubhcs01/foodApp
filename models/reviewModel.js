const express = require("express");
const { default: mongoose } = require("mongoose");
require('dotenv').config()

// Connect mongodB
const db_link = process.env.MONGO_URL;
mongoose
  .connect(db_link)
  .then((db) => {
    console.log("Review Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Make Schema (document format)
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min:1,
    max:10
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  //establish Relationship
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'userModel',
    required:[true,'review must belong to a user']
  },
  plan:{
    type:mongoose.Schema.ObjectId,
    ref:'planModel',
    required:[true,'review must belong to a plan']
  }
});

//Hooks
//find findById findOne
reviewSchema.pre(/^find/, function(next){
  this.populate({
    path: "user",
    select: "name profileImage"
  }).populate("plan");
  next();
});

//Make model (collection) and connect model to schema
const reviewModel = mongoose.model("reviewModel", reviewSchema);

module.exports = reviewModel; 
