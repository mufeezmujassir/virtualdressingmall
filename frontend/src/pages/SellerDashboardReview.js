import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FaStar, FaThumbsUp } from 'react-icons/fa';
import axios from 'axios';

const DEFAULT_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEO0lEQVR4nO2WW0wTWRTGN5GYgA+oMTFq4jsJD+jDS9BHfTLGA7nOwpSZtlDAcFHREpREUZF7uYlcFVC84oUgAbSAKNS0VAoWBIHSDkUcLrVQCgWG4TbM8K/HbFaTEt7mwSZfMslkz/m+/e2z1wj5n38SrbPUxjk4xMk5eqbI2XjKJeXsHTnHdgrOxnPRFcO8V/yvYiIno2eRnK1HsXKG+gjKcSppjMuDaJqXVQzl5rXkfyXWOiuX0jnZBypnZPUcyB5GJq/OznHRXM3FeHLLnuVBcpZaGXL2jl9yT12qpU/1AyuGgVV2CqPcFLTyD9F8MR6NoSGodrVEjRMjVB9MQvOZCagPdkRzmAaN4eQIlTOyeY6e91yzlJYGE5CzdzjAnE5GZPkgsga/Y3gFmF5RoCEZWgHGL8P+KUhRZXQXNS40Wh0YVDi6pDY4MBfD1NRH3C0dxOMmDjVDPKqHeJN43zWIyvxuVLjbosqVglE8VTjQsXAyesE2ONAOTAwTs7qIwYZbCbh86h7i3GKR4M3g3I0rSAlOgr+bH/wd/RHiFIzo0HSkRGYj2t0XQY7+OL/bDtcoPyS62yDMkcY1SvbZnQNUlJMx/RHDQ06IiM9GVPB5BHseRaiHJ6JdnZBgo6HWnEa9FQ2NLYNcdxphxzJx0iEI3qHROO5wEp5+oYh2OQlfdwrxUYytA1Qsg8z3GBZnoCEjDN5Bp3AmIgE3IuKQGRSLJGtLFNtJ8cFciiEnGePOFnhnI0WdOYVsezskByQjPTAGKYExiD0RijCfE4iKlL63cYByMXrNP3Eo3dMKMV6+SAuNQ3b4OfwVEI5YKwbl1hRIVwlTBxLjLhTGXGQYdGTw0lqCMmdLxPv4I+NsJM77hSE+KBhB3v7w8ZBv7QDl5LI3PPMuiA/0RXrASWQERSHRyw+RdjSKLS3Qb01D6yIDcSMx6WaNSVcrDNqRGLSjUOVgjQj3b19KdGAQYgOO4pzfEaScOY5j/vSWDnCOnu3DCcfvIubYYaT4+yM9MBDnPQ8i3I5Gvg2FKhsaOncZCG8JtHckaO7I0HAXGHCToMxJistHjyHN5xDOHTuMZJ8D8PXzxX4/+v9zYK/UPOtQGHM0Bsm+Xkjz8UGClwciHK1QYG2GKrEDDhI0iIz8dSi7I0WNsxRJB52R6uOFNO99SPL2gK+fD3b5yLZxgDJP3+cVgwNehxDj5Yr0oy5I9NyLEAcLZFubo9xKgjoRea2VBPfFTnjL8KhQhgKRg7YMChxkiBS/C2l7nZDsuQ/nDx9EnP9+HPEXrxX5FglI9/mF3YohJyYUoW77Ee+xH1GOexBmT+OymQnKLUxRayFBo4UE9WamqDI3Rbm5CYrFjnmZIN/cBFkWpoi228XfstyHEHcXhOxnEXBCvFlyr21D8n80+QljUdwGQFlUPAAAAABJRU5ErkJggg==';
const DEFAULT_NO_IMAGE = 'data:image/png;base64,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';

