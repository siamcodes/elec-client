import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
    getUserCart,
    emptyUserCart,
    saveUserAddress,
    applyCoupon,
    createCashOrderForUser,
    getUserAddress
} from "../functions/user";
import { Button } from 'antd';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState([]);
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState("");
    // discount price
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountError, setDiscountError] = useState("");

    const dispatch = useDispatch();
    const { user, COD } = useSelector((state) => ({ ...state }));
    const couponTrueOrFalse = useSelector((state) => state.coupon);

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            console.log("user cart res", JSON.stringify(res.data, null, 4));
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        });

        getUserAddress(user.token).then((res) => {
            console.log("user address res", JSON.stringify(res.data, null, 4));
            if (res.data.user.address != null) {
                setAddress(res.data.user.address);
            }
        });

    }, []);

    const emptyCart = () => {
        // remove from local storage
        if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
        }
        // remove from redux
        dispatch({
            type: "ADD_TO_CART",
            payload: [],
        });
        // remove from backend
        emptyUserCart(user.token).then((res) => {
            setProducts([]);
            setTotal(0);
            setTotalAfterDiscount(0);
            setCoupon("");
            toast.success("Cart is emapty. Contniue shopping.");
        });
    };

    const saveAddressToDb = () => {
        // console.log(address);
        saveUserAddress(user.token, address).then((res) => {
            if (res.data.ok) {
                setAddressSaved(true);
                toast.success("Address saved");
            }
        });
    };

    const applyDiscountCoupon = () => {
        console.log("send coupon to backend", coupon);
        applyCoupon(user.token, coupon).then((res) => {
            console.log("RES ON COUPON APPLIED", res.data);
            if (res.data) {
                setTotalAfterDiscount(res.data);
                // update redux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: true,
                });
            }
            // error
            if (res.data.err) {
                setDiscountError(res.data.err);
                // update redux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false,
                });
            }
        });
    };

    const showAddress = () => (
        <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} />
            <Button className="mt-2" onClick={saveAddressToDb} type="primary" ghost>
                Save
            </Button>
        </>
    );

    const showProductSummary = () =>
        products.map((p, i) => (
            <div key={i}>
                <p>
                    {i + 1}. {p.product.title} ({p.color}) x {p.count} ={" ฿"}
                    {p.product.price * p.count}
                </p>
            </div>
        ));

    const showApplyCoupon = () => (
        <>
            <input
                onChange={(e) => {
                    setCoupon(e.target.value);
                    setDiscountError("");
                }}
                value={coupon}
                type="text"
                className="form-control"
            />
            <Button onClick={applyDiscountCoupon} className="mt-2" type="dashed" danger>
                Apply
            </Button>
        </>
    );

    /*     
    const createCashOrder = () => {
            createCashOrderForUser(user.token, COD).then((res) => {
                console.log("USER CASH ORDER CREATED RES ", res);
                // empty cart form redux, local Storage, reset coupon, reset COD, redirect
            });
        }; 
    */

    const createCashOrder = () => {
        createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
            console.log("USER CASH ORDER CREATED RES ", res);
            // empty cart form redux, local Storage, reset coupon, reset COD, redirect
            if (res.data.ok) {
                // empty local storage
                if (typeof window !== "undefined") localStorage.removeItem("cart");
                // empty redux cart
                dispatch({
                    type: "ADD_TO_CART",
                    payload: [],
                });
                // empty redux coupon
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false,
                });
                // empty redux COD
                dispatch({
                    type: "COD",
                    payload: false,
                });
                // empty cart from backend
                emptyUserCart(user.token);
                // redirect
                setTimeout(() => {
                    history.push("/user/history");
                }, 1000);
            }
        });
    };

    return (
        <div className="container-fluid row">
            <div className="col-md-5">
                <h4>Delivery Address</h4>
                {showAddress()}
                <hr />
                <h4>Got Coupon?</h4>
                {showApplyCoupon()}
                <br />
                {discountError && <p className="bg-danger text-white p-2">{discountError}</p>}
            </div>

            <div className="col-md-7">
                <h4>Order Summary</h4>
                <hr />
                <p>Products {products.length}</p>
                <hr />
                {showProductSummary()}
                <hr />
                <p>Cart Total: <b>฿{total}</b></p>
                {totalAfterDiscount > 0 && (
                    <p className="bg-success text-white p-2">
                        Discount Applied: Total Payable: ฿{totalAfterDiscount}
                    </p>
                )}

                <div className="row">
                    <div className="col-6">
                        {COD ? (
                            <Button
                                disabled={!addressSaved || !products.length}
                                onClick={createCashOrder}
                                type="primary" shape="round"
                            >
                                Place Order
                            </Button>
                        ) : (
                            <Button
                                disabled={!addressSaved || !products.length}
                                onClick={() => history.push("/payment")}
                                type="primary" shape="round"
                            >
                                Place Order
                            </Button>
                        )}
                    </div>
                    <div className="col-6">
                        <Button
                            disabled={!products.length}
                            onClick={emptyCart}
                            type="dashed" shape="round"
                        >
                            Empty Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
