const Category = require("../models/Category")
const mongoose = require('mongoose')

const addCategory = async (req, res)=>{
    const {name, description, image} = req.body

    try{
        if(!name){
            return res.status(400).json({
                success: false,
                message: "Category name is required."
            })
        }
        const categoryName = name.trim().toLowerCase()

        const existingCategory = await Category.findOne({
            name:{
                $regex: new RegExp(`^${name}$`, "i")            //Case-insensitive search
            }
        });

        if(existingCategory){
            return res.status(409).json({
                success: false,
                message: "Category already exists."
            })
        }

        const category = await Category.create({
            name: categoryName,
            description,
            image
        })

        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getCategories = async (req, res)=>{
    try{
        const categories = await Category.find({isActive: true}).sort({name: 1});

        res.status(200).json({
            success: true,
            categories
        })
    }catch(error){
        res.status(500).json({
            success: false,  
            message: error.message
        })
    }
}

const getCategoryByID = async (req, res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID."
            });
        } 
        const category = await Category.findOne({
            _id: req.params.id,
            isActive: true
        }) 


        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found."
            })
        }

        res.status(200).json({
            success: true,
            category
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updatecategory = async (req, res)=>{
    const {name, description, image} = req.body;
    const categoryName = name?.trim();
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                success: false,
                message: "Invalid category ID."
            })
        }
        const updated = {};
        if(name){
            updated.name = categoryName;
        }
        if(description){
            updated.description = description;
        }
        if(image){
            updated.image = image;
        }

        if(Object.keys(updated).length === 0){
            return res.status(400).json({
                success: false,
                message: "No fields provided for update."
            })
        }

        if(categoryName){
            const existingCategory = await Category.findOne({
                _id: { $ne: req.params.id },
                name: {
                    $regex: new RegExp(`^${categoryName}$`, "i")
                },
                isActive: true,
            

            })

            if(existingCategory){
                return res.status(409).json({
                    success: false,
                    message: "Category name already exists."
                })
            }

        }
        
        const category = await Category.findByIdAndUpdate(req.params.id, updated,
            {
                new: true,
                runValidators: true
            }
        )

        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found."
            })
        }

        res.status(200).json({
            success: true,
            message: "Category Updated Successfully.",
            category

        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteCategory = async (req, res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                success: false,
                message: "Invalid category ID."
            })
        }
        const category = await Category.findById(req.params.id);

        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            })
        }

        if(category.isActive === false){
            return res.status(409).json({
                success: false,
                message: "Category is already deleted"
            })
        }

        category.isActive = false

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully."
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    addCategory,
    getCategories,
    getCategoryByID,
    updatecategory,
    deleteCategory
}