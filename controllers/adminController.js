const User = require('../models/User');
const Product = require('../models/Product');
const Order = require("../models/Order");
const { default: mongoose } = require('mongoose');

const getDashboardStats = async (req, res)=>{
    try{
        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: {
                        $ne: "Cancelled",
                    },
                },
            },

            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount" 
                    },
                },
            },

             
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
            }
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
 
const getAllUsers = async (req, res)=>{
    try{
        const users = await User.find(
            {},
            "-password"
        ).sort({createdAt: -1});

        res.status(200).json({
            success: true,
            users
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateUserStatus = async (req, res)=>{
    const {id} = req.params;
    const {isActive} = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            })
        }
 
        if(typeof isActive !== "boolean"){
            return res.status(400).json({
                success: false,
                message: "Invalid status." 
            })
        }
 
        const user = await User.findById(id).select("-password");

        if(!user){
            return res.status(404).json({  
                success: false,
                message: "User not found."
            })
        }

        if(user.role === "admin"){
            return res.status(403).json({
                success: false,
                message: "Admin status cannot be changed."
            })
        }

        user.isActive = isActive

        await user.save();

        res.status(200).json({
            success: true,
            message: isActive ? "User activated successfully." : "User deactivated successfully.",
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
    getDashboardStats,
    getAllUsers,
    updateUserStatus
}