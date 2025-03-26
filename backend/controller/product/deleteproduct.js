const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');
const orderModel = require('../../models/orderModel'); // Assuming you have this model
const reservationModel = require('../../models/reservationModel'); // Reservation model

async function deleteProductController(req, res) {
    try {
        const { _id } = req.body;
        console.log("Delete Product ID:", _id);

        // Delete the product from the product model
        const deletedProduct = await productModel.findByIdAndDelete(_id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Delete all orders that reference this product
        await orderModel.deleteMany({ productID: _id });

        // Delete all reservations that reference this product
        await reservationModel.deleteMany({ productID: _id });

        res.json({
            message: "Product and related data (orders, reservations) deleted successfully",
            error: false,
            success: true,
            data: deletedProduct
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: err.message || "Error deleting product",
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController;
