import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ShopContext = createContext(null);


const apiURL = import.meta.env.VITE_API_URL;

// Initialize cart
const getDefaultCart = () => {
  const cart = {};
  for (let i = 1; i <= 300; i++) cart[i] = 0;
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // LOAD PRODUCTS + CART
  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    axios
      .get(`${apiURL}/allproducts`)
      .then((res) => setAll_Product(res.data))
      .catch((err) => console.error("❌ Error fetching products:", err));

    if (token) {
      axios
        .get(`${apiURL}/getcart`, {
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => setCartItems(res.data))
        .catch((err) => console.error("❌ Error fetching cart:", err));
    }
  }, [apiURL]);

  const addToCart = async (itemId) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return alert("⚠️ Please log in");
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
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return alert("⚠️ Please log in");
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
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product = all_product.find((p) => p.id === Number(item));
        if (product) total += product.new_price * cartItems[item];
      }
    }
    return total;
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

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
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
