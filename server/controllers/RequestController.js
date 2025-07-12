import RequestModel from "../models/RequestModel.js";


// add request
export const createRequest = async (req, res) => {
    const { userId, description,receiverId } = req.body;
    try {
        const newRequest = new RequestModel({ userId, description ,receiverId});

        await newRequest.save();
        res.json({ success: true, message: "Request created successfully", request: newRequest });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// get incoming requests by userId
export const getRequestsByUserId = async (req, res) => {
    const { userId } = req.body;
    console.log(userId)
    try {
        const requests = await RequestModel.find({ receiverId: userId }).populate('userId', 'name email skills');
        if (!requests || requests.length === 0) {       
            return res.json({ success: false, message: "No requests found" });
        }
        res.json({ success: true, requests });              
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}   

//get requests by userId

export const getRequestsBySenderId = async (req, res) => {
    const { userId } = req.body;
    try {                   

        const requests = await RequestModel.find({ userId }).populate('receiverId', 'name email');
        if (!requests || requests.length === 0) {
            return res.json({ success: false, message: "No requests found" });
        }
        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// update request status
export const updateRequestStatus = async (req, res) => {            
    const { requestId, status } = req.body;
    try {
        const request = await RequestModel.findById(requestId);
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }
        request.status = status;
        await request.save();
        res.json({ success: true, message: "Request status updated successfully", request });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}