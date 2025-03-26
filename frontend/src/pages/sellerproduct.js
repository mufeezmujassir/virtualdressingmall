import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import SellerProductCard from '../components/SellerProductCard';
import { useSelector } from 'react-redux';

const SellerProduct = () => {
  const user = useSelector((state) => state?.user?.user);

  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    try {
      const response = await fetch(SummaryApi.allProductSeller.url);
      const dataResponse = await response.json();

      console.log('product data', dataResponse);

      // Ensure dataResponse.data is an array
      if (Array.isArray(dataResponse?.data)) {


        // Filter the products by ShopID
        const filteredProducts = dataResponse.data.filter(product => product.ShopID === user?._id);
        setAllProduct(filteredProducts);
      } else {
        console.error('Unexpected data format:', dataResponse);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAllProduct();
    }
  }, [user?._id]); // Refetch when the user._id changes

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>Product</h2>
        <button
          className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full'
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/**all product */}
      <div className='flex items-start flex-wrap gap-2 py-2 '>
        {allProduct.map((product, index) => (
          <SellerProductCard data={product} key={index + 'allProduct'} fetchdata={fetchAllProduct} />
        ))}
      </div>

      {/**upload product component */}
      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default SellerProduct;