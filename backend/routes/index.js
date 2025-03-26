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
const getReservationDetails=require('../controller/reservation/getreservation')
const updatereservation = require('../controller/reservation/updateReservation');
const getGroupbyReservation =require('../controller/reservation/getGroupbyDetails')
const getOrderDetails=require('../controller/order/getOrderdetails')
const updateorderStatus=require('../controller/order/updateOrderStatus')
const generateBalanceSheet=require('../controller/order/generatebalance')


router.post("/Signup", userSignUpController);
router.post("/signin", userSigninController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);

// admin panel
router.get("/all-user", authToken, allUsers);
router.post("/update-user", authToken, updateUser);

// product upload
router.post("/upload-product", authToken, uploadProductController);
router.get("/get-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getproductDetails);
router.post("/delete-product", deleteProductController);
router.get("/all-product-seller", getSellerProduct);


//reservation
router.post("/add-reservation",authToken,addReservation);
router.get("/get-reservation",getReservationDetails);
router.post("/update-reservation",updatereservation);
router.get("/get-groupby-reservation",getGroupbyReservation);


//orders 
router.get("/get-orders",getOrderDetails);
router.post("/update-order-status",updateorderStatus)
router.get('/generate-balance-sheet',generateBalanceSheet)
module.exports = router;


