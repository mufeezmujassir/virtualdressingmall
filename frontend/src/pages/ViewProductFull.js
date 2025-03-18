import React, { useState, useEffect } from "react";
import SummaryApi from "../common";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Product from "../components/ProductPage";

const ProductPage = () => {
  const user = useSelector((state) => state?.user?.user);
  const { id } = useParams();
  console.log("Product ID:", id);

  const [allProduct, setAllProduct] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);

  const fetchAllProduct = async () => {
    try {
      const response = await fetch(SummaryApi.allProduct.url);
      const dataResponse = await response.json();

      console.log("Product Data:", dataResponse);

      if (Array.isArray(dataResponse?.data)) {
        setAllProduct(dataResponse.data);
      } else {
        console.error("Unexpected data format:", dataResponse);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAllProduct();
    }
  }, [user?._id]); // Fetch products when user is available

  useEffect(() => {
    // Filter the products by the ID from URL params
    const filtered = allProduct.filter((product) => product._id === id);
    setFilteredProduct(filtered);
  }, [allProduct, id]); // Run filtering whenever `allProduct` or `id` changes

  return (
    <div className="max-w-8xl mx-auto p-6 grid gap-12">
  {filteredProduct.map((product, index) => (
    <div key={index} className="border rounded-lg shadow-sm p-4">
      <Product data={product} fetchdata={fetchAllProduct} />
    </div>
  ))}
</div>

  );
};

export default ProductPage;
