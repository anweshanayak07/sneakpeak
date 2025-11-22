import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const apiURL = process.env.REACT_APP_API_URL;

if (!apiURL) {
  console.warn(
    "⚠️ REACT_APP_API_URL is missing! Make sure frontend/.env is correctly set."
  );
}


const getDefaultCart = () => {
  const cart = {};
  for (let i = 1; i <= 300; i++) cart[i] = 0;
  return cart;
};

const ShopContextProvider = ({ children }) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());


  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    // Load all products
    axios
      .get(`${apiURL}/allproducts`)
      .then((res) => setAll_Product(res.data))
      .catch((err) =>
        console.error("❌ Error fetching products:", err?.response || err)
      );

    // Load user cart
    if (token) {
      axios
        .get(`${apiURL}/getcart`, {
          headers: {
            "auth-token": token,
          },
        })
        .then((res) => setCartItems(res.data))
        .catch((err) =>
          console.error("❌ Error fetching cart:", err?.response || err)
        );
    }
  }, []);


  const addToCart = async (itemId) => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      alert("⚠️ Please log in to add items to cart");
      return;
    }

    try {
      await axios.post(
        `${apiURL}/addtocart`,
        { itemId },
        { headers: { "auth-token": token } }
      );

      setCartItems((prev) => ({
        ...prev,
        [itemId]: prev[itemId] + 1,
      }));
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      alert("⚠️ Please log in to remove items");
      return;
    }

    try {
      await axios.post(
        `${apiURL}/removefromcart`,
        { itemId },
        { headers: { "auth-token": token } }
      );

      setCartItems((prev) => ({
        ...prev,
        [itemId]: prev[itemId] > 0 ? prev[itemId] - 1 : 0,
      }));
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
    }
  };


  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, key) => {
      const itemQty = cartItems[key];
      if (itemQty > 0) {
        const product = all_product.find((p) => p.id === Number(key));
        if (product) total += product.new_price * itemQty;
      }
      return total;
    }, 0);
  };

  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <ShopContext.Provider
      value={{
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
