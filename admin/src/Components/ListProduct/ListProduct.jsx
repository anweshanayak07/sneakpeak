import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cart_cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/allproducts`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/removeproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      await fetchInfo();
      alert(`Product "${name}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className='list-product'>
      <h1>All Product List</h1>
      <div className='listproduct-format-main'>
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className='listproduct-allproducts'>
        <hr />
        {allproducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className='listproduct-format-main listproduct-format'>
              <img
                src={product.image}
                alt={product.name}
                className='listproduct-product-icon'
              />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img
                onClick={() => remove_product(product.id, product.name)}
                className='listproduct-remove-icon'
                src={cross_icon}
                alt='remove'
              />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
