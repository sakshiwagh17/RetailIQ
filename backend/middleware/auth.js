
import jwt from 'jsonwebtoken'

export const verifyToken = (req,res,next)=>{
    const token = req.cookies?.token;

    // console.log(token);

    if(!token){
        return res.json({success:false,message:"Error Occured while validation of tokens"})
    }
    //token exists :
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
  
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error in Verification ",error)
       res.json({success:false,message:"Error Occured while validation of tokens"});
    }
}
