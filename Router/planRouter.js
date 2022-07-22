const express = require('express')
const {protectRoute, isAuthorised} = require('../controller/authController')
const {getAllPlans, getPlan, createPlan, updatePlan, deletePlan, top3plans} = require('../controller/planController')

const planRouter = express.Router();

//all plans
planRouter.route('/allPlans')
.get(getAllPlans)

//Top 3 plans
planRouter.route('/top3')
.get(top3plans)

//own plans (must logged in)
planRouter.use(protectRoute);

planRouter.route('/:id')
.get(getPlan)
.patch(updatePlan)
.delete(deletePlan)

// admin and restaurant owner can only 
// do CRUD operations 
planRouter.use(isAuthorised(['admin','restaurantowner']));

planRouter.route('/createPlan')
.post(createPlan)

module.exports = planRouter;