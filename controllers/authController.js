const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res)=>{
    const {name, email, password} = req.body;

    try{
        //empty filed checking
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        //existing user check
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            })
        }

        //password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        //create User
        await User.create({
            name,
            email,
            password: hashedPassword
        })

        

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            
        })

        
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const loginUser = async (req, res)=>{
    const {email, password} = req.body;

    try{
        //empty fields checking
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        //existing email
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }

        //compare password
        const isMatchPassword = await bcrypt.compare(password, user.password);

        if(!isMatchPassword){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }

        if(!user.isActive){
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated."
            })
        }

        //jwt token generate
        const token = jwt.sign(
            {
                id: user._id, 
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        // remove password before sending response

        const userData = user.toObject();
        delete userData.password

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: userData
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
}

const getProfile = async (req, res)=>{
    console.log("Profile controller called");
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



module.exports = {
    registerUser,
    loginUser,
    getProfile
} 