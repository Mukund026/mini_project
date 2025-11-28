import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";
import "./cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("retailerCart") || "[]");
    setCartItems(storedCart);

    // Fetch products to get distributer info
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/products/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filterCartItems = async () => {
      if (cartItems.length === 0) return;

      try {
        const token = localStorage.getItem("token");
        const productIds = cartItems.map((item) => item.productId);
        const response = await fetch(`http://localhost:5000/api/products/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const allProducts = await response.json();
        const existingOrders = JSON.parse(
          localStorage.getItem("retailerOrders") || "[]"
        );
        const orderedProductIds = existingOrders.map(
          (order) => order.productId
        );

        const validCartItems = cartItems.filter((item) => {
          const product = allProducts.find((p) => p._id === item.productId);
          return (
            product &&
            product.role !== "retailer" &&
            !orderedProductIds.includes(item.productId)
          );
        });

        if (validCartItems.length !== cartItems.length) {
          setCartItems(validCartItems);
          setSelectedItems(
            selectedItems.filter((index) =>
              validCartItems.some(
                (item) => item.productId === cartItems[index].productId
              )
            )
          );
          localStorage.setItem("retailerCart", JSON.stringify(validCartItems));
        }
      } catch (error) {
        console.error("Error filtering cart items:", error);
      }
    };

    filterCartItems();
  }, [cartItems]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      window.location.href = "/login";
      return;
    }
  }, []);

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    setSelectedItems(
      selectedItems
        .filter((i) => i !== index)
        .map((i) => (i > index ? i - 1 : i))
    );
    localStorage.setItem("retailerCart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart!");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleOrderAll = () => {
    if (cartItems.length === 0) {
      toast.warning("Cart is empty!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "retailer") {
      toast.warning("Only retailers can place orders!");
      return;
    }

    const existingOrders = JSON.parse(
      localStorage.getItem("retailerOrders") || "[]"
    );
    const orderedProductIds = existingOrders.map((order) => order.productId);
    const newOrders = cartItems
      .filter((item) => !orderedProductIds.includes(item.productId))
      .map((item) => {
        // Find the product to get the distributerId
        const product = products.find((p) => p._id === item.productId);
        return {
          ...item,
          status: "Pending",
          date: new Date().toLocaleDateString(),
          distributerId: product ? product.listedBy : null,
          buyerName: user.name,
          buyerEmail: user.email,
          buyerRole: user.role,
        };
      });

    if (newOrders.length === 0) {
      toast.warning("All items in cart have already been ordered!");
      return;
    }

    const updatedOrders = [...existingOrders, ...newOrders];
    localStorage.setItem("retailerOrders", JSON.stringify(updatedOrders));

    // Clear cart
    localStorage.setItem("retailerCart", JSON.stringify([]));
    setCartItems([]);
    setSelectedItems([]);

    toast.success("Order placed successfully!");
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((_, index) => index));
    }
  };

  return (
    <div className="cartContainer">
      <h2>My Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <table className="cartTable">
            <thead>
              <tr>
                <th>Select</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => {
                        if (selectedItems.includes(index)) {
                          setSelectedItems(
                            selectedItems.filter((i) => i !== index)
                          );
                        } else {
                          setSelectedItems([...selectedItems, index]);
                        }
                      }}
                    />
                  </td>
                  <td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{item.productName}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>
                    <button
                      onClick={() => removeItem(index)}
                      className="removeBtn"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cartSummary">
            <h3>Total: ${calculateTotal()}</h3>
            <button onClick={handleOrderAll} className="checkoutBtn">
              Order All
            </button>
            <button onClick={handleSelectAll} className="checkoutBtn">
              {selectedItems.length === cartItems.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
