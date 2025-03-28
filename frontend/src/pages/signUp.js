import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "react-modal";
import loginIcons from "../assest/signin.gif";
import imageTobase64 from "../helpers/imageTobase65";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import L from "leaflet";
import debounce from 'lodash.debounce';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function UpdateMapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const SignUp = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [location, setLocation] = useState({ lat: 6.9271, lng: 79.8612, address: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [data, setData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    profilePic: '',
    role: '',
    location: { lat: 6.9271, lng: 79.8612 } // Ensure location object matches schema
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const navigate = useNavigate();

  data.role = isSeller ? 'SELLER' : 'GENERAL';

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'confirmPassword' || name === 'password') {
      setPasswordMatch(data.password === value || data.confirmPassword === value);
    }
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imagePic = await imageTobase64(file);
    setData((prevData) => ({
      ...prevData,
      profilePic: imagePic,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
  
    if (!data.location.address) {
      toast.error("Please select a valid address.");
      return;
    }
  
    try {
      const response = await fetch(SummaryApi.SignUP.url, {
        method: SummaryApi.SignUP.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          profilePic: data.profilePic,
          role: data.role,
          location: data.location // Send location as object with lat and lng
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        navigate('/login');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleRoleChange = (role) => {
    setIsSeller(role === 'SELLER');
    setData((prevData) => ({
      ...prevData,
      role: role,
    }));
  };

  const debouncedSearch = debounce(async (query) => {
    if (!query) return;
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const results = await response.json();
      setSearchResults(results);
      if (results.length > 0) {
        setLocation({
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
          address: results[0].display_name
        });
        setMapKey(prev => prev + 1); // Force map re-render
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast.error("Failed to search location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, 500);

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleLocationSelect = (result) => {
    const selectedAddress = result.display_name;
    const newLocation = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: selectedAddress
    };
    setLocation(newLocation);
    setData((prevData) => ({
      ...prevData,
      location: newLocation, // Update location in data
    }));
    setMapKey(prev => prev + 1); // Force map re-render
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then((res) => res.json())
          .then((data) => {
            const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setLocation({ lat, lng, address });
            setData(prev => ({ ...prev, location: { lat, lng, address } }));
          })
          .catch(err => {
            console.error("Error getting address:", err);
            setLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
            setData(prev => ({ ...prev, location: { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` } }));
          });
      },
    });
    return location ? <Marker position={[location.lat, location.lng]} /> : null;
  }

  return (
    <section id="signup" className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 w-full max-w-sm mx-auto shadow-lg rounded-lg">
        <h2 className="text-center text-xl font-bold text-gray-700 mb-4">Create Your Account</h2>

        {/* Role Selection Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => handleRoleChange('GENERAL')}
            className={`px-4 py-2 rounded-full transition ${
              !isSeller ? 'bg-red-600 text-white' : 'bg-gray-300'
            }`}
          >
            User
          </button>
          <button
            onClick={() => handleRoleChange('SELLER')}
            className={`px-4 py-2 rounded-full transition ${
              isSeller ? 'bg-red-600 text-white' : 'bg-gray-300'
            }`}
          >
            Seller
          </button>
        </div>

        {/* Profile Picture Upload */}
        <div className="w-20 h-20 mx-auto relative rounded-full border-2 border-gray-300 overflow-hidden">
          <img 
            src={data.profilePic || loginIcons} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = loginIcons;
            }}
          />
          <label className="absolute bottom-0 w-full text-center bg-gray-200 text-xs py-1 cursor-pointer hover:bg-gray-300 transition">
            Upload Photo
            <input type="file" className="hidden" onChange={handleUploadPic} accept="image/*" />
          </label>
        </div>

        {/* Sign Up Form */}
        <form className="pt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="grid">
            <label className="font-semibold">{isSeller ? 'Shop Name' : 'Full Name'}:</label>
            <input
              type="text"
              placeholder={`Enter ${isSeller ? 'shop name' : 'your name'}`}
              name="name"
              value={data.name}
              onChange={handleOnChange}
              required
              className="p-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="grid">
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              required
              className="p-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="grid">
            <label className="font-semibold">Location:</label>
            <button
              type="button"
              onClick={() => setModalIsOpen(true)}
              className={`flex items-center gap-2 p-2 border rounded-md ${
                location.address ? "bg-gray-100" : "bg-gray-200"
              } text-gray-700 hover:bg-gray-300 transition`}
            >
              <FaMapMarkerAlt className="text-red-500" /> 
              {location.address || "Choose your location"}
            </button>
            {location.address && (
              <p className="text-xs text-gray-500 mt-1 truncate">{location.address}</p>
            )}
          </div>

          <div className="grid">
            <label className="font-semibold">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                required
                minLength={6}
                className="p-2 border rounded-md w-full pr-10 focus:ring focus:ring-blue-300"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="grid">
            <label className="font-semibold">Confirm Password:</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleOnChange}
                required
                minLength={6}
                className="p-2 border rounded-md w-full pr-10 focus:ring focus:ring-blue-300"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {/* Real-time password match indicator */}
            {data.confirmPassword && (
              <div className="text-sm mt-1 flex items-center gap-2">
                {passwordMatch ? (
                  <span className="text-green-600 flex items-center">
                    <FaCheckCircle /> Passwords match
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <FaTimesCircle /> Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className="modal w-full max-w-md mx-auto bg-white p-4 rounded-lg relative"
            overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
            ariaHideApp={false}
          >
            <div className="flex flex-col gap-4 h-full">
              <h3 className="text-lg font-bold">Select Your Location</h3>
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search location (e.g., Colombo, Sri Lanka)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border rounded-md pl-10"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                {isSearching && (
                  <span className="absolute right-3 top-3 text-gray-500 text-sm">Searching...</span>
                )}
              </div>

              {/* Map Container - Force re-render with key */}
              <div className="h-60 border rounded-md overflow-hidden">
                <MapContainer
                  key={mapKey}
                  center={[location.lat, location.lng]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <UpdateMapCenter center={[location.lat, location.lng]} />
                  <LocationMarker />
                </MapContainer>
              </div>

              {/* Selected Location Display */}
              <div className="bg-gray-100 p-3 rounded-md">
                <h4 className="font-semibold flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" /> Selected Location
                </h4>
                <p className="text-sm mt-1">{location.address || "Click on the map or search to select a location"}</p>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="overflow-y-auto max-h-40 border rounded-md">
                  <h4 className="font-semibold p-2 bg-gray-100">Search Results</h4>
                  <ul>
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        onClick={() => handleLocationSelect(result)}
                        className="cursor-pointer p-2 border-b hover:bg-gray-100 text-sm"
                      >
                        {result.display_name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setModalIsOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (location.address) {
                      setModalIsOpen(false);
                    } else {
                      toast.warning("Please select a location first");
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  disabled={!location.address}
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </Modal>

          <button 
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full hover:scale-105 transition-all w-full mt-4"
          >
            {isSeller ? 'Register Shop' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;