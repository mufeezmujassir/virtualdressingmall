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
import AddtoCart from '../components/AddtoCart'
import SellerDashboard from '../pages/SellerPanel'
import Overview from '../components/Overview'
import SellerReservation from '../components/SellerReservationProduct'
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
             },{
                path:"add-to-cart",
                element:<AddtoCart/>
             },
             {
                path:"seller-dashboard",
                element:<SellerDashboard/>,
                children:[
                    {
                        path:"shop-product",
                        element:<SellerProduct/>
                    },
                    {
                        path:"overview",
                        element:<Overview/>
                    },{
                        path:"reservation",
                        element:<SellerReservation/>
                    }

                ]

             }
            
            
             

           
     ]
}])


export default router;