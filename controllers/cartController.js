const mongoose = require('mongoose');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const addToCart = async (req, res)=>{
    const {product, quantity = 1} = req.body;
    const userId = req.user.id;

    try{
        if(!product){
            return res.status(400).json({
                success: false,
                message: "Product is required."
            })
        }

        if(!mongoose.Types.ObjectId.isValid(product)){
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            })
        }

        const existingProduct = await Product.findOne({
            _id: product,
            isActive: true,
            isAvailable: true
        })

        if(!existingProduct){
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        const cart = await Cart.findOne({
            user: userId
        })

        if(!cart){
            const newCart = await Cart.create({
                user: userId,
                items: [
                    {
                        product,
                        quantity
                    }
                ]
            })

            return res.status(201).json({
                success: true,
                message: "Product added to cart.",
                cart: newCart
            })
            
        }

        const item = cart.items.find(
            item=> item.product.toString() === product
        )



        if(item){
            if(item && item.quantity + quantity > existingProduct.stock){
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock available."
                })
            }
            item.quantity += quantity
        }else{
            if(quantity > existingProduct.stock){
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock available."
                })
            }
            cart.items.push({
                product,
                quantity
            }) 
        }
        await cart.save()

        return res.status(200).json({
            success: true,
            message: "Product added to cart.",
            cart
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const getCart = async (req, res)=>{
    const userId = req.user.id;

    try{

        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product");

        if(!cart){
            return res.status(200).json({
                success: true,
                message: "Your cart is empty."
            })
        }

        res.status(200).json({
            success: true,
            cart
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateCartQuantity = async (req, res)=>{
    const {productId} = req.params;
    const {quantity} = req.body;
    const userId = req.user.id

    
    try{
        

        if(!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            })
        }

        if(quantity === undefined){
            return res.status(400).json({
                success: false,
                message: "Quantity is required."
            });
        }


        if(quantity < 1){
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1."
            })
        }

        const existingProduct = await Product.findById(productId);

        if(!existingProduct){
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        if(quantity > existingProduct.stock){
            return res.status(400).json({
                success: false,
                message: "Not enough stock available."
            });
        }

        const cart = await Cart.findOne({
            user: userId
        })

        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            })
        }

        const item = cart.items.find(
            item=> item.product.toString()===productId
        )
        

        if(!item){
            return res.status(404).json({
                success: false,
                message: "Product not found in cart."
            })
        }

        item.quantity = quantity

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        })

        
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeFromCart = async (req, res)=>{
    const { productId } = req.params;
    const userId = req.user.id;

    try{
        if(!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            })
        }

        const cart = await Cart.findOne({
            user: userId
        })

        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            })
        }

        const item = cart.items.find(
            item=> item.product.toString() === productId
        )

        if(!item){
            return res.status(404).json({
                success: false,
                message: "Product not found in cart."
            })
        }

        cart.items = cart.items.filter(
            item=> item.product.toString() !== productId
        )

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product removed from cart.",
            cart
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const clearCart = async (req, res)=>{
    const userId = req.user.id;

    try{
        const cart = await Cart.findOne({
            user: userId
        })

        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            })
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully.",
            cart
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
}