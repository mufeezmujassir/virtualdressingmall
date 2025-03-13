import React from 'react';
import { FaThumbsUp, FaMapMarkerAlt, FaStore, FaShareAlt } from 'react-icons/fa';

const ShopDetails = () => {
  const shops = [
    { id: 1, imageUrl: '/hello.jpg' },
    { id: 2, imageUrl: '/hello.jpg' },
    { id: 3, imageUrl: '/hello.jpg' },
    { id: 4, imageUrl: '/hello.jpg' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {shops.map(shop => (
        <div key={shop.id} className="shop-card border rounded-lg overflow-hidden shadow-lg">
          <div className="shop-image">
            <img src={shop.imageUrl} alt={`Shop ${shop.id}`} className="w-full h-auto" />
          </div>
          <div><h1><b>Shop Name : Fashion bug</b></h1></div>
          <div className="shop-actions flex justify-around p-2">
            <button className="action-button flex items-center space-x-1">
              <FaThumbsUp />
              <span>Like</span>
            </button>
            <button className="action-button flex items-center space-x-1">
              <FaMapMarkerAlt />
              <span>Map</span>
            </button>
            <button className="action-button flex items-center space-x-1">
              <FaStore />
              <span>Go To Shop</span>
            </button>
            <button className="action-button flex items-center space-x-1">
              <FaShareAlt />
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopDetails;
