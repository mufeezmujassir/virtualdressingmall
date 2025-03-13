import React, { useState } from 'react'
import { MdModeEditOutline, MdDelete  } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayUSDCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common/index';

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)
  const deleteproduct = async () => {
        try {
            const response = await fetch(SummaryApi.deleteProduct.url, {
                method: SummaryApi.deleteProduct.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id: data._id })
            });

            const dataResponse = await response.json();
            console.log("Delete Response:", dataResponse);

            if (response.ok) {
                fetchdata(); // Refresh the product list
            } else {
                console.error('Failed to delete product:', dataResponse);
            }
        } catch (err) {
            console.error(err);
        }
    };
  return (
    <div className='bg-white p-4 rounded relative flex flex-col items-center'>
            <div className='w-40 relative'>
                {/* Image */}
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.productImage[0]} className='mx-auto object-fill h-full' />
                </div>

                {/* Product Name */}
                <h1 className='text-ellipsis line-clamp-2 text-center'><b>ProductName: </b>{data.productName}</h1>
                <h1 className='text-ellipsis line-clamp-2 text-center'><b>category:</b>{data.category}</h1>
                {/* Price & Edit Button */}
                <div className='flex items-center justify-between w-full mt-2'>
                    <p className='font-semibold'>
                        {data.Size.price}
                    </p>

                    {/* Edit Button (Right Side) */}
                    <div 
                        className='p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' 
                        onClick={() => setEditProduct(true)}
                    >
                        <MdModeEditOutline />
                    </div>
                </div>

                {/* Delete Button (Bottom Left) */}
                <div 
                    className='absolute bottom-0 left-0 p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer'
                    onClick={deleteproduct}
                >
                    <MdDelete />
                </div>
            </div>

            {/* Edit Product Modal */}
            {editProduct && (
                <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchdata={fetchdata} />
            )}
        </div>
  )
}

export default AdminProductCard