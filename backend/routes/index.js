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
        
        res.json({
            success: true,
            data: cartItems,
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

module.exports = router;