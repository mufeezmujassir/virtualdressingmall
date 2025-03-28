import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaRegUserCircle, FaEdit, FaCamera, FaHistory, FaShoppingBag } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdPerson, MdSave, MdArrowBack, MdAddAPhoto } from 'react-icons/md';
import SummaryApi from '../common';
import { setUserDetails, selectUser, selectToken } from '../store/userSlice';

const Profile = () => {
    const user = useSelector(selectUser);
    const token = useSelector(selectToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        address: '',
        profilePic: ''
    });
    const [loading, setLoading] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        if (!user?._id || !token) {
            navigate('/login');
            return;
        }
        
        setUserData({
            name: user.name || '',
            email: user.email || '',
            address: user.address || '',
            profilePic: user.profilePic || ''
        });
        
        // Fetch order history (you can implement this later)
        // fetchOrderHistory();
    }, [user, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(SummaryApi.updateUser.url, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                // Update redux state with new user data
                dispatch(setUserDetails({ 
                    ...user, 
                    ...userData,
                    token // Preserve the token
                }));
                
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            } else {
                toast.error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = () => {
            setUserData(prev => ({
                ...prev,
                profilePic: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    if (!user?._id || !token) {
        return (
            <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-xl max-w-md w-full animate__animated animate__fadeIn">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                        <MdPerson className="text-red-600 text-5xl" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-8 px-6">Please sign in to access your profile and manage your account information</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-gradient-to-r from-red-600 to-red-500 text-white px-10 py-3 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-medium"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    const renderProfileContent = () => (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Profile Edit Form */}
            {isEditing ? (
                <div className="animate__animated animate__fadeIn">
                    <div className="flex items-center mb-6 p-6 border-b">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <MdArrowBack />
                        </button>
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-8 flex justify-center">
                            <div className="relative w-40 h-40">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-200">
                                    {userData.profilePic ? (
                                        <img 
                                            src={userData.profilePic} 
                                            alt={userData.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <FaRegUserCircle className="w-1/2 h-1/2 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-red-600 to-red-500 text-white p-3 rounded-full cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all">
                                    <MdAddAPhoto className="text-xl" />
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                                <div className="relative">
                                    <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>
                            
                            <div className="group">
                                <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="Your email address"
                                    />
                                </div>
                            </div>
                            
                            <div className="group">
                                <label className="block text-gray-700 mb-2 font-medium">Shipping Address</label>
                                <div className="relative">
                                    <MdLocationOn className="absolute left-3 top-4 text-gray-400 text-xl" />
                                    <textarea
                                        name="address"
                                        value={userData.address || ''}
                                        onChange={handleChange}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 h-28"
                                        placeholder="Enter your shipping address"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center font-medium"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Saving Changes...
                                        </div>
                                    ) : (
                                        <>
                                            <MdSave className="mr-2 text-xl" /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="animate__animated animate__fadeIn p-6">
                    <div className="flex flex-wrap md:flex-nowrap">
                        {/* Left Side: Profile Image */}
                        <div className="w-full md:w-1/3 flex flex-col items-center mb-8 md:mb-0 md:border-r md:pr-8">
                            <div className="relative mb-4">
                                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                                    {userData.profilePic ? (
                                        <img 
                                            src={userData.profilePic} 
                                            alt={userData.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <FaRegUserCircle className="w-3/5 h-3/5 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition-colors"
                                >
                                    <FaCamera />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-center">{userData.name}</h2>
                            <span className="inline-block px-4 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mt-2 mb-4">
                                {user.role || 'Customer'}
                            </span>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full md:w-auto px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center font-medium mt-2"
                            >
                                <FaEdit className="mr-2" /> Edit Profile
                            </button>
                        </div>
                        
                        {/* Right Side: Profile Info */}
                        <div className="w-full md:w-2/3 md:pl-8">
                            <h3 className="text-xl font-bold mb-6 text-gray-800">Account Information</h3>
                            
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex">
                                        <div className="mr-4">
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <MdPerson className="text-red-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Full Name</p>
                                            <p className="font-semibold text-lg">{userData.name}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex">
                                        <div className="mr-4">
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <MdEmail className="text-red-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Email Address</p>
                                            <p className="font-semibold text-lg">{userData.email}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex">
                                        <div className="mr-4">
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <MdLocationOn className="text-red-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Shipping Address</p>
                                            <p className="font-semibold">
                                                {userData.address || 'No address added yet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderOrdersContent = () => (
        <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Order History</h3>
            
            {orderHistory && orderHistory.length > 0 ? (
                <div className="space-y-4">
                    {/* Render order history here */}
                    <p>Your order history will appear here</p>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <FaShoppingBag className="text-gray-400 text-3xl" />
                    </div>
                    <h4 className="text-xl font-medium mb-2">No Orders Yet</h4>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="max-w-5xl mx-auto mb-8">
                    <div className="animate__animated animate__fadeInDown">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your personal information and track your orders</p>
                    </div>
                </div>
                
                {/* Profile Tabs */}
                <div className="max-w-5xl mx-auto mb-6">
                    <div className="flex border-b">
                        <button
                            className={`py-3 px-6 font-medium transition-colors ${
                                activeTab === 'profile' 
                                    ? 'text-red-600 border-b-2 border-red-600' 
                                    : 'text-gray-600 hover:text-red-500'
                            }`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button
                            className={`py-3 px-6 font-medium transition-colors ${
                                activeTab === 'orders' 
                                    ? 'text-red-600 border-b-2 border-red-600' 
                                    : 'text-gray-600 hover:text-red-500'
                            }`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Order History
                        </button>
                    </div>
                </div>
                
                {/* Tab Content */}
                <div className="max-w-5xl mx-auto">
                    {activeTab === 'profile' ? renderProfileContent() : renderOrdersContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile; 