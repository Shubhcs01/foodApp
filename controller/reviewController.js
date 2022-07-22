const reviewModel = require("../models/reviewModel");
const planModel = require("../models/planModel");

module.exports.getAllReviews = async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel.find();
    if (reviews) {
      res.json({
        message: "all reviews received",
        data: reviews,
      });
    } else {
      res.json({
        message: "No reviews available",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.top3reviews = async function top3reviews(req, res) {
  try {
    const reviews = await reviewModel.find().sort({ rating: -1 }).limit(3);
    if (reviews) {
      res.json({
        message: "Top 3 reviews received",
        data: reviews,
      });
    } else {
      res.json({
        message: "No reviews available",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.getPlanReview = async function getPlanReview(req, res) {
  try {
    let planId = req.params.planId;
    let reviews = await reviewModel.find();
    // console.log(id);
    if (reviews) {
      reviews = reviews.filter(review => review.plan.id == planId)
      return res.json({
        message: "plan reviews received",
        data: reviews,
      });
    } else {
      res.json({
        message: "No reviews available",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.createReview = async function createReview(req, res) {
  try {
    const planId = req.params.planId;
    const plan = await planModel.findById(planId);
    if (plan) {
      plan.numOfRatings = plan.numOfRatings + 1;
      // console.log(plan.numOfRatings);
      const review = req.body;
      const reviewDoc = await reviewModel.create(review);
      if (reviewDoc) {
        //Also update plan's ratingsAverage according to this review
        plan.ratingsAverage = (plan.ratingsAverage + review.rating)/(plan.numOfRatings);
        const updatedPlan = await plan.save(); //save plan
        res.json({
          message: "Review created and plan updated accordingly!",
          data1: reviewDoc,
          data2: updatedPlan
        });
      } else {
        res.json({
          message: "Oops..something went wrong!",
        });
      }
    } else {
        res.json({
            message: "Oops..something went wrong!",
          });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.updateReview = async function updateReview(req, res) {
  try {
    const planId = req.params.planId;
    //Assumption->id came from frontend in body
    const id = req.body.id;
    const newData = req.body;
    //First find and then update
    const review = await reviewModel.findById(id);
    if (review) {
      //update
      for (let key in newData) {
        if(key==id) continue;
        review[key] = newData[key];
      }
      //Save updated doc
      const newReview = await review.save();
      res.json({
        message: "Review Updated!",
        data: newReview,
      });
    } else {
      res.json({
        message: "Review not found!",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
  //TODO -> Update Plan also accordingly
};

module.exports.deleteReview = async function deleteReview(req, res) {
  try {
    const planId = req.params.planId;
    //Assumption->review id came from frontend in body
    const id = req.body.id;
    // console.log(id);
    const deletedReview = await reviewModel.findByIdAndDelete(id); //retuen document(doc)
    if (deletedReview) {
      res.json({
        message: "Review deleted!",
        data: deletedReview,
      });
    } else {
      return res.json({
        message: "Review not exist",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
  //TODO -> Update Plan also accordingly
};
