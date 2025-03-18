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



//reservation
router.post("/add-reservation",authToken,addReservation);
module.exports = router;