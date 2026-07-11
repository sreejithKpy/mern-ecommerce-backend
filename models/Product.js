const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        min: [0, "Price cannot be negative."]
    },
    stock:{
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative."]
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    image:{
        type:[String],
        required: true
    },
    brand:{
        type: String,
        required: true,
        trim: true
    },
    rating:{
        type: Number,
        default: 0,

    },
    numReviews:{
        type: Number,
        default: 0
    },
    isAvailable:{
        type: Boolean,
        default: true
    },
    isActive:{
        type: Boolean,
        default: true
    }

},

{
    timestamps: true
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product
