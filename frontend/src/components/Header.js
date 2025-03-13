import React from 'react';
import Logo from './Logo';
import { GrSearch } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import SummaryApi from '../common';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import role from '../common/role';

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include',
    });
    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate('/login');
    }
    if (data.error) {
      toast.error(data.message);
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
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Products</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:text-black">Bid</a></li>
            
          </ul>
        </div>

      </div>
    </nav>)
    }
    else if(user?.role===role.SELLER){
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
            <li><Link to={"/"} className="block py-2 px-3 text-white hover:text-black">Dashboard</Link></li>
            <li><Link to={"/shop-product"}  className="block py-2 px-3 text-white hover:text-black"> Products</Link></li>
            <li><Link to={"/"} className="block py-2 px-3 text-white hover:text-black">Put a Bid</Link></li>
            <li><Link to={"/"} className="block py-2 px-3 text-white hover:text-black">Orders</Link></li>
            <li><Link to={"/"} className="block py-2 px-3 text-white hover:text-black">Reservation</Link></li>
            <li><Link to={"/"} className="block py-2 px-3 text-white hover:text-black">Chat</Link></li>
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
        {/* Logo */}
        <Link to={"/"}>
          <Logo w={90} h={50} />
        </Link>

        {/* Search Bar */}
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

        {/* User, Cart, and Login */}
        <div className='flex items-center gap-20'>
          <div className='relative flex justify-center'>
            {user?._id  &&(
              <div className='text-3xl cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay((prev) => !prev)}>
                {
                  user?.profilePic ? (
                    <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                
              ) : (
                <FaRegCircleUser />
              )}
            </div>
            )}

            {/* Dropdown Menu */}
            {menuDisplay && (

              <div className='absolute bg-white top-12 left-0 h-fit p-2 shadow-lg rounded-md z-50'>
                <nav>
                  {
                    user?.role === role.ADMIN && ( <Link to={"admin-panel/all-products"} className='block whitespace-nowrap hover:bg-slate-100 p-2 rounded-md'onClick={() => setMenuDisplay(preve=>!preve)}>
                    Admin Panel
                  </Link>
                    )
                  }
                  
                </nav>
              </div>
            )
            }
          </div>

          {/* Shopping Cart */}
          <div className='text-2xl relative'>
            <span>
              <FaShoppingCart />
            </span>
            <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute top-0 -right-3'>
              <p className='text-sm'>0</p>
            </div>
          </div>

          {/* Login Button */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'
              >
                Logout
              </button>
            ) : (
              <Link to='/login'>
                <button className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {navigation()}
    </header>
  );
};

export default Header;
