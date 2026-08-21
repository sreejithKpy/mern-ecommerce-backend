const { default: mongoose } = require("mongoose");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const createOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const address = await Address.findOne({
      user: userId,
      isDefault: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Default address not found.",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available.",
        });
      }

      totalAmount += item.quantity * item.product.price;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: address._id,
      totalAmount,
    });

    for (const item of cart.items) {
      item.product.stock -= item.quantity;

      await item.product.save();
    }

    cart.items = [];

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({
      user: userId,
    })
      .populate("items.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No orders found.",
        orders: [],
      });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: userId,
    })
      .populate("items.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.orderStatus === "Shipped" ||
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled.",
      });
    }

    for (const item of order.items) {
      item.product.stock += item.quantity;

      await item.product.save();
    }

    order.orderStatus = "Cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const allowedStatus = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Already delivered orders cannot be changed
    if(order.orderStatus === "Delivered"){
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be changed."
      })
    }

    //Already cancelled orders cannot be changed
    if(order.orderStatus === "Cancelled"){
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be changed."
      })
    }

    //satus flow
    const statusFlow = {
      Pending: ["Confirmed", "Cancelled"],
      Confiremd: ["Shipped", "Cancelled"],
      Shipped: ["Devlivered", "Cancelled"]
    }

    const allowedNextStatuses = statusFlow[order.orderStatus] || [];

    if(!allowedNextStatuses.includes(orderStatus)){
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from ${order.orderStatus} from ${orderStatus}.`
      })
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
