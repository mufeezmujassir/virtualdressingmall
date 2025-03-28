import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (!data.email || !data.password) {
            toast.error('Please fill in all fields')
            return
        }
        
        setLoading(true)
        try {
            // Clear any existing auth headers
            delete axios.defaults.headers.common['Authorization'];
            
            // Get initial login response
            const loginResponse = await axios.post(SummaryApi.signIn.url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!loginResponse.data.success) {
                throw new Error(loginResponse.data.message || 'Login failed');
            }

            // Get token from response
            const token = loginResponse.data.data;
            
            if (!token) {
                throw new Error('No token received from server');
            }

            // Set token in axios defaults
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Get user details from token
            const decodedToken = jwtDecode(token);

            // Get full user details
            const userResponse = await axios.get(SummaryApi.current_user.url);

            if (!userResponse.data.success || !userResponse.data.data) {
                throw new Error('Failed to fetch user details');
            }

            const userData = userResponse.data.data;

            // Prepare final user data with token
            const finalUserData = {
                ...userData,
                token, // Include token in user data
                role: userData.role || 'USER',
                _id: userData._id || decodedToken._id,
                email: userData.email || decodedToken.email || data.email
            };

            // Update Redux store with user data and token
            dispatch(setUserDetails(finalUserData));
            
            toast.success('Login successful!');
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Login error:', error);
            // Clear auth header on error
            delete axios.defaults.headers.common['Authorization'];
            
            if (error.response?.status === 401) {
                toast.error('Invalid credentials. Please try again.');
            } else {
                toast.error(error.response?.data?.message || error.message || 'Login failed');
            }
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <section id='login'>
            <div className='mx-auto container p-4'>
                <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons'/>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label>Email: </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='email' 
                                    placeholder='enter email' 
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent'
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label>Password: </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='enter password'
                                    value={data.password}
                                    name='password' 
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent'
                                    required
                                />
                                <div className='cursor-pointer text-xl' onClick={() => setShowPassword(prev => !prev)}>
                                    <span>
                                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </span>
                                </div>
                            </div>
                            <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                                Forgot password?
                            </Link>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className='text-center mt-4'> 
                            <p>Don't have an account? <Link to="/sign-up" className='text-red-600 hover:underline'>Sign up</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login