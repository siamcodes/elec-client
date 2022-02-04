/* import React, { useEffect, useState } from 'react'
import { getProductsByCount } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";
import Jumbotron from "../components/cards/Jumbotron";
import LoadingCard from "../components/cards/LoadingCard";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAllProducts();
    }, []);

    const loadAllProducts = () => {
        setLoading(true);
        getProductsByCount(3).then((res) => {
            setProducts(res.data);
            setLoading(false);
        });
    };

    return (
        <>
            <div className="jumbotron text-danger h1 font-weight-bold text-center">
                <Jumbotron text={["Latest Products", "New Arrivals", "Best Sellers"]} />
            </div>
            <div className="container">
                {loading ? (
                    <LoadingCard count={3} />
                ) : (
                        <div className="row">
                            {products.map((product) => (
                                <div key={product._id} className="col-md-4">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </>
    )
}

export default Home; */

import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";
import CategoryList from "../components/category/CategoryList";
import SubList from "../components/sub/SubList";

const Home = () => {
    return (
        <>
            <div className="jumbotron text-danger h1 font-weight-bold text-center">
                <Jumbotron text={["Elec.App", "Latest Products", "New Arrivals", "Best Sellers"]} />
            </div>
            <a name="new-arrivals" />
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">New Arrivals</h4>
            <NewArrivals />

            <a name="best-sellers" />
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">Best Sellers</h4>
            <BestSellers />

            <a name="categories" />
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">Categories</h4>
            <CategoryList />

            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">Sub Categories</h4>
            <SubList />

            <br />

        </>
    );
};

export default Home;
