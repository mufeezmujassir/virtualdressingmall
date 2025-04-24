import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog, FaBars } from 'react-icons/fa';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import role from '../common/role';
import { motion } from 'framer-motion';


const SellerPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (user?.role !== role.SELLER) {
      navigate('/');
    }
  }, [user, navigate]); // ✅ added navigate to deps

  
  const navItems = [
    { path: 'overview', label: 'Dashboard' },
    { path: 'shop-product', label: 'My Products' },
    { path: 'reservation', label: 'Reservations' },
    {path: 'seller-order', label: 'Orders'},
    {path:'put-a-bid',label:'Put a Bid'},
    
    {path:'review',label:'Review'},
   
    
    {path:'seller-sales-overview',label:'Sales OverView'},
    {path:'seller-income-report',label:"Order Income"},
    {path:'reservation-revenue',label:"Reservation Revenue"}
  ];

  return (
    <div className='min-h-screen md:flex bg-gray-50'>
      {/* Sidebar for large screens */}
      <aside
        className={`bg-white min-h-screen w-72 p-4 shadow-xl md:block hidden transition-all duration-300 overflow-y-auto`}
      >
        <motion.div
          className='h-24 flex flex-col items-center mb-6'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className='text-6xl cursor-pointer'>
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className='w-20 h-20 rounded-full border shadow-sm object-cover'
                alt={user?.name}
              />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <p className='capitalize text-lg font-bold mt-2'>{user?.name}</p>
          <p className='text-xs text-gray-500'>{user?.role}</p>
        </motion.div>

        <nav className='grid gap-2'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-xl transition-colors duration-200 flex items-center gap-2 ${
                location.pathname.includes(item.path)
                  ? 'bg-red-500 text-white shadow'
                  : 'hover:bg-red-100'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className='mt-4 border-t pt-4 flex flex-col gap-2'>
           
            <button className='px-3 py-2 rounded-xl hover:bg-red-100 flex items-center gap-2'>
              <FaCog /> Settings
            </button>
          </div>
        </nav>
      </aside>

      {/* Sidebar for small screens */}
      <div className='md:hidden block p-2'>
        <button onClick={() => setOpenSidebar(!openSidebar)}>
          <FaBars size={28} />
        </button>

        {openSidebar && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-20'
            onClick={() => setOpenSidebar(false)}
          >
            <aside
              className='bg-white w-64 min-h-full p-4 shadow-xl z-30 relative overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='h-24 flex flex-col items-center mb-6'>
                <div className='text-6xl cursor-pointer'>
                  {user?.profilePic ? (
                    <img
                      src={user?.profilePic}
                      className='w-20 h-20 rounded-full border shadow-sm object-cover'
                      alt={user?.name}
                    />
                  ) : (
                    <FaUserCircle />
                  )}
                </div>
                <p className='capitalize text-lg font-bold mt-2'>{user?.name}</p>
                <p className='text-xs text-gray-500'>{user?.role}</p>
              </div>

              <nav className='grid gap-2'>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpenSidebar(false)}
                    className={`px-3 py-2 rounded-xl transition-colors duration-200 flex items-center gap-2 ${
                      location.pathname.includes(item.path)
                        ? 'bg-red-500 text-white shadow'
                        : 'hover:bg-red-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className='mt-4 border-t pt-4 flex flex-col gap-2'>
                  
                  <button className='px-3 py-2 rounded-xl hover:bg-gray-100 flex items-center gap-2'>
                    <FaCog /> Settings
                  </button>
                </div>
              </nav>
            </aside>
          </div>
        )}
      </div>

      <main className='w-full p-4'>
        <Outlet />
      </main>
    </div>
  );
};

export default SellerPanel;
