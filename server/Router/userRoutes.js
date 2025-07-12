import express from 'express'
import userAuth from '../Middleware/userauth.js'
import { getUserDetails } from '../controllers/user_controller.js'
import { AddSkills,GetUsersBySkills } from '../controllers/user_controller.js'

const userRouter=express.Router()

userRouter.get('/data',userAuth,getUserDetails);
userRouter.post('/add-skills',userAuth,AddSkills);
userRouter.post('/get-users-by-skills',userAuth,GetUsersBySkills);


export default userRouter;