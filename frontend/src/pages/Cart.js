import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { selectUser, selectToken } from '../store/userSlice'

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const navigate = useNavigate()
    const user = useSelector(selectUser)
    const token = useSelector(selectToken)
    const loadingCart = new Array(4).fill(null)

    const fetchData = async() =>{
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

    useEffect(()=>{
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

    const updateQuantity = async(id, qty, isIncrease) =>{
        if (!isIncrease && qty < 2) return
        
        try {
            const response = await axios.post(SummaryApi.updateCartProduct.url, {
                _id: id,
                quantity: isIncrease ? qty + 1 : qty - 1
            })

            if (response.data.success) {
                await fetchData()
            } else {
                toast.error(response.data.message || 'Failed to update quantity')
            }
        } catch (error) {
            console.error('Error updating quantity:', error)
            toast.error(error.response?.data?.message || 'Failed to update quantity')
        }
    }

    const deleteCartProduct = async(id)=>{
        try {
            const response = await axios.post(SummaryApi.deleteCartProduct.url, {
                _id: id
            })

            if (response.data.success) {
                await fetchData()
                context.fetchUserAddToCart()
                toast.success('Item removed from cart')
            } else {
                toast.error(response.data.message || 'Failed to remove item')
            }
        } catch (error) {
            console.error('Error deleting item:', error)
            toast.error(error.response?.data?.message || 'Failed to remove item')
        }
    }

    const handlePayment = async() =>{
        try {
            const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
            const response = await axios.post(SummaryApi.payment.url, {
                cartItems: data
            })

            if (response.data.id) {
                await stripePromise.redirectToCheckout({ sessionId: response.data.id })
            } else {
                toast.error('Failed to initialize payment')
            }
        } catch (error) {
            console.error('Payment error:', error)
            toast.error(error.response?.data?.message || 'Failed to process payment')
        }
    }

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice) ,0)

    if (!user?._id || !token) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <p className="text-lg mb-4">Please login to view your cart</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
                    >
                        Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto'>
            <div className='text-center text-lg my-3'>
                {data.length === 0 && !loading && (
                    <p className='bg-white py-5'>Your cart is empty</p>
                )}
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>   
                <div className='w-full max-w-3xl'>
                    {loading ? (
                        loadingCart?.map((el,index) => (
                            <div key={`loading-${index}`} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded' />
                        ))
                    ) : (
                        data.map((product,index) => (
                            <div key={product?._id} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                <div className='w-32 h-32 bg-slate-200'>
                                    <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' alt='' />
                                </div>
                                <div className='px-4 py-2 relative'>
                                    <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={()=>deleteCartProduct(product?._id)}>
                                        <MdDelete/>
                                    </div>

                                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                        <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                    </div>
                                    <div className='flex items-center gap-3 mt-1'>
                                        <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={()=>updateQuantity(product?._id, product?.quantity, false)}>-</button>
                                        <span>{product?.quantity}</span>
                                        <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={()=>updateQuantity(product?._id, product?.quantity, true)}>+</button>
                                    </div>
                                </div>    
                            </div>
                        ))
                    )}
                </div>

                {data.length > 0 && (
                    <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                        {loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse' />
                        ) : (
                            <div className='h-36 bg-white'>
                                <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                    <p>Quantity</p>
                                    <p>{totalQty}</p>
                                </div>

                                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                    <p>Total Price</p>
                                    <p>{displayINRCurrency(totalPrice)}</p>    
                                </div>

                                <button className='bg-blue-600 p-2 text-white w-full mt-2' onClick={handlePayment}>
                                    Payment
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart