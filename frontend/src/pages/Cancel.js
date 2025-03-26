import React from 'react';
import { Link } from 'react-router-dom'
// import the Link component from react-router-dom to enable navigation to the order page

const Cancel = () => {
    return (
        <div className = 'bg-slate-200-w-full max -w-md- mx-auto flex justify-center items-center flex-col p-4 m-2 rounded-lg'>
            <img
            src ="/assets/cancel.gif" alt="cancel animation"
            width={150}
            height={150}
            className =  'mix-bland-multiply'
            />
            <p className = 'text-red-500 font-bold text-xl'> Payment cancel</p>
            <Link to = { "/Cart"} className = 'p-2 px-3 mt-5 border-2 border-red-600 rounded-lg font-semibold text-red-600 hover:bg-red-600 hover:text-white'> Go to cart </Link>
        </div>
    )
}
export default Cancel;