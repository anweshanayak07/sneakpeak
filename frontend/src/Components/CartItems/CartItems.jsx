import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } =
    useContext(ShopContext);

  const apiURL = process.env.REACT_APP_API_URL;

  const makePayment = async () => {
    try {
      
      const items = all_product
        .filter((p) => cartItems[p.id] > 0)
        .map((p) => ({
          name: p.name,
          image: p.image,
          price: p.new_price,
          quantity: cartItems[p.id],
        }));

      if (items.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const response = await fetch(`${apiURL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: items }),
      });

      if (!response.ok) {
        throw new Error("Checkout session creation failed");
      }

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url; // Stripe redirect v4
      } else {
        console.error("Stripe session missing URL:", session);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          const qty = cartItems[e.id];
          const total = (e.new_price * qty).toFixed(2);

          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>${e.new_price.toFixed(2)}</p>

                <button className="cartitems-quantity">{qty}</button>

                <p>${total}</p>

                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt="remove"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>

            <hr />

            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>

            <hr />

            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount().toFixed(2)}</h3>
            </div>
          </div>

          <button onClick={makePayment}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="PROMO CODE" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
