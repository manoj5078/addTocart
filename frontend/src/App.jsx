import React from "react";
import Product from "./Components/Product";
import { CartProvider, useCart } from "./Components/CartContext";
import { ProductsProvider, useProducts } from "./Components/ProductsContext";
import "./App.css";

// const CartIcon = () => {
//   const { cartCount } = useCart();

//   return (
//     <div className="cart-icon">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//       >
//         <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
//         <line x1="3" y1="6" x2="21" y2="6"></line>
//         <path d="M16 10a4 4 0 0 1-8 0"></path>
//       </svg>
//       {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
//     </div>
//   );
// };

function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductsProvider>
  );
}

const AppContent = () => {
  const { products, loading, error } = useProducts();
  const { cartCount } = useCart();

  return (
    <div className="App">
      <header className="app-header">
        <h1>ShopEZ</h1>
        <div className="cart-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <div className="products-container">
          {products.length > 0 ? (
            products.map((product) => (
              <Product key={product.id} product={product} />
            ))
          ) : (
            <div className="no-products">
              <p>No products available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
