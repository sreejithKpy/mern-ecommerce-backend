const Product = require("../models/Product");
const User = require("../models/User");

const addToWishlist = async (req, res)=>{
    const { productId } = req.params;

    try{
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        if(user.wishlist.includes(productId)){
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist."
            })
        }

        user.wishlist.push(productId);

        await user.save();

        res.status(200).json({
            success: true,
            false: "Product added to wishlist."
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getWishlist = async (req, res)=>{
    try{
        const user = await User.findById(req.user.id).select("wishlist").populate("wishlist");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            wishlist: user.wishlist
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeFromWishlist = async (req, res)=>{
    const {productId} = req.params;

    try{
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.wishlist = user.wishlist.filter(
            (id)=> id.toString() !== productId
        ) 

        await user.save();

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist."
        })
 
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
}