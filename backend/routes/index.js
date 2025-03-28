const express = require('express');
const router = express.Router();
const Reservation = require("../models/reservationModel");
const Product = require("../models/productModel");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const authToken = require('../middleware/authToken');
const { getSalesReport, generatePDFReport, generateExcelReport } = require("../controller/finance/financeController");
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
const getReservationDetails=require('../controller/reservation/getreservation')
const updatereservation = require('../controller/reservation/updateReservation');
const getGroupbyReservation =require('../controller/reservation/getGroupbyDetails')
const getOrderDetails=require('../controller/order/getOrderdetails')
const updateorderStatus=require('../controller/order/updateOrderStatus')
const generateBalanceSheet=require('../controller/order/generatebalance')
const createBid=require('../controller/bid/insertBid')
const getBid=require('../controller/bid/getBid')
const getBidbyspecific=require('../controller/bid/getBidbyspecific')
const updateBid=require('../controller/bid/updateBid')
const searchProduct = require('../controller/product/searchProduct');
const getShopdetails=require('../controller/user/shopDetails')
const retreiwLocation=require('../controller/user/retreiwLocation')
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
router.get("/search-products", searchProduct);

// Reservation routes
router.post("/add-reservation", authToken, addReservation, paymentController);
router.post('/webhooks', webhook);
router.post("/add-reservation",authToken,addReservation);
router.get("/get-reservation",getReservationDetails);
router.post("/update-reservation",updatereservation);
router.get("/get-groupby-reservation",getGroupbyReservation);

// Cart routes - all protected by authToken
router.post("/add-to-cart",  addToCartController);
router.get("/countOfAddToCartProduct", authToken, countOfAddToCartProduct);
router.get("/view-cart-product", authToken, async (req, res) => {
    try {
        const cartItems = await CartProduct.find({ userId: req.userId })
            .populate('productId')
            .exec();
        
        // Enhance the cart items with the price for the specific size
        let enhancedCartItems = cartItems.map(item => {
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
//orders
router.get("/get-orders",getOrderDetails);
router.post("/update-order-status",updateorderStatus)
router.get('/generate-balance-sheet',generateBalanceSheet)

//bid
router.post('/create-bid',createBid)
router.get('/get-bid',getBid)
router.get('/get-bid-by-specific',getBidbyspecific)
router.post('/update-bid',updateBid)

//payment
router.post("/create-checkout-session", authToken, paymentController);
router.post("/webhook", webhook);


//financial 
router.get("/sales-report", getSalesReport);  
router.get("/download/pdf", generatePDFReport);  
router.get("/download/excel", generateExcelReport);  


router.get("/summary-reserve", async (req, res) => {
    try {
        const reservations = await Reservation.find().populate("userID").populate("productID");

        let totalRevenue = 0;
        let totalReservations = reservations.length;
        let statusCounts = { NotVisited: 0, Confirmed: 0, Rejected: 0 };

        for (const resv of reservations) {
            if (resv.ValidateReservation) {
                statusCounts[resv.ValidateReservation] = (statusCounts[resv.ValidateReservation] || 0) + 1;
            }
            const product = resv.productID;
            if (product) {
                const sizeDetail = product.Size.find(s => s.size === resv.size);
                if (sizeDetail) {
                    totalRevenue += resv.Quantity * sizeDetail.price;
                }
            }
        }

        res.json({ totalRevenue, totalReservations, statusCounts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export reservations to Excel
router.get("/export-reserve-excel", async (req, res) => {
    try {
        const reservations = await Reservation.find().populate("userID").populate("productID");
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Financial Report");

        worksheet.columns = [
            { header: "Reservation ID", key: "ReservationID", width: 20 },
            { header: "Customer Name", key: "CustomerName", width: 20 },
            { header: "Product ID", key: "productID", width: 20 },
            { header: "Size", key: "Size", width: 10 },
            { header: "Quantity", key: "Quantity", width: 10 },
            { header: "Total Price", key: "TotalPrice", width: 15 },
            { header: "Reservation Date", key: "ReservationDate", width: 15 },
            { header: "Validation Status", key: "ValidateReservation", width: 15 }
        ];

        for (const resv of reservations) {
            const product = resv.productID;
            let totalPrice = 0;
            if (product) {
                const sizeDetail = product.Size.find(s => s.size === resv.size);
                if (sizeDetail) {
                    totalPrice = resv.Quantity * sizeDetail.price;
                }
            }
            worksheet.addRow({
                ReservationID: resv.ReservationID,
                CustomerName: resv.userID ? resv.userID.name : "N/A",
                productID: resv.productID ? resv.productID._id : "N/A",
                Size: resv.size,
                Quantity: resv.Quantity,
                TotalPrice: totalPrice,
                ReservationDate: resv.ReservationDate,
                ValidateReservation: resv.ValidateReservation
            });
        }

        res.setHeader("Content-Disposition", "attachment; filename=Financial_Report.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export reservations to PDF
router.get("/export-pdf-reserve", async (req, res) => {
    try {
        const reservations = await Reservation.find().populate("userID").populate("productID");
        const doc = new PDFDocument();

        res.setHeader("Content-Disposition", "attachment; filename=Financial_Report.pdf");
        res.setHeader("Content-Type", "application/pdf");

        doc.pipe(res);
        doc.fontSize(16).text("Financial Report", { align: "center" });
        doc.moveDown();

        let groupedReservations = { NotVisited: [], Confirmed: [], Rejected: [] };

        for (const resv of reservations) {
            const product = resv.productID;
            let totalPrice = 0;
            if (product) {
                const sizeDetail = product.Size.find(s => s.size === resv.size);
                if (sizeDetail) {
                    totalPrice = resv.Quantity * sizeDetail.price;
                }
            }

            let reservationInfo = `Reservation ID: ${resv.ReservationID}\n`
                + `Customer Name: ${resv.userID ? resv.userID.name : "N/A"}\n`
                + `Product ID: ${resv.productID ? resv.productID._id : "N/A"}\n`
                + `Size: ${resv.size}\n`
                + `Quantity: ${resv.Quantity}\n`
                + `Total Price: ${totalPrice}\n`
                + `Reservation Date: ${resv.ReservationDate}\n`;

            if (resv.ValidateReservation) {
                groupedReservations[resv.ValidateReservation].push(reservationInfo);
            }
        }

        for (let [status, reservations] of Object.entries(groupedReservations)) {
            doc.fontSize(14).text(status, { underline: true });
            doc.moveDown();
            reservations.forEach(info => {
                doc.fontSize(12).text(info);
                doc.moveDown();
            });
        }

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//shop details
router.get("/get-shop-details",getShopdetails)
router.get("/get-seller-location",retreiwLocation)
module.exports = router;