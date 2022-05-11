  const asyncHandler = require('express-async-handler')

  const Goals = require('../models/goalModel')

  //get goals
  //route get/api/goals
  // acess private 
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goals.find({user: req.user.id})
    res.status(200).json(goals)
})
  //set goals
  //route post/api/goals
  // acess private 
const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error ('Please add a text field')
    }

    const goal = await Goals.create({
        text: req.body.text,
        user: req.user.id,
    }) 
    res.status(200).json(goal)
})
  //update goals
  //route get/api/goals/:id
  // acess private 
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goals.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error('Goals not found')
    }

   // const user = await User.findById(req.user.id)
        
    // check fo user
        if(!user) {
            res.status(401 )
            throw new Error('user not found')
        }

// make sure the logged in user matches the goal user
        if (goal.user.toString()!== req.user.id){
            res.status(401)
            throw new Error('User not authorized')
        }

    const updatedGoal = await Goals.findByIdAndUpdate (req.params.id,req.body, {
        new: true,
    })

    res.status(200).json(updatedGoal)
})
  //delete goals
  //route get/api/goals/:id 
  // access private 
const deleteGoal = asyncHandler(async (req, res) => {
      const goal = await Goals.findById(req.params.id)

      if(!goal) {
          res.status(400)
          throw new Error ('Goals not found')
      }
   
          // check fo user
        if(!req.user) {
            res.status(401 )
            throw new Error('user not found')
        }

// make sure the logged in user matches the goal user
        if (goal.user.toString()!== req.user.id){
            res.status(401)
            throw new Error('User not authorized')
        }

         await goal.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}