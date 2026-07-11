const mongoose = require("mongoose")

const Product = require("../models/Product");
const Category = require("../models/Category");


const addProduct = async (req, res)=>{
    const {name, description, price, stock, category, image, brand} = req.body;

    try{
        if(!name || !description || !category || !image || !brand){
            return res.status(400).json({
                success: false,
                message:"Please provide all required fields."
            })
        }
        if(price === undefined){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            })
        }

        if(stock === undefined){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            })
        }

        if(!mongoose.Types.ObjectId.isValid(category)){
            return res.status(400).json({
                success: false,
                 message: "Invalid category ID."
            })
        }

        const existingCategory = await Category.findById(category);

        if(!existingCategory){
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            })
        }

        if(existingCategory.isActive === false){
            return res.status(400).json({
                success: false,
                message: "Selected category is inactive."
            })
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            image,
            brand
        })
        
        res.status(201).json({
            success: true,
            message: "Product Added Successfully.",
            product
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getProduct = async (req, res)=>{
    try{
        const products = await Product.find({isActive: true}).populate("category").sort({createdAt: -1});

        res.status(200).json({
            success: true,
            products
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getProductById = async (req, res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            })
        }
        
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
        }).populate('category')

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }

        res.status(200).json({
            success: true,
            product
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



module.exports ={
    addProduct,
    getProduct,
    getProductById
}