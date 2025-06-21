import React, { useState } from "react";
import { useCart } from "./CartContext";
import "./Product.css";

const Product = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updateCartCount } = useCart();

  // Safely handle price formatting
  const formatPrice = (price) => {
    if (typeof price === "number") {
      return price.toFixed(2);
    }

    // Try to convert to number if it's a string
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice)) {
      return numericPrice.toFixed(2);
    }

    // Fallback for invalid prices
    return "0.00";
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/add-to-cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include", // Important for session cookies
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);

        // Update cart count from server response
        updateCartCount();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Add a safeguard for missing product
  if (!product) {
    return <div className="product-card">Product not available</div>;
  }

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name || "Product image"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.png";
            }}
          />
        ) : (
          <div className="image-placeholder">No Image</div>
        )}
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${formatPrice(product.price)}</span>
          <div className="quantity-control">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={loading || success}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : success ? (
              "✓ Added!"
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
