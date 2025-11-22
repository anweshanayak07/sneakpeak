import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon from "../Assets/star_icon.png";
import start_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext);
  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
            <img src={product.image} alt=""/>
            <img src={product.image} alt=""/>
            <img src={product.image} alt=""/>
            <img src={product.image} alt=""/>
        </div>
        <div className="productdisplay-img">
            <img  className="productdisplay-main-img" src={product.image} alt=""/>
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={start_dull_icon} alt="" />
            <p>(1807)</p>
        </div>
        <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-old">${product.old_price}</div>
            <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
            Engineered for all-day comfort and urban style, these sneakers combine breathable mesh with a durable sole.
            Lightweight yet supportive, they’re perfect for workouts or everyday wear.
            Step up your look with performance-driven design and street-ready flair.
        </div>
        <div className="productdisplay-right-size">
            <h1>Select Size</h1>
            <div className="productdisplay-right-size">
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
                <div>9</div>
            </div>
        </div>
        <button onClick={() => {addToCart(product.id)}}>ADD TO CART</button>
        <p className='productdisplay-right-category'><span>Category:</span>Men</p>
        <p className='productdisplay-right-category'><span>Tags:</span>Trendy</p>
      </div>
    </div>
  )
}

export default ProductDisplay
