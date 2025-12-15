import React, { useContext } from 'react';
import { ShopContext } from './../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import { Link } from 'react-router-dom';

// -- COMPONENT: Premium Product Card --
const ProductCard = ({ id, name, image, new_price, old_price }) => {
  // Calculate discount percentage if old price exists
  const hasDiscount = old_price && old_price > new_price;
  const discountPercent = hasDiscount
    ? Math.round(((old_price - new_price) / old_price) * 100)
    : 0;

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="card-link" onClick={() => window.scrollTo(0, 0)}>
        <div className="image-container">
          <img src={image} alt={name} loading="lazy" />

          {/* Badge overlays */}
          {hasDiscount && <div className="badge-sale">-{discountPercent}%</div>}

          {/* Hover Action */}
          <div className="card-action">
            <span>View Product</span>
          </div>
        </div>

        <div className="card-info">
          <h3 className="product-name">{name}</h3>
          <div className="price-wrapper">
            <span className="price-new">₹{new_price}</span>
            {hasDiscount && <span className="price-old">₹{old_price}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
};

// -- MAIN PAGE COMPONENT --
const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  // Filter products for this category
  const categoryProducts = all_product.filter(
    (item) => props.category === item.category
  );

  return (
    <div className="shop-category-page">
      {/* 
        -- INTERNAL STYLES --
        Using a style tag to keep this single-file, portable, and performant.
        Font: 'Outfit' (Modern, Geometric)
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --font-main: 'Outfit', sans-serif;
          --color-black: #111;
          --color-gray: #888;
          --color-light: #f9f9f9;
          --anim-swift: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .shop-category-page {
          font-family: var(--font-main);
          color: var(--color-black);
          width: 100%;
          min-height: 100vh;
          padding-bottom: 100px;
          background-color: #fff;
        }

        /* BANNER SECTION */
        .banner-wrapper {
          width: 100%;
          margin-bottom: 60px;
          position: relative;
        }
        .banner-img {
          width: 100%;
          display: block;
          max-width: 1440px;
          margin: 30px auto;
          /** Optional: If you want full-bleed, remove max-width/margin **/
        }

        /* TOOLBAR (Filter/Sort) */
        .toolbar {
          max-width: 1280px;
          margin: 0 auto 40px;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .results-count {
          font-size: 14px;
          color: var(--color-gray);
          letter-spacing: 0.5px;
        }
        .results-count strong {
          color: var(--color-black);
          font-weight: 600;
        }

        .sort-dropdown {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          border: 1px solid #e5e5e5;
          border-radius: 50px;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .sort-dropdown:hover {
          border-color: var(--color-black);
        }
        .sort-text {
          font-size: 13px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .sort-icon {
          height: 6px;
          opacity: 0.6;
        }

        /* REST OF CSS UNCHANGED UNTIL PRODUCT GRID */
        
        /* PRODUCT GRID */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px 24px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          
          /* Fade Up Animation on Load */
          animation: fadeUp 0.8s ease-out forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* CARD STYLES */
        .product-card {
          width: 100%;
          position: relative;
          display: flex;       /* NEW: Flex container */
          flex-direction: column; /* NEW: Stack children */
          height: 100%;        /* NEW: Fill grid cell height */
        }
        .card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;        /* NEW: Fill card height */
          width: 100%;
        }

        .image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.15; /* Modern slightly tall aspect */
          overflow: hidden;
          background: var(--color-light);
          margin-bottom: 18px;
          flex-shrink: 0;      /* NEW: Prevent image from shrinking */
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Hover: Zoom Image */
        .product-card:hover .image-container img {
          transform: scale(1.06);
        }

        /* Hover: Action Overlay */
        .card-action {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(255,255,255,0.95);
          padding: 14px 0;
          text-align: center;
          
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-action span {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-black);
        }
        .product-card:hover .card-action {
          transform: translateY(0);
        }

        /* Badge */
        .badge-sale {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--color-black);
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 2px;
          z-index: 2;
        }

        /* Info Section */
        .card-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;        /* NEW: Push content to fill space if needed */
          justify-content: flex-start;
        }
        .product-name {
          font-size: 15px;
          font-weight: 500;
          line-height: 1.4;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          /* white-space: nowrap;  REMOVED: Allow wrapping for better layout */
          display: -webkit-box;    /* Box for line clamping */
          -webkit-line-clamp: 2;   /* Max 2 lines */
          -webkit-box-orient: vertical;
        }
        .price-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;    /* NEW: Push price to bottom if description varies */
          padding-top: 4px;
        }
        .price-new {
          font-weight: 600;
          font-size: 16px;
        }
        .price-old {
          font-weight: 400;
          font-size: 14px;
          text-decoration: line-through;
          color: var(--color-gray);
        }

        /* LOAD MORE LINK */
        .load-more-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 80px;
        }
        .load-more-btn {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 16px 50px;
          background: var(--color-black);
          color: #fff;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: opacity 0.3s;
        }
        .load-more-btn:hover {
          opacity: 0.8;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .product-grid {
             grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .banner-wrapper { margin-bottom: 30px; }
          .banner-img { width: 92%; margin: 20px auto; }
          .toolbar { flex-direction: column; gap: 15px; align-items: flex-start; }
          
          .product-grid {
             grid-template-columns: repeat(2, 1fr);
             gap: 30px 16px;
          }
          /* On mobile, maybe allow smaller font or different spacing */
        }

      `}</style>

      {/* Hero Banner */}
      <div className="banner-wrapper">
        <img className="banner-img" src={props.banner} alt="Category Banner" />
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="results-count">
          <strong>Showing 1-12</strong> of {categoryProducts.length} results
        </div>
        <div className="sort-dropdown">
          <span className="sort-text">Sort by</span>
          <img src={dropdown_icon} alt="" className="sort-icon" />
        </div>
      </div>

      {/* Grid */}
      <div className="product-grid">
        {categoryProducts.map((item, i) => (
          <ProductCard
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="load-more-wrapper">
        <button className="load-more-btn">Explore More</button>
      </div>

    </div>
  );
}

export default ShopCategory;