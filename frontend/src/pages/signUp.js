import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import loginIcons from '../assest/signin.gif';
import imageTobase64 from '../helpers/imageTobase65';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';

const SignUp = () => {
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
  });

  const navigate = useNavigate();
  data.role=isSeller?'SELLER':'GENERAL';
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

    try {
      const response = await fetch(SummaryApi.SignUP.url, {
        method: SummaryApi.SignUP.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
    role: role, // Set role correctly
  }));
};


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
          <img src={data.profilePic || loginIcons} alt="Profile" className="w-full h-full object-cover" />
          <label className="absolute bottom-0 w-full text-center bg-gray-200 text-xs py-1 cursor-pointer">
            Upload Photo
            <input type="file" className="hidden" onChange={handleUploadPic} />
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
            <label className="font-semibold">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                required
                className="p-2 border rounded-md w-full pr-10 focus:ring focus:ring-blue-300"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer"
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
                className="p-2 border rounded-md w-full pr-10 focus:ring focus:ring-blue-300"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer"
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

          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full hover:scale-105 transition-all w-full mt-4">
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
