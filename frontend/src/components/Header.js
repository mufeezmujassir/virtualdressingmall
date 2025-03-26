import React, { useContext, useState, useEffect } from 'react';
import Logo from './Logo';
import { GrSearch } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { clearUserDetails } from '../store/userSlice';
import role from '../common/role';
import AppContext from '../context';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const token = useSelector((state) => state?.user?.token);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { cartProductCount } = useContext(AppContext);
  
  useEffect(() => {
    console.log('Header mounted - Current user:', user);
    console.log('Has token:', !!token);
  }, []);

  useEffect(() => {
    console.log('User state changed:', {
      id: user?._id,
      role: user?.role,
      hasToken: !!token
    });
  }, [user, token]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(SummaryApi.logout_user.url, {
        withCredentials: true,
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : undefined
      });

      if (response.data.success) {
        dispatch(clearUserDetails());
        toast.success('Logged out successfully');
        navigate('/login', { replace: true });
      } else {
        toast.error(response.data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // If we get a 401 or any other error, clear the user state anyway
      dispatch(clearUserDetails());
      toast.error('Session ended. Please login again.');
      navigate('/login', { replace: true });
    }
  };

  const navigation=()=>{
    if(user?.role===role.ADMIN){
      return(<nav className="bg-[#E54040] border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        
        

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block md:hidden text-white focus:outline-none"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`${isOpen ? "block" : "hidden"} w-full md:flex md:w-auto`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#E54040] md:mt-0 md:border-0">
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Dashboard</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Products</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">User</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Orders</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Analytics & Reports</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Feedback</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Settings</a></li>
          </ul>
        </div>

      </div>
    </nav>

)
    }
     else if(user?.role===role.USER){
      return(<nav className="bg-[#E54040] border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        
        

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block md:hidden text-white focus:outline-none"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`${isOpen ? "block" : "hidden"} w-full md:flex md:w-auto`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#E54040] md:mt-0 md:border-0">
            <li><Link to={"/"} className="block py-2 px-3 text-white hover:text-black">Home</Link></li>
            <li><Link to={"/shop-details"} className="block py-2 px-3 text-white hover:text-black">Shops</Link></li>
            <li><Link to={'/user-product'} className="block py-2 px-3 text-white hover:text-black">Products</Link></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Bid</a></li>
            
          </ul>
        </div>

      </div>
    </nav>)
    }
    else if(user?.role===role.SELLER){
      return(
        <nav className="bg-[#E54040] border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        
        

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block md:hidden text-white focus:outline-none"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`${isOpen ? "block" : "hidden"} w-full md:flex md:w-auto`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#E54040] md:mt-0 md:border-0">
            <li><Link to={"/seller-dashboard"} className="block py-2 px-3 text-white hover:text-black">Home</Link></li>
            
          </ul>
        </div>

      </div>
    </nav>
      
    

)
    }
  }
  
  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <Link to="/">
          <Logo w={90} h={50} />
        </Link>

        <div className='flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow'>
          <input
            type='text'
            placeholder='Search product here...'
            className='w-full outline-none pl-2'
          />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
            <GrSearch />
          </div>
        </div>

        <div className='flex items-center gap-20'>
          {user?._id && token && (
            <div className='relative flex justify-center'>
              <div 
                className='text-3xl cursor-pointer relative flex justify-center' 
                onClick={() => setMenuDisplay(prev => !prev)}
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} className='w-10 h-10 rounded-full' alt={user.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>

              {menuDisplay && (
                <div className='absolute bg-white top-12 right-0 h-fit p-2 shadow-lg rounded-md z-50 min-w-[150px]'>
                  <nav className='flex flex-col'>
                    <Link 
                      to="/profile" 
                      className='block whitespace-nowrap hover:bg-slate-100 p-2 rounded-md'
                      onClick={() => setMenuDisplay(false)}
                    >
                      Profile
                    </Link>
                    {user?.role === role.ADMIN && (
                      <Link 
                        to="/admin/dashboard" 
                        className='block whitespace-nowrap hover:bg-slate-100 p-2 rounded-md'
                        onClick={() => setMenuDisplay(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMenuDisplay(false);
                        handleLogout();
                      }}
                      className='block whitespace-nowrap hover:bg-slate-100 p-2 rounded-md text-left text-red-600'
                    >
                      Logout
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}

          <div className='text-2xl relative'>
            <Link to={user?._id && token ? '/cart' : '/login'}>
              <FaShoppingCart />
              {cartProductCount > 0 && (
                <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                  <p className='text-sm'>{cartProductCount}</p>
                </div>
              )}
            </Link>
          </div>

          {(!user?._id || !token) && (
            <Link to='/login'>
              <button className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
      {navigation()}
    </header>
  );
};

export default Header;
