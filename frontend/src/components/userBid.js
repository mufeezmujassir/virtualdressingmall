import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';

const ViewBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch bids from the backend
  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await axios.get(SummaryApi.getBid.url); // Make sure this is the correct API endpoint
      if (response.data.success) {
        setBids(response.data.data);
      } else {
        toast.error('Failed to fetch bids');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching bids');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  // Handle placing a bid
  const placeBid = (productID) => {
    navigate(`/placeBid/${productID}`); // Navigate to placeBid page with productId
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Available Bids</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.length > 0 ? (
            bids.map((bid) => (
              <div key={bid._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="relative">
                  {/* Product Image */}
                  <img
                    src={bid.productID.productImage[0] || '/default-image.jpg'}
                    alt={bid.productID.productName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 m-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs">
                    {new Date(bid.closeDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{bid.productID.productName}</h3>
                  <p className="mt-2"><strong>Start Price:</strong> ${bid.startPrice}</p>
                    
                  <button
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => placeBid(bid.productID._id)}
                  >
                    Place a Bid
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No bids available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewBids;
