const Product = require('../../models/productModel');
const User = require('../../models/userModel');

/**
 * View all products with optional search and filter
 */
const getAllProducts = async (req, res) => {
  try {
    const { category, seller, gender, keyword } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (seller) filter.ShopID = seller;
    if (gender) filter.Gender = gender;
    if (keyword) filter.productName = { $regex: keyword, $options: 'i' };

    const products = await Product.find(filter).populate('ShopID', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * View product details by ID
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('ShopID', 'name email location');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Error fetching product details:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * Add new product
 */
const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    return res.status(201).json({ success: true, message: 'Product added', data: saved });
  } catch (err) {
    console.error('Error adding product:', err);
    return res.status(400).json({ success: false, message: 'Failed to add product', error: err.message });
  }
};

/**
 * Update product by ID
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({ success: true, message: 'Product updated', data: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(400).json({ success: false, message: 'Failed to update product', error: err.message });
  }
};

/**
 * Delete product by ID
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(400).json({ success: false, message: 'Failed to delete product', error: err.message });
  }
};

/**
 * Update inventory quantities for a product (by size)
 */
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { size, quantity } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const sizeEntry = product.Size.find(s => s.size === size);
    if (sizeEntry) {
      sizeEntry.quantity = quantity;
    } else {
      product.Size.push({ size, quantity, price: 0 });
    }

    await product.save();
    return res.status(200).json({ success: true, message: 'Inventory updated', data: product });
  } catch (err) {
    console.error('Error updating inventory:', err);
    return res.status(400).json({ success: false, message: 'Failed to update inventory', error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  updateInventory
};
