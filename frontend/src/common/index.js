const backendDomin = "http://localhost:8080"

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
        url : `${backendDomin}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/view-card-product`,
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
    }
    ,
    deleteProduct: {
        url: `${backendDomin}/api/delete-product`,
        method: 'POST'
    },
    addReservation : {
        url : `${backendDomin}/api/add-reservation`,
        method : 'POST'
    },
    getReservationDetails : {
        url : `${backendDomin}/api/get-reservation`,
        method : 'get'
    },
    updatereservation:{
        url:`${backendDomin}/api/update-reservation`,
        method : 'POST'
    },
    getgroupbyDetails:{
        url:`${backendDomin}/api/get-groupby-reservation`,
        method : 'get'
    },
    getOrderDetails:{
        url:`${backendDomin}/api/get-orders`,
        method : 'get'
    },
    updateOrderStatus:{
        url:`${backendDomin}/api/update-order-status`,
        method : 'POST'
    }
    ,
    generateBalanceSheet : {
        url : `${backendDomin}/api/generate-balance-sheet`,
        method : 'get'
    }
    
}

export default SummaryApi  