import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import SummaryApi from '../common'; // Ensure your API is correctly imported
import { useSelector } from 'react-redux';
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const OverviewOrder = () => {
  const [reservations, setReservations] = useState([]); // All reservations
  const [productsCount, setProductsCount] = useState(0); // Number of products in the system
  const [confirmedOrders, setConfirmedOrders] = useState(0); // Number of confirmed orders
  const [pendingOrders, setPendingOrders] = useState(0); // Number of pending orders
  const user = useSelector((state) => state?.user?.user);
  const [timeRange, setTimeRange] = useState('monthly'); // Time range for selection
  const [reservationStats, setReservationStats] = useState({
    notVisited: 0,
    confirmed: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchReservationStats = async () => {
      try {
        const response = await fetch(SummaryApi.getReservationDetails.url);
        const data = await response.json();
        
        const stats = { notVisited: 0, confirmed: 0, rejected: 0 };
        
        // Filter the data after receiving it
        const sellerReservations = data.data.filter(
          (reservation) => reservation.productID.ShopID === user?._id
        );
        
        setReservations(sellerReservations);  // Set filtered reservations

        console.log('API Response:', data); // Log API response to inspect the structure

        if (data.success && data.data) {
          // Populate stats based on the filtered response
          sellerReservations.forEach((reservation) => {
            switch (reservation.ValidateReservation) {
              case 'Not visited':
                stats.notVisited += 1;
                break;
              case 'Confirmed':
                stats.confirmed += 1;
                break;
              case 'Rejected':
                stats.rejected += 1;
                break;
              default:
                break;
            }
          });

          setReservationStats(stats); // Update the state with stats

          // Calculate number of confirmed and pending orders
          setConfirmedOrders(stats.confirmed);
          setPendingOrders(stats.notVisited);
          
          // Optionally, calculate the number of products in the system
          setProductsCount(sellerReservations.length); // Assuming each reservation represents a product
        } else {
          console.error('Invalid data format or empty response:', data);
        }
      } catch (error) {
        console.error('Error fetching reservation stats:', error);
      }
    };

    fetchReservationStats(); // Call fetch function when component mounts
  }, []); // Empty dependency array to run the effect only once on mount
  
  // Bar chart data (Hardcoded)
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Completed Orders',
        data: [500, 300, 400, 600, 200, 700, 800, 900, 1000, 1100, 1200, 1300],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Canceled Orders',
        data: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data (Dynamic)
  const pieData = {
    labels: ['Not visited', 'Confirmed', 'Rejected'],
    datasets: [
      {
        data: [
          reservationStats.notVisited,
          reservationStats.confirmed,
          reservationStats.rejected,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red for Not Visited
          'rgba(255, 159, 132, 0.6)', // Lighter Red for Confirmed
          'rgba(255, 69, 58, 0.6)', // Dark Red for Rejected
        ],
        borderColor: [
         'rgba(255, 99, 132, 1)', // Darker Red for Not Visited
          'rgba(255, 159, 132, 1)', // Darker Lighter Red for Confirmed
          'rgba(255, 69, 58, 1)', // Darker Dark Red for Rejected
        ],
        borderWidth: 1,
      },
    ],
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Order Overview',
      },
    },
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Overview Product</h1>

      {/* Stats Section */}
      <div className="mb-6">
        <div className="text-xl font-semibold mb-2">Product Overview</div>
        <div className="flex gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p><strong>Total Products in System:</strong> {productsCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p><strong>Confirmed Orders:</strong> {confirmedOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p><strong>Pending Orders:</strong> {pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <label className="mr-4">
          <input
            type="radio"
            value="daily"
            checked={timeRange === 'daily'}
            onChange={() => setTimeRange('daily')}
            className="mr-2"
          />
          Daily
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="weekly"
            checked={timeRange === 'weekly'}
            onChange={() => setTimeRange('weekly')}
            className="mr-2"
          />
          Weekly
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="monthly"
            checked={timeRange === 'monthly'}
            onChange={() => setTimeRange('monthly')}
            className="mr-2"
          />
          Monthly
        </label>
        <label>
          <input
            type="radio"
            value="yearly"
            checked={timeRange === 'yearly'}
            onChange={() => setTimeRange('yearly')}
            className="mr-2"
          />
          Yearly
        </label>
      </div>

      {/* Flexbox layout for the charts */}
      <div className="flex justify-between gap-6 mb-6">
        {/* Bar Chart Section (Hardcoded) */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Overview ({timeRange})</h2>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Pie Chart Section (Dynamic) */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Reservation Product Overview</h2>
          {reservationStats.notVisited || reservationStats.confirmed || reservationStats.rejected ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <p>Loading data...</p> // Show loading message if data is not yet loaded
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewOrder;
