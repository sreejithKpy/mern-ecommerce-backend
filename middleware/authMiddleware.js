const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware =async (req, res, next)=>{
    
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            success: false,
            message: "Invalid authorization header."
        })
    }
    

    const token = authHeader.split(" ")[1];
    

    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(user.isActive === false){
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated."
            })
        }
        

        req.user = decoded;

        

        next()

    }catch(error){
        
        res.status(401).json({
            success: false,
            message: error.message
        })

    }
}

module.exports = authMiddleware