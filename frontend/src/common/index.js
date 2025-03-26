// import countAddToCartProduct from "../../../backend/controller/user/countOfAddToCartProduct"
import addToCart from "../helpers/addToCart"
import axios from "axios";

// Function to fetch cart product count
export const fetchCartCount = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/cart/count-of-cart");
        return response.data.count;
    } catch (error) {
        console.error("Error fetching cart count:", error);
        return 0;
    }
};

const backendDomin = "http://localhost:8080"

// Configure axios defaults
axios.defaults.withCredentials = true;

const SummaryApi = {
    SignUP : {
        url : `${backendDomin}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomin}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomin}/api/all-user`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomin}/api/update-user`,
        method : "post"
    },
    uploadProduct : {
        url : `${backendDomin}/api/upload-product`,
        method : 'post'
    },
    allProductSeller:{
        url : `${backendDomin}/api/all-product-seller`,
        method : 'get'
    },
    allProduct : {
        url : `${backendDomin}/api/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/update-product`,
        method  : 'post'
    },
    categoryProduct : {
        url : `${backendDomin}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomin}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomin}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/add-to-cart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/count-of-cart`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/view-cart-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/delete-cart-product`,
        method : 'post'
    },
    fetchCategoryWiseProduct : {
        url : `${backendDomin}/api/category-product`,
        method : 'post'
    },
    sellerSpecificProduct:{
        url:`${backendDomin}/api/specific-seller-product`,
        method:'get'
    },
    deleteProduct: {
        url: `${backendDomin}/api/delete-product`,
        method: 'POST'
    },
    addReservation : {
        url : `${backendDomin}/api/add-reservation`,
        method : 'POST'
    },
    payment : {
        url : `${backendDomin}/api/create-checkout-session`,
        method : 'POST'
    },
    searchProduct : {
        url : `${backendDomin}/api/search-products?q=`,
        method : 'GET'
    }
}

export default SummaryApi  