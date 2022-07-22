const planModel = require("../models/planModel");

// /allPlans -> anyone
module.exports.getAllPlans = async function getallPlans(req, res) {
  try {
    const plans = await planModel.find();
    if (plans) {
      res.json({
        message: "All Plans received",
        data: plans,
      });
    } else {
      return res.status(500).json({
        message: "Empty database...No plans available",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

// /plan/:id
module.exports.getPlan = async function getPlan(req, res) {
  try {
    const id = req.params.id;
    const plan = await planModel.findById(id);
    if (plan) {
      res.json({
        message: "Plan received!",
        data: plan,
      });
    } else {
      return res.json({
        message: "Plan not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

// create plan -> admin , restaurantowner
module.exports.createPlan = async function createPlan(req, res) {
  try {
    let data = req.body;
    let plan = await planModel.create(data); //retuen document(doc)
    if (plan) {
      res.json({
        message: "Plan created!",
        data: plan,
      });
    } else {
      return res.json({
        message: "Something went wrong",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

// Update plan -> user
module.exports.updatePlan = async function updatePlan(req, res) {
  try {
    const id = req.params.id;
    const newData = req.body;
    // First Find
    const plan = await planModel.findById(id); //return document(doc)
    if (plan) {
      // Then update
      for (let key in newData) {
        console.log(key);
        plan[key] = newData[key];
      }
      const updatedPlan = await plan.save(); //save document
      res.json({
        message: "Plan updated!",
        data: updatedPlan,
      });
    } else {
      return res.json({
        message: "Plan not exist",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

// Delete plan -> user
module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    const id = req.params.id;
    const deletedPlan = await planModel.findByIdAndDelete(id); //retuen document(doc)
    if (deletedPlan) {
      res.json({
        message: "Plan deleted!",
        data: deletedPlan,
      });
    } else {
      return res.json({
        message: "Plan not exist",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

//get top 3 plans 0n basis of rating
module.exports.top3plans = async function top3plans(req, res) {
    try{
        const plans = await planModel.find().sort({ratingsAverage:-1}).limit(3); // -> {all plans}
        // sort() takes an object as parameter where the values are 1 or -1
        // Use -1 for descending order and 1 for ascending
         
        res.json({
          message: 'Top 3 Plans received!',
          data: plans
        });
    } catch(err){
        res.json({
            message: err.message,
          });
    }
}
