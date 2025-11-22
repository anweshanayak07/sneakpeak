import React, { useState } from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-nav-box ${activeTab === "description" ? "active" : ""}`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews (147)
        </div>
      </div>

      {activeTab === "description" ? (
        <div className="descriptionbox-description">
          <p>
            At SneakPeak, we believe every step tells a story. Our mission is to bring you sneakers that blend cutting-edge design, all-day comfort, and effortless style.
          </p>
          <p>
            Crafted with high-quality materials and inspired by global sneaker culture, SneakPeak offers footwear for men, women, and kids who love to stand out without compromising on comfort.
          </p>
          <p>
            Join the SneakPeak community today — where fashion meets performance, and every step brings you closer to your perfect style.
          </p>
        </div>
      ) : (
        <div className="descriptionbox-reviews">
          <h3>Customer Reviews</h3>
          <p>⭐️⭐️⭐️⭐️☆ Great comfort and perfect fit!</p>
          <p>⭐️⭐️⭐️⭐️⭐️ Excellent quality — totally worth it!</p>
          <p>⭐️⭐️⭐️⭐️☆ Stylish and breathable. Love it!</p>
        </div>
      )}
    </div>
  )
}

export default DescriptionBox
