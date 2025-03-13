import React from "react"
import CategoryList from "../components/CategoryList"
import BannerProduct from "../components/BannerProduct"
import HorizontalCardProduct from "../components/HorizontalCardProduct"
import VerticalCardProduct from "../components/VerticalCardProduct"

const Home = () => {
    return <div>
        <CategoryList/>
        <BannerProduct/>
        <HorizontalCardProduct category="airpodes" heading="Top's Airpodes"/>
        <HorizontalCardProduct category="earphones" heading="Top's Earphones"/>
        <HorizontalCardProduct category="watches" heading="Popular's Watches"/>

        <VerticalCardProduct  category="mobiles" heading="Mobiles"/>
        <VerticalCardProduct  category="Mouse" heading="Mouse"/>
        <VerticalCardProduct  category="televisions" heading="Televisions"/>
        <VerticalCardProduct  category="camera" heading="Camera & Photography"/>
        <VerticalCardProduct  category="refrigerator" heading="Refrigerator"/>
        <VerticalCardProduct  category="trimmers" heading="Trimmers"/>
        
        </div>
        
}

export default Home;