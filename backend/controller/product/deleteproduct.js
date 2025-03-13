const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function deleteProductController(req, res) {
    try {
        

        const { _id } = req.body;
        console.log("Delete Product ID:", _id);

        const deletedProduct = await productModel.findByIdAndDelete(_id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Product Deleted Successfully",
            error: false,
            success: true,
            data: deletedProduct
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "Error deleting product",
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController;