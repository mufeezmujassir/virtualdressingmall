import{createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/forgotpassword'
import SignUp from '../pages/signUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import CategeoryProduct from '../pages/CategeoryProduct'
import ProductDetails from '../pages/ProductDetails'
import SellerProduct from '../pages/sellerproduct'
import Shopdetails from '../pages/shopdetails'
import UserProduct from '../pages/UserProduct'
import ViewProductFull from '../pages/ViewProductFull'

import SellerDashboard from '../pages/Dashboard'
import OrderPage from '../pages/OrderPage'
import SearchProduct from '../pages/SearchProduct'
import Cancel from '../pages/Cancel'
import Success from '../pages/Success'
import Cart from '../pages/Cart'

const router = createBrowserRouter([
 {
     path:"/",
     element :<App/>,
     children:[
         {
             path:"",
             element:<Home/>

             },
             {
                 path:"login",
                 element:<Login/>
             },
             {
                 path:"forgot-password",
                 element:<ForgotPassword/>
             },
             {
                 path:"sign-up",
                 element:<SignUp/>
             },
             {
                 path:"product-category/:categoryName",
                 element:<CategeoryProduct/>
             },
             {
                 path:"product/:id",
                 element:<ProductDetails/>
             },
             {
                path : 'cart',
                element : <Cart/>
             },
             {
                path : 'success',
                element : <Success/>
             },
             {
                path : 'cancel',
                element : <Cancel/>
             },
             {
                path : 'search',
                element : <SearchProduct/>
             }, 
             {
                path : 'order',
                element : <OrderPage/>
             },
                
             {
                 path:"admin-panel",
                 element:<AdminPanel/>,
                 children:[
                     {
                         path:"all-users",
                         element:<AllUsers/>
                     },
                     {
                         path:"all-products",
                         element:<AllProducts/>
                     }
                 ]
             },
             
             {
                        path:"shop-product",
                        element:<SellerProduct/>
             },
             {
                path:"shop-details",
                element:<Shopdetails/>
             },
             {
                path:"user-product",
                element:<UserProduct/>
             },
             {
                path:"view-product/:id",
                element:<ViewProductFull/>
             },
             {
                path:"seller-dashboard",
                element:<SellerDashboard/>
             }
            
            
             

           
     ]
}])


export default router;