const SellerDashboardReview = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'highest', 'lowest'
    const user = useSelector((state) => state?.user?.user);
    const token = localStorage.getItem('token');

    // Fetch all comments for this seller's products
    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/seller/comments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setComments(response.data.data);
            } else {
                toast.error(response.data.message || 'Failed to fetch comments');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Network error while fetching comments');
        } finally {
            setLoading(false);
        }
    };

    // Sort and filter comments
    const getSortedComments = () => {
        let sortedComments = [...comments];
        
        switch (filter) {
            case 'highest':
                sortedComments.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                sortedComments.sort((a, b) => a.rating - b.rating);
                break;
            case 'newest':
                sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                sortedComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'most-liked':
                sortedComments.sort((a, b) => b.likes - a.likes);
                break;
            default:
                // Default is newest first
                sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        return sortedComments;
    };

    // Calculate statistics
    const getStats = () => {
        if (comments.length === 0) return { avg: 0, count: 0, fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 };
        
        // Count ratings
        const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        comments.forEach(comment => {
            ratings[comment.rating] = (ratings[comment.rating] || 0) + 1;
        });
        
        // Calculate average
        const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
        const avg = Math.round((total / comments.length) * 10) / 10;
        
        return {
            avg,
            count: comments.length,
            fiveStar: ratings[5] || 0,
            fourStar: ratings[4] || 0,
            threeStar: ratings[3] || 0,
            twoStar: ratings[2] || 0,
            oneStar: ratings[1] || 0
        };
    };

    // Organize comments by product
    const getGroupedComments = () => {
        // First, sort comments according to filter
        const sortedComments = getSortedComments();
        
        // Then group by product
        const grouped = {};
        
        sortedComments.forEach(comment => {
            const productId = comment.product?._id || 'unknown';
            
            if (!grouped[productId]) {
                grouped[productId] = {
                    product: comment.product || { productName: 'Unknown Product' },
                    comments: []
                };
            }
            
            grouped[productId].comments.push(comment);
        });
        
        return Object.values(grouped);
    };

    useEffect(() => {
        if (token) {
            fetchComments();
        }
    }, [token]);

    const stats = getStats();
    const sortedComments = getSortedComments();

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your reviews</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Customer Reviews</h1>
            
            {/* Statistics Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Review Summary</h2>
                        <div className="flex items-center mb-2">
                            <p className="text-4xl font-bold mr-2">{stats.avg}</p>
                            <div>
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar key={star} className={star <= Math.round(stats.avg) ? 'text-yellow-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <p className="text-gray-600">{stats.count} reviews</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats[`${star === 1 ? 'one' : star === 2 ? 'two' : star === 3 ? 'three' : star === 4 ? 'four' : 'five'}Star`];
                            const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
                            
                            return (
                                <div key={star} className="flex items-center mb-1">
                                    <div className="flex items-center mr-2 w-16">
                                        {star} <FaStar className="text-yellow-400 ml-1" />
                                    </div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-yellow-400 rounded-full" 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="ml-2 w-12 text-right text-sm text-gray-600">
                                        {count}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Reviews ({comments.length})</h2>
                
                <div className="flex items-center">
                    <label htmlFor="filter" className="mr-2 text-gray-700">Sort by:</label>
                    <select
                        id="filter"
                        className="border rounded-md px-2 py-1"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                        <option value="most-liked">Most Liked</option>
                    </select>
                </div>
            </div>
            
            {/* Comments List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-lg text-gray-600">No reviews yet for your products.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {getGroupedComments().map((group) => (
                        <div key={group.product._id} className="bg-white p-4 rounded-lg shadow-md">
                            {/* Product Header */}
                            <div className="flex items-center border-b pb-4 mb-4">
                                <div className="h-16 w-16 rounded-md overflow-hidden mr-4">
                                    <img 
                                        src={group.product?.productImage || DEFAULT_NO_IMAGE} 
                                        alt={group.product?.productName || 'Product'} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = DEFAULT_NO_IMAGE;
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{group.product?.productName || 'Product'}</h3>
                                    <p className="text-sm text-gray-500">{group.product?.category || 'Category'}</p>
                                    <div className="mt-1 flex items-center">
                                        <span className="text-lg font-medium mr-2">
                                            {(group.comments.reduce((sum, c) => sum + c.rating, 0) / group.comments.length).toFixed(1)}
                                        </span>
                                        <div className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar 
                                                    key={star} 
                                                    className={star <= Math.round(group.comments.reduce((sum, c) => sum + c.rating, 0) / group.comments.length) ? 'text-yellow-400' : 'text-gray-300'} 
                                                    size={16}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({group.comments.length} {group.comments.length === 1 ? 'review' : 'reviews'})
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Product Comments */}
                            <div className="space-y-4">
                                {group.comments.map((comment) => (
                                    <div key={comment._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                                                    <img 
                                                        src={comment.userImage || DEFAULT_AVATAR} 
                                                        alt={comment.userName || 'User'} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = DEFAULT_AVATAR;
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{comment.userName || 'Anonymous'}</p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span>{moment(comment.createdAt).format('MMM D, YYYY')}</span>
                                                        <span className="mx-2">•</span>
                                                        <div className="flex text-yellow-400">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <FaStar 
                                                                    key={star} 
                                                                    className={star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'} 
                                                                    size={14}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaThumbsUp className="mr-1" />
                                                <span>{comment.likes}</span>
                                            </div>
                                        </div>
                                        
                                        <p className="mt-3 text-gray-700">{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerDashboardReview; 