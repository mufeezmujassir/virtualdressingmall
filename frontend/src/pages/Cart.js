import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { 
    MdDelete, 
    MdPerson, 
    MdShoppingCart, 
    MdPayment, 
    MdLocalShipping, 
    MdCheckCircle,
    MdSecurity,
    MdAdd,
    MdRemove
} from "react-icons/md";
import { selectUser, selectToken } from '../store/userSlice'

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const navigate = useNavigate()
    const user = useSelector(selectUser)
    const token = useSelector(selectToken)
    const loadingCart = new Array(4).fill(null)

    const fetchData = async() => {
        if (!user?._id || !token) {
            navigate('/login')
            return
        }

        try {
            const response = await axios.get(SummaryApi.addToCartProductView.url)
            if (response.data.success) {
                setData(response.data.data)
            } else {
                toast.error(response.data.message || 'Failed to fetch cart items')
            }
        } catch (error) {
            console.error('Error fetching cart:', error)
            if (error.response?.status === 401) {
                toast.error('Please login to continue')
                navigate('/login')
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch cart items')
            }
        }
    }

    useEffect(() => {
        const loadCart = async() => {
            setLoading(true)
            try {
                await fetchData()
            } catch (error) {
                console.error('Error loading cart:', error)
            } finally {
                setLoading(false)
            }
        }
        loadCart()
    }, [user, token])

    const updateQuantity = async(id, qty, isIncrease) => {
        if (!isIncrease && qty < 2) return;
        
        // Calculate new quantity
        const newQuantity = isIncrease ? qty + 1 : qty - 1;
        
        try {
            // Show loading toast
            const toastId = toast.loading(`Updating quantity...`);
            
            const response = await axios.post(
                SummaryApi.updateCartProduct.url, 
                {
                    _id: id,
                    quantity: newQuantity
                },
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    } 
                }
            );
            
            // Dismiss loading toast
            toast.dismiss(toastId);
            
            if (response.data.success) {
                // Refresh cart data
                await fetchData();
                context.fetchUserAddToCart();
                // Optional success message
                toast.success('Quantity updated');
            } else {
                console.error("Update API error:", response.data);
                toast.error(response.data.message || 'Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error(error.response?.data?.message || 'Failed to update quantity');
        }
    };

    const deleteCartProduct = async(id) => {
        try {
            // Show loading toast
            const toastId = toast.loading("Removing item...");
            
            // Make simple delete request with proper auth
            const response = await axios.post(SummaryApi.deleteCartProduct.url, 
                { _id: id },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            toast.dismiss(toastId);
            
            if (response.data.success) {
                // Refresh cart data
                await fetchData();
                context.fetchUserAddToCart();
                toast.success('Item removed from cart');
            } else {
                console.error("Delete API error:", response.data);
                toast.error(response.data.message || 'Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            const errorMsg = error.response?.data?.message || 'Failed to remove item';
            toast.error(errorMsg);
        }
    };

    // Add proper null checks to avoid "Cannot read properties of undefined" errors
    const totalQty = data?.reduce((previousValue, currentValue) => 
        previousValue + (currentValue?.quantity || 0), 0) || 0;
    
    const totalPrice = data?.reduce((prev, curr) => 
        prev + ((curr?.quantity || 0) * (curr?.productId?.sellingPrice || 0)), 0) || 0;

    if (!user?._id || !token) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <MdPerson className="text-red-600 text-5xl mx-auto mb-4" />
                    <p className="text-xl mb-4">Please login to view your cart</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors shadow-md"
                    >
                        Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4 bg-gray-50 min-h-screen'>
            {/* Checkout Progress */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center mx-4">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                            <MdShoppingCart />
                        </div>
                        <span className="text-sm mt-2 text-red-600 font-medium">Cart</span>
                    </div>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                    <div className="flex flex-col items-center mx-4">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                            <MdCheckCircle />
                        </div>
                        <span className="text-sm mt-2 text-gray-500">Checkout</span>
                    </div>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                    <div className="flex flex-col items-center mx-4">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                            <MdPayment />
                        </div>
                        <span className="text-sm mt-2 text-gray-500">Payment</span>
                    </div>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                    <div className="flex flex-col items-center mx-4">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                            <MdLocalShipping />
                        </div>
                        <span className="text-sm mt-2 text-gray-500">Shipping</span>
                    </div>
                </div>
            </div>

            {/* User Information Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <MdPerson className="text-red-600 text-2xl" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Welcome, {user?.name || 'Guest'}</h2>
                    <p className="text-gray-600">User ID: {user?._id || 'Not logged in'}</p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2'>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <MdShoppingCart className="mr-2 text-red-600" />
                            Your Shopping Cart
                        </h2>

                        {data.length === 0 && !loading && (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                <MdShoppingCart className="text-gray-400 text-5xl mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">Your cart is empty</p>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                {loadingCart?.map((el, index) => (
                                    <div key={`loading-${index}`} className="h-32 bg-gray-200 rounded-lg" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.map((product, index) => (
                                    <div key={product?._id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 bg-gray-50 rounded-md overflow-hidden">
                                                <img 
                                                    src={product?.productId?.productImage?.[0]} 
                                                    className="w-full h-full object-contain p-2" 
                                                    alt={product?.productId?.productName || 'Product image'} 
                                                />
                                            </div>
                                            <div className="flex-1 relative">
                                                <button
                                                    onClick={() => deleteCartProduct(product?._id)}
                                                    className="absolute right-0 top-0 text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                                                >
                                                    <MdDelete className="text-xl" />
                                                </button>

                                                <h3 className="text-lg font-semibold pr-8 line-clamp-1">{product?.productId?.productName}</h3>
                                                <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                                                    <p>Size: <span className="font-medium">{product?.size}</span></p>
                                                    <p>Category: <span className="font-medium capitalize">{product?.productId?.category || 'Uncategorized'}</span></p>
                                                </div>
                                                
                                                <div className="flex justify-between items-end mt-3">
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-red-600 border border-gray-200 transition-colors"
                                                            onClick={() => updateQuantity(product?._id, product?.quantity, false)}
                                                            disabled={product?.quantity < 2}
                                                        >
                                                            <MdRemove />
                                                        </button>
                                                        <span className="font-medium text-lg w-6 text-center">{product?.quantity}</span>
                                                        <button 
                                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-red-600 border border-gray-200 transition-colors"
                                                            onClick={() => updateQuantity(product?._id, product?.quantity, true)}
                                                        >
                                                            <MdAdd />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-600 text-sm">Unit Price</p>
                                                        <p className="text-red-600 font-medium">{displayINRCurrency(product?.productId?.sellingPrice || 0)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-600 text-sm">Total</p>
                                                        <p className="font-semibold">{displayINRCurrency((product?.productId?.sellingPrice || 0) * (product?.quantity || 1))}</p>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {data.length > 0 && (
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-600">Total Items:</p>
                                    <p className="font-medium">{totalQty}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-600">Subtotal:</p>
                                    <p className="font-semibold">{displayINRCurrency(totalPrice)}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-600">Shipping:</p>
                                    <p className="font-medium text-green-600">FREE</p>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg font-semibold">Total:</p>
                                        <p className="text-xl font-bold text-red-600">{displayINRCurrency(totalPrice)}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate('/checkout')}
                                    className="w-full py-3 rounded-md text-white font-medium flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transform hover:translate-y-[-2px] transition-all mt-6"
                                >
                                    <MdCheckCircle className="text-xl" />
                                    Proceed to Checkout
                                </button>

                                {/* Trust Badges */}
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex justify-center gap-4 text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <MdSecurity className="text-2xl" />
                                            <span className="text-xs mt-1">Secure Payment</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <MdLocalShipping className="text-2xl" />
                                            <span className="text-xs mt-1">Fast Delivery</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <MdCheckCircle className="text-2xl" />
                                            <span className="text-xs mt-1">Quality Guarantee</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart