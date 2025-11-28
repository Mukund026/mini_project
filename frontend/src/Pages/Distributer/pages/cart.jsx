import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(
      localStorage.getItem("distributerCart") || "[]"
    );
    setCartItems(storedCart);
  }, []);

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("distributerCart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart!");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.warning("Cart is empty!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    try {
      // Send each cart item as a separate order to the API
      for (const item of cartItems) {
        const response = await fetch(
          "http://localhost:5000/api/orders/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: item.productId,
              orderedBy: user.id,
              orderedByRole: user.role,
              quantity: item.quantity,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to place order");
        }
      }

      // Clear cart after successful orders
      localStorage.setItem("distributerCart", JSON.stringify([]));
      setCartItems([]);

      toast.success("Orders placed successfully!");
      navigate("/distributer-myorders");
    } catch (error) {
      console.error("Error placing orders:", error);
      toast.error(`Failed to place orders: ${error.message}`);
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
            <button onClick={handleCheckout} className="checkoutBtn">
              Checkout
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
