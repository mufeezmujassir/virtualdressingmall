
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import role from '../common/role';


import { Outlet } from 'react-router-dom';


const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate =useNavigate()
    
    useEffect(() => {
        if(user?.role !== role.ADMIN){
            navigate('/')
        }
    }, [user])


    
  return (
    <div className='min-h-[calc(400vh-120px)] md:flex hidden '>

        <aside className='bg-white min-h-full  w-full  max-w-80 customShadow'>
                <div className='h-24  flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                        {
                        user?.profilePic ? (
                            <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser/>
                        )
                        }
                    </div>
                    <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                    <p className='text-sm'>{user?.role}</p>
                </div>
                        
                        <div>
                            <nav className='grid p-4'>
                                <Link to={"all-users"}className='px-2 py-1 hover:bg-slate-100'>All Users</Link>
                                <Link to={"all-products"}className='px-2 py-1 hover:bg-slate-100'>All Products</Link>
                            </nav>
                        </div>
                 
                
        </aside>

        <main className='w-full h-full p-1'>
            <Outlet/>
        </main> 
    </div>
  )
}

export default AdminPanel