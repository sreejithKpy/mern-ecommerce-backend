const mongoose = require("mongoose");

const Product = require("../models/Product");
const Category = require("../models/Category");

const addProduct = async (req, res) => {
  const { name, description, price, stock, category, image, brand } = req.body;

  try {
    if (!name || !description || !category || !image || !brand) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }
    if (price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    }

    if (existingCategory.isActive === false) {
      return res.status(400).json({
        success: false,
        message: "Selected category is inactive.",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image,
      brand,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10,
  } = req.query;
  try {
    const filter = {
      isActive: true,
    };

    let sortOption = {
      createdAt: -1,
    };
    //-------------filtering---------------

    //search name filtering
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    //category filtering
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Category Id",
        });
      }

      filter.category = category;
    }

    //brand filtering
    if (brand) {
      filter.brand = {
        $regex: `^${brand}$`,
        $options: "i",
      };
    }

    //price filtering
    if (minPrice || maxPrice) {
        filter.price = {};


        if (minPrice) {
            const min = Number(minPrice)

            if(Number.isNaN(min)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid minimum price."
                })
            }


            filter.price.$gte = min; 
        }

        if (maxPrice) {
            const max = Number(maxPrice);

            if(Number.isNaN(max)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid maximum price."
                })
            }

            filter.price.$lte = max;
        }
    }

    //------------sorting ----------------

    if (sort) {
      //price acending order
      if (sort === "price_asc") {
        sortOption = {
          price: 1,
        };
      }
      //price descending order
      else if (sort === "price_desc") {
        sortOption = {
          price: -1,
        };
      }
      //newest to oldest
      else if (sort === "newest") {
        sortOption = {
          createdAt: -1,
        };
      }

      //oldest to newest
      else if (sort === "oldest") {
        sortOption = {
          createdAt: 1,
        };
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid sort value",
        });
      }
    }

    //------------pagination----------------

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    //page number checking
    if (Number.isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page number.",
      });
    }

    //limit number checking
    if (Number.isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit.",
      });
    }

    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOption)
      .populate("category");

    //total products
    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      success: true,
      currentPage: pageNumber,
      totalPages,
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false, 
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { name, description, price, stock, category, image, brand } = req.body;
  try {
    const updates = {};
    if (name !== undefined) {
      updates.name = name;
    }
    if (description) { 
      updates.description = description;
    }

    if (price !== undefined) {
      updates.price = price;
    }

    if (stock !== undefined) {
      updates.stock = stock;
      updates.isAvailable = stock > 0;
    }
    if (category) {
      updates.category = category;
    }

    if (image) {
      updates.image = image;
    }
    if (brand) {
      updates.brand = brand;
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID.",
        });
      }

      const existingCategory = await Category.findOne({
        _id: category,
        isActive: true,
      });

      if (!existingCategory) {
        return res.status(404).json({ 
          success: false,
          message: "Category not found.",
        });
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update.",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    Object.assign(product, updates);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    if (product.isActive === false) {
      return res.status(409).json({
        success: false,
        message: "Product is already deleted",
      });
    }

    product.isActive = false;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  addProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  
};
