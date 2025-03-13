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
                        path:"shop-product",
                        element:<SellerProduct/>
             },
             {
                path:"shop-details",
                element:<Shopdetails/>
             }
            
            
             

           
     ]
}])


export default router;