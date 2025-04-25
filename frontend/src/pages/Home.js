import React from "react"
import CategoryList from "../components/CategoryList"
import BannerProduct from "../components/BannerProduct"
import HorizontalCardProduct from "../components/HorizontalCardProduct"
import VerticalCardProduct from "../components/VerticalCardProduct"

const Home = () => {
    return <div>
        <CategoryList/>
        <BannerProduct/>
        <HorizontalCardProduct 
                category="Tops & Upper Wear"
                heading="Featured Tops & Upper Wear"
            />
        
        </div>
        
}

export default Home;