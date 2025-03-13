const productModel = require('../../models/productModel')


const getCategoryWiseProduct = async (req,res) => {
    try {
        const {category}= req?.body || req?.query
        const product = await productModel.find({category})


        res.json({
            data : product,
            message : "Product by category",
            error : false,
            success : true
        })
        
    } catch (err) {

        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
        
    }
}

module.exports = getCategoryWiseProduct