const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authToken');

const userSignUpController = require('../controller/user/userSignUp');
const userSigninController = require('../controller/user/userSignin');
const userDetailsController = require('../controller/user/userDetails');
const userLogout = require('../controller/user/userLogout');
const allUsers = require('../controller/user/allUsers');
const updateUser = require('../controller/user/updateUser');
const uploadProductController = require('../controller/product/uploadProduct');
const getProductController = require('../controller/product/getProduct');
const updateProductController = require('../controller/product/updateProduct');
const getCategoryProduct = require('../controller/product/getCategoryProductOne');
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct');
const getproductDetails = require('../controller/product/getProductDetails');
const deleteProductController = require('../controller/product/deleteProduct');
const addReservation = require('../controller/reservation/addreservation');
const getSellerProduct=require('../controller/product/getSellerProduct');
const paymentController = require('../controller/order/paymentController');
const webhook = require('../controller/order/webhook');
const addToCartController = require('../controller/user/addToCartController');
const countOfAddToCartProduct = require('../controller/user/countOfAddToCartProduct');
const CartProduct = require("../models/cartProduct");
const searchProduct = require('../controller/product/searchProduct');

// Auth routes
router.post("/Signup", userSignUpController);
router.post("/signin", userSigninController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);

// Admin routes
router.get("/all-user", authToken, allUsers);
router.post("/update-user", authToken, updateUser);

// Product routes
router.post("/upload-product", authToken, uploadProductController);
router.get("/get-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getproductDetails);
router.post("/delete-product", deleteProductController);
router.get("/all-product-seller", getSellerProduct);
router.get("/search-products", searchProduct);

// Reservation routes
router.post("/add-reservation", authToken, addReservation, paymentController);
router.post('/webhooks', webhook);

// Cart routes - all protected by authToken
router.post("/add-to-cart",  addToCartController);
router.get("/countOfAddToCartProduct", authToken, countOfAddToCartProduct);
router.get("/view-cart-product", authToken, async (req, res) => {
    try {
        const cartItems = await CartProduct.find({ userId: req.userId })
            .populate('productId')
            .exec();
        
        // Enhance the cart items with the price for the specific size
        const enhancedCartItems = cartItems.map(item => {
            const cartItem = item.toObject();
            
            // Find the price for the specific size
            if (cartItem.productId && cartItem.productId.Size && Array.isArray(cartItem.productId.Size)) {
                const sizeInfo = cartItem.productId.Size.find(s => s.size === cartItem.size);
                if (sizeInfo && sizeInfo.price) {
                    // Add a sellingPrice field to the productId object
                    cartItem.productId.sellingPrice = sizeInfo.price;
                }
            }
            
            return cartItem;
        });
        
        res.json({
            success: true,
            data: enhancedCartItems,
            message: "Cart items retrieved successfully"
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart items",
            error: error.message
        });
    }
});

// Protected cart count endpoint
router.get("/count-of-cart", authToken, async (req, res) => {
    try {
        const count = await CartProduct.countDocuments({ userId: req.userId });
        res.json({ 
            success: true,
            data: { count },
            message: "Cart count retrieved successfully"
        });
    } catch (error) {
        console.error('Error getting cart count:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get cart count",
            error: error.message
        });
    }
});

// Delete cart item endpoint
router.post("/delete-cart-product", authToken, async (req, res) => {
    try {
        const { _id } = req.body;
        
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Missing cart item ID",
                error: "Cart item ID is required"
            });
        }
        
        console.log("Attempting to delete cart item:", _id, "for user:", req.userId);
        
        const deletedItem = await CartProduct.findOneAndDelete({
            _id: _id,
            userId: req.userId
        });
        
        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found or you don't have permission to delete it",
                error: "Item not found"
            });
        }
        
        res.json({
            success: true,
            message: "Item removed from cart successfully",
            data: deletedItem
        });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({
            success: false,
            message: "Failed to remove item from cart",
            error: error.message
        });
    }
});

// Update cart item quantity endpoint
router.post("/update-cart-product", authToken, async (req, res) => {
    try {
        const { _id, quantity } = req.body;
        
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Missing cart item ID",
                error: "Cart item ID is required"
            });
        }
        
        if (quantity === undefined || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity. Quantity must be at least 1.",
                error: "Invalid quantity"
            });
        }
        
        console.log("Updating cart item quantity:", _id, "to:", quantity, "for user:", req.userId);
        
        const updatedItem = await CartProduct.findOneAndUpdate(
            { _id: _id, userId: req.userId },
            { quantity: quantity },
            { new: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found or you don't have permission to update it",
                error: "Item not found"
            });
        }
        
        res.json({
            success: true,
            message: "Cart item quantity updated successfully",
            data: updatedItem
        });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update quantity",
            error: error.message
        });
    }
});

// Payment routes
router.post("/create-checkout-session", authToken, paymentController);
router.post("/webhook", webhook);

module.exports = router;