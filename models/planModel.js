const express = require("express");
const { default: mongoose } = require("mongoose");
require('dotenv').config()

// Connect mongodB
const db_link = process.env.MONGO_URL;
mongoose
  .connect(db_link)
  .then((db) => {
    console.log("plan Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Make Schema (document format)
const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
    maxlength: [20, 'plan name should not exceed more than 20 character']
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'price not entered'],
  },
  ratingsAverage: {
    type: Number,
  },
  discount:{
    type: Number,
    required: true,
    validate: [function () {
      return this.discount<100;
    }, 'discount should not exceed price']
  },
  numOfRatings:{
    type: Number,
    default: 0,
  }
});

//Make model (collection) and connect model to schema
const planModel = mongoose.model("planModel", planSchema);

//Testing
// (async function createPlan(){
//     let plan = {
//         name:'Superfood',
//         duration:30,
//         price:1000,
//         ratingsAverage:5,
//         discount:20
//     }
//     let data = await planModel.create(plan);
//     console.log(data);
// })();






module.exports = planModel;
