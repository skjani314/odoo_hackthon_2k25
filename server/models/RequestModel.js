import { create } from "domain";
import mongoose from "mongoose";

export const RequestSchema= new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, enum:["pending","accepted","rejected"],default: "pending" }, 
    description:{ type: String },
    createdAt: { type: Date, default: Date.now },
});     
const RequestModel=mongoose.models.Requests || mongoose.model('Requests',RequestSchema);
export default RequestModel;