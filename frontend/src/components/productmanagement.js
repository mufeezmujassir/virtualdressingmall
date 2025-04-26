import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryApi from '../common';
import { useSelector } from "react-redux";
const ProductManagement = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'inventory'
  const [inventoryUpdate, setInventoryUpdate] = useState({ size: '', quantity: 0 });
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    category: '',
    gender: '',
    seller: '',
  });
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    Gender: '',
    price: 0,
    discount: 0,
    ShopID: '',
    Size: [],
    images: [],
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products with optional filters
  const fetchProducts = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(searchFilters).filter(([_, value]) => value)
      );
      
      const response = await axios.get(SummaryApi.getAllProductdetails.url, { params });
      setProducts(response.data.data);
    } catch (error) {
      showNotification(`Error fetching products: ${error.message}`, 'error');
    }
  };

  // Handle search filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchFilters({
      keyword: '',
      category: '',
      gender: '',
      seller: '',
    });
    fetchProducts();
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add new size to product
  const addSize = () => {
    const newSize = { size: '', quantity: 0, price: 0 };
    setFormData(prev => ({ ...prev, Size: [...prev.Size, newSize] }));
  };

  // Update size information
  const updateSizeInfo = (index, field, value) => {
    const updatedSizes = [...formData.Size];
    updatedSizes[index][field] = field === 'size' ? value : Number(value);
    setFormData(prev => ({ ...prev, Size: updatedSizes }));
  };

  // Remove size from product
  const removeSize = (index) => {
    const updatedSizes = formData.Size.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, Size: updatedSizes }));
  };

  // Add image URL to product
  const addImageUrl = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  // Update image URL
  const updateImageUrl = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  // Remove image URL
  const removeImageUrl = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  // Open modal for adding new product
  const openAddModal = () => {
    setFormData({
      productName: '',
      description: '',
      category: '',
      Gender: '',
      price: 0,
      discount: 0,
      ShopID: '',
      Size: [],
      images: [],
    });
    setModalMode('add');
    setIsModalOpen(true);
  };

  // Open modal for editing product
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description,
      category: product.category,
      Gender: product.Gender,
      price: product.price,
      discount: product.discount,
      ShopID: product.ShopID?._id || product.ShopID,
      Size: product.Size || [],
      images: product.images || [],
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Open modal for updating inventory
  const openInventoryModal = (product) => {
    setSelectedProduct(product);
    setInventoryUpdate({ size: product.Size?.[0]?.size || '', quantity: 0 });
    setModalMode('inventory');
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'add') {
        const response = await axios.post(SummaryApi.addProduct.url, formData);
        setProducts(prev => [...prev, response.data.data]);
        showNotification('Product added successfully');
      } else if (modalMode === 'edit') {
        const response = await axios.put(`/api/products/${selectedProduct._id}`, formData);
        setProducts(prev => 
          prev.map(item => item._id === selectedProduct._id ? response.data.data : item)
        );
        showNotification('Product updated successfully');
      } else if (modalMode === 'inventory') {
        const response = await axios.put(
          `/api/products/${selectedProduct._id}/inventory`, 
          inventoryUpdate
        );
        setProducts(prev => 
          prev.map(item => item._id === selectedProduct._id ? response.data.data : item)
        );
        showNotification('Inventory updated successfully');
      }
      
      closeModal();
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        setProducts(prev => prev.filter(item => item._id !== productId));
        showNotification('Product deleted successfully');
      } catch (error) {
        showNotification(`Error deleting product: ${error.message}`, 'error');
      }
    }
  };

  // View product details
  const viewProductDetails = async (productId) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      setSelectedProduct(response.data.data);
      // Here you could navigate to a details page or show a modal
      // For now, we'll just log the details
      console.log('Product Details:', response.data.data);
    } catch (error) {
      showNotification(`Error fetching product details: ${error.message}`, 'error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">Product Management</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Search & Filters</h2>
        <form onSubmit={applyFilters} className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-fit">
            <input
              type="text"
              name="keyword"
              value={searchFilters.keyword}
              onChange={handleFilterChange}
              placeholder="Search by name"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div className="flex-1 min-w-fit">
            <select
              name="category"
              value={searchFilters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessories">Accessories</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-fit">
            <select
              name="gender"
              value={searchFilters.gender}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-fit">
            <input
              type="text"
              name="seller"
              value={searchFilters.seller}
              onChange={handleFilterChange}
              placeholder="Seller ID"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply
            </button>
            <button 
              type="button" 
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      
      {/* Add Product Button */}
      <div className="mb-6">
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Product
        </button>
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Gender</th>
              <th className="py-2 px-4 text-right">Price</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{product.productName}</td>
                  <td className="py-2 px-4">{product.category}</td>
                  <td className="py-2 px-4">{product.Gender}</td>
                  <td className="py-2 px-4 text-right">
                    ${product.price.toFixed(2)}
                    {product.discount > 0 && (
                      <span className="ml-2 text-sm text-red-500">
                        -{product.discount}%
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => viewProductDetails(product._id)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => openEditModal(product)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => openInventoryModal(product)}
                        className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                      >
                        Inventory
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No products found. Add some products or adjust your search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal for Add/Edit/Inventory */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalMode === 'add' && 'Add New Product'}
                {modalMode === 'edit' && 'Edit Product'}
                {modalMode === 'inventory' && 'Update Inventory'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Add/Edit Product Form */}
              {(modalMode === 'add' || modalMode === 'edit') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-1 font-medium">Product Name</label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select Category</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Electronics">Electronics</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium">Gender</label>
                      <select
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select Gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium">Shop ID</label>
                      <input
                        type="text"
                        name="ShopID"
                        value={formData.ShopID}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium">Base Price ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-medium">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border rounded"
                    ></textarea>
                  </div>
                  
                  {/* Sizes Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium">Sizes & Inventory</label>
                      <button 
                        type="button" 
                        onClick={addSize}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        Add Size
                      </button>
                    </div>
                    
                    {formData.Size.length > 0 ? (
                      <div className="space-y-2">
                        {formData.Size.map((size, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={size.size}
                              onChange={(e) => updateSizeInfo(index, 'size', e.target.value)}
                              placeholder="Size (e.g. S, M, L)"
                              className="flex-1 px-3 py-2 border rounded"
                            />
                            <input
                              type="number"
                              value={size.quantity}
                              onChange={(e) => updateSizeInfo(index, 'quantity', e.target.value)}
                              placeholder="Quantity"
                              min="0"
                              className="flex-1 px-3 py-2 border rounded"
                            />
                            <input
                              type="number"
                              value={size.price}
                              onChange={(e) => updateSizeInfo(index, 'price', e.target.value)}
                              placeholder="Price Modifier"
                              className="flex-1 px-3 py-2 border rounded"
                            />
                            <button 
                              type="button" 
                              onClick={() => removeSize(index)}
                              className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No sizes added yet. Click "Add Size" to add inventory.</p>
                    )}
                  </div>
                  
                  {/* Images Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium">Images</label>
                      <button 
                        type="button" 
                        onClick={addImageUrl}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        Add Image URL
                      </button>
                    </div>
                    
                    {formData.images.length > 0 ? (
                      <div className="space-y-2">
                        {formData.images.map((url, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => updateImageUrl(index, e.target.value)}
                              placeholder="Image URL"
                              className="flex-1 px-3 py-2 border rounded"
                            />
                            <button 
                              type="button" 
                              onClick={() => removeImageUrl(index)}
                              className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No images added yet. Click "Add Image URL" to add product images.</p>
                    )}
                  </div>
                </>
              )}
              
              {/* Inventory Update Form */}
              {modalMode === 'inventory' && (
                <div className="space-y-4">
                  <p>Update inventory for: <strong>{selectedProduct?.productName}</strong></p>
                  
                  <div>
                    <label className="block mb-1 font-medium">Size</label>
                    <select
                      value={inventoryUpdate.size}
                      onChange={(e) => setInventoryUpdate(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="">Select Size</option>
                      {selectedProduct?.Size?.map((size) => (
                        <option key={size.size} value={size.size}>
                          {size.size} (Current: {size.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium">New Quantity</label>
                    <input
                      type="number"
                      value={inventoryUpdate.quantity}
                      onChange={(e) => setInventoryUpdate(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      min="0"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {modalMode === 'add' && 'Add Product'}
                  {modalMode === 'edit' && 'Save Changes'}
                  {modalMode === 'inventory' && 'Update Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal (optional, could be shown when "View" is clicked) */}
      {selectedProduct && !isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product Details</h2>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Images */}
              <div>
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.productName} 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=No+Image'; e.target.onerror = null;}}
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
                
                {/* Thumbnail images */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {selectedProduct.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded">
                        <img 
                          src={img} 
                          alt={`${selectedProduct.productName} ${i+1}`} 
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {e.target.src = 'https://via.placeholder.com/100?text=Error'; e.target.onerror = null;}}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Information */}
              <div>
                <h3 className="text-xl font-bold mb-2">{selectedProduct.productName}</h3>
                
                <div className="mb-4">
                  <p className="text-lg font-semibold">
                    ${selectedProduct.price?.toFixed(2)}
                    {selectedProduct.discount > 0 && (
                      <span className="ml-2 text-sm text-red-500">
                        -{selectedProduct.discount}% OFF
                      </span>
                    )}
                  </p>
                  
                  {selectedProduct.discount > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      Original: ${(selectedProduct.price * (1 + selectedProduct.discount/100)).toFixed(2)}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700">{selectedProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p>{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p>{selectedProduct.Gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shop</p>
                    <p>{selectedProduct.ShopID?.name || selectedProduct.ShopID}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Available Sizes</p>
                  {selectedProduct.Size && selectedProduct.Size.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.Size.map((size) => (
                        <div 
                          key={size.size}
                          className={`px-3 py-1 border rounded text-sm ${
                            size.quantity > 0 ? 'border-green-500 text-green-500' : 'border-red-300 text-red-300'
                          }`}
                        >
                          {size.size} ({size.quantity})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No size information available</p>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      openEditModal(selectedProduct);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;