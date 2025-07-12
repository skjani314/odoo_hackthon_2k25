import express from 'express'
import { createRequest,getRequestsByUserId,getRequestsBySenderId,updateRequestStatus } from '../controllers/RequestController.js'
import RequestModel from '../models/RequestModel.js'    
import userAuth from '../Middleware/userauth.js';


const RequestRouter = express.Router();

RequestRouter.post('/create',userAuth,createRequest);
RequestRouter.post('/incoming-requests', userAuth,getRequestsByUserId);
RequestRouter.post('/sent-requests', userAuth,getRequestsBySenderId);
RequestRouter.post('/update-status', updateRequestStatus);     

export default RequestRouter;
