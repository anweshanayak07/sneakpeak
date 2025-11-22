import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.png";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  // Handle input changes
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // Upload product
  const Add_Product = async () => {
    try {
      console.log("Product details before upload:", productDetails);

      if (!image) {
        alert("Please select an image before adding the product.");
        return;
      }

      const formData = new FormData();
      formData.append("product", image);

      const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const uploadData = await uploadResponse.json();
      console.log("Upload response:", uploadData);

      if (!uploadData.success) {
        alert("Image upload failed on the server.");
        return;
      }

      
      const product = {
        ...productDetails,
        image: uploadData.image_url,
      };

      const addResponse = await fetch(`${process.env.REACT_APP_API_URL}/addproduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const addData = await addResponse.json();
      console.log("Add product response:", addData);

      if (addData.success) {
        alert("Product added successfully!");

    
        setProductDetails({
          name: "",
          image: "",
          category: "women",
          new_price: "",
          old_price: "",
        });
        setImage(null);
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error while adding product:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt="Upload Preview"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
