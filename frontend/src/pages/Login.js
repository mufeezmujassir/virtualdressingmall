import React, { useContext, useState } from 'react'

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [data,setData] = useState({
        email : "",
        password : ""
    })
    const navigate = useNavigate()
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) =>{
        const { name , value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });
    
            if (!dataResponse.ok) {
                throw new Error(`HTTP error! status: ${dataResponse.status}`);
            }
    
            const dataApi = await dataResponse.json();
    
            if (dataApi.success) {
                toast.success(dataApi.message);
                navigate('/');
                fetchUserDetails();
                fetchUserAddToCart();
            } else if (dataApi.error) {
                toast.error(dataApi.message);
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            toast.error("Failed to login. Please try again later.");
        }
    };
    console.log("data login",data)

    return (
        <div className="login-page-container">
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'/>
            <div className="left-panel">
                <h1>Hello, Welcome!</h1>
                <p>Don't have an account?</p>
                <Link to="/sign-up">
                    <button className="register-btn">Register</button>
                </Link>
            </div>
            <div className="right-panel">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>Login</h2>
                    <div className="input-group">
                        <input type="email" name="email" placeholder="Email" value={data.email} onChange={handleOnChange}  />
                    </div>
                    <div className="input-group">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={data.password} onChange={handleOnChange}  />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button  className="login-btn">Login</button>
                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <p>or login with social platforms</p>
                    <div className="social-icons">
                        <a href="#"><i className='bx bxl-google'></i></a>
                        <a href="#"><i className='bx bxl-facebook'></i></a>
                        <a href="#"><i className='bx bxl-github'></i></a>
                        <a href="#"><i className='bx bxl-linkedin'></i></a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;