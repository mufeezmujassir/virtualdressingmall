import React, { useState, useEffect } from "react";
import ResrvationModel from "../components/Reservation";
const ProductPage = ({ data }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [activePrice, setActivePrice] = useState(0);
  const [showReservationModal, setShowReservationModal] = useState(false);

  useEffect(() => {
    if (data) {
      setMainImage(data.productImage?.[0] || "/default.jpg");
      setActivePrice(data.DiscoutPercentage
        ? (data.Size[0]?.price * (1 - data.DiscoutPercentage / 100))
        : data.Size[0]?.price || 0
      );
    }
  }, [data]);

  const handleSizeSelect = (sizeObj) => {
    setSelectedSize(sizeObj.size);
    const discountedPrice = sizeObj.price * (1 - (data.DiscoutPercentage || 0) / 100);
    setActivePrice(discountedPrice);
  };

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left - Vertical Image Gallery */}
      <div className="flex">
        <div className="flex flex-col space-y-4 mr-4">
          {(data.productImage || []).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              className={`w-20 h-20 object-cover border rounded cursor-pointer hover:border-black ${
                img === mainImage ? "border-black" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
        <img
          src={mainImage}
          alt={data.productName || "Product Image"}
          className="w-full object-contain rounded-lg max-h-[500px]"
        />
      </div>

      {/* Right - Product Details */}
      <div className="flex flex-col">
        <h2 className="text-4xl font-bold mb-2">{data.productName}</h2>
        <p className="text-gray-500 text-lg mb-4">{data.brandName}</p>

        {/* Dynamic Price */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-3xl font-bold text-rose-600">
            Rs.{activePrice.toFixed(2)}
          </span>
          {selectedSize && (
            <span className="text-gray-500 text-base">
              (Size: {selectedSize})
            </span>
          )}
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Available Colors: {data.color || "N/A"}</h3>
          <div className="flex space-x-3">
            {(data.availableColors || []).map((color, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                  color === data.color ? "border-black" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 mt-4">
          <p>Gender: {data.Gender}</p>
          <p>Pattern: {data.Pattern}</p>
          <p>Fit Type: {data.FitType}</p>
          <p>Seasonal Collection: {data.seasonalCollection}</p>
          <br/>
        </div>
        {/* Size selection with price update */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Size</h3>
          <div className="flex flex-wrap gap-4">
            {(data.Size || []).map((sizeObj, index) => (
              <button
                key={index}
                onClick={() => handleSizeSelect(sizeObj)}
                className={`px-4 py-2 border rounded ${
                  selectedSize === sizeObj.size ? "bg-rose-600 text-white" : "bg-gray-100"
                }`}
              >
                {sizeObj.size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <button 
            className="bg-red-600 hover:bg-red-700 transition-all text-white text-base px-4 py-2 rounded-3xl w-1/2"
          >
            Add to Cart
          </button>
         <button
            onClick={() => setShowReservationModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-base px-4 py-2 rounded-3xl w-1/2"
          >
            Make Reservation
          </button>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {data.description || "No description available."}
          </p>
          
        </div>
      </div>
      {showReservationModal && (
        <ResrvationModel
          product={data}
          onClose={() => setShowReservationModal(false)}
        />
      )}
    </div>
  );
};

export default ProductPage;
