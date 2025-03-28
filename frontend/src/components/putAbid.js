import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import SummaryApi from '../common/index'; // Assuming this file contains your API endpoints

const PutABid = () => {
  const user = useSelector((state) => state?.user?.user); // Fix user state access
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products for the logged-in user
  const fetchAllProduct = async () => {
    try {
      setLoading(true);
      console.log('Fetching products for user:', user?._id);

      if (!user?._id) {
        toast.error('User not found');
        return;
      }

      const response = await axios.get(SummaryApi.allProduct.url);
      console.log('API Response:', response.data);

      if (response.data.success) {
        // Filter products for the current seller
        const sellerProducts = response.data.data.filter(product => 
          product.ShopID._id === user._id // Fix ShopID comparison
        );
        console.log('Filtered products for seller:', sellerProducts);
        setProducts(sellerProducts);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      console.log('User ID found, fetching products...');
      fetchAllProduct();
    } else {
      console.log('No user ID found');
    }
  }, [user?._id]);

  // Submit bid data
  const handleBidSubmit = async (formData) => {
    try {
      setLoading(true);

      const bidData = {
        productID: formData.productID,
        startPrice: formData.startPrice,
        closeDate: formData.closeDate,
        bidder: [], // No bidders initially
      };

      const response = await axios.post(SummaryApi.createBid.url, bidData);

      if (response.data.success) {
        toast.success('Bid created successfully!');
        reset();
        navigate('/');
      } else {
        toast.error(response.data.message || 'Error creating bid');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error submitting bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Put a Bid</h2>
      <form onSubmit={handleSubmit(handleBidSubmit)} className="space-y-4">
        {/* Product selection dropdown */}
        <div>
          <label className="block mb-1">Select Product</label>
          <select
            {...register('productID', { required: 'Product is required' })}
            className="w-full border p-2 rounded"
            disabled={loading}
          >
            <option value="">-- Select Product --</option>
            {products && products.length > 0 ? (
              products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productName} (Price: {product.Size?.[0]?.price || 'N/A'})
                </option>
              ))
            ) : (
              <option value="" disabled>No products available</option>
            )}
          </select>
          {errors.productID && <p className="text-red-500 text-sm">{errors.productID.message}</p>}
        </div>

        {/* Start Price input */}
        <div>
          <label className="block mb-1">Start Price</label>
          <input
            type="number"
            {...register('startPrice', { 
              required: 'Start price is required',
              min: { value: 0, message: 'Price must be greater than 0' }
            })}
            className="w-full border p-2 rounded"
            disabled={loading}
          />
          {errors.startPrice && <p className="text-red-500 text-sm">{errors.startPrice.message}</p>}
        </div>

        {/* Close Date input */}
        <div>
          <label className="block mb-1">Close Date</label>
          <input
            type="date"
            {...register('closeDate', { 
              required: 'Close date is required',
              min: { 
                value: new Date().toISOString().split('T')[0],
                message: 'Close date must be in the future'
              }
            })}
            className="w-full border p-2 rounded"
            disabled={loading}
          />
          {errors.closeDate && <p className="text-red-500 text-sm">{errors.closeDate.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:bg-blue-300"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
};

export default PutABid;
