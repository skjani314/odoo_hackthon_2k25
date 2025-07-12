import userModel from "../models/userModel.js";

export const getUserDetails=async(req,res)=>
{
    const {userId}=req.body;
    try {
        const user=await userModel.findById(userId);
        if(!user)
        {
            return res.json({success:false,message:"no user found"});
        }
        res.json({success:true,
            userDetails:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


//User Controllers


//Add skills
export const AddSkills=async(req,res,next)=>{
    try {
        const {userId,skills}=req.body;
        const user=await userModel.findById(userId);
        if(!user)
        {
            return res.json({success:false,message:"no user found"});
        }
        user.skills.push(...skills);
        await user.save();
        res.json({success:true,message:"skills added successfully",skills:user.skills});
    } catch (error) {
        return res.json({success:false,message:error.message});     
}

}

//delete skills

export const DeleteSkills=async(req,res,next)=>{
    try {
        const {userId,skills}=req.body;
        const user=await userModel.findById(userId);
        if(!user)
        {
            return res.json({success:false,message:"no user found"});
        }
        user.skills=user.skills.filter(skill=>!skills.includes(skill));
        await user.save();
        res.json({success:true,message:"skills deleted successfully",skills:user.skills});
    } catch (error) {
        return res.json({success:false,message:error.message});     
    }   
}

//Get users by skills
export const GetUsersBySkills=async(req,res,next)=>{
    try {
        const {skills}=req.body;
        const users=await userModel.find({skills:{$in:skills}});
       
        if(users.length===0)
        {
            return res.json({success:false,message:"no users found with the given skills"});
        }
        res.json({success:true,users});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const GetAllUsers=async(req,res,next)=>{

try{

    const users=await userModel.find({is_public:true});
    if(users.length===0)
    {
        return res.json({success:false,message:"no users found"});
    }
    res.json({success:true,users});
}
catch(error){
    next(error);
}
}