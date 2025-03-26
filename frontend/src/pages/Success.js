import React from 'react'
import { Link } from 'react-router-dom'

const Success = () => {
    return (
        <div className = 'bg-slate-200-w-full max -w-md- mx-auto flex justify-center items-center flex-col p-4 m-2 rounded-lg'>
            <img
            src="/assets/success.gif" alt="success animation"
            width={150}
            height={150}
            />
            <p className = 'tect-green-500 font-bold text-xl'> Payment Successfull</p>
            <Link to = { "/order"} className = 'p-2 px-3 mt-5 border-2 border-green-600 rounded-lg font-semibold text-green-600 hover:bg-green-600 hover:text-white'> See Order </Link>
        </div>
    )
}

export default Success