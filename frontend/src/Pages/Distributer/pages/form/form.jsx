import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./form.css";

const form = ({ selectedListing }) => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [distributerId, setDistributerId] = useState("");
  const [produceId, setProduceId] = useState("");
  const [unit, setUnit] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (selectedListing) {
      setProductName(selectedListing.name || "");
      setCategory(selectedListing.category || "");
      setProduceId(selectedListing._id || "");
      setFarmerId(selectedListing.farmer || "");
      setDistributerId(selectedListing.distributer || "");
      setPricePerUnit(selectedListing.price || "");
      setQuantity("");
      setPrice("");
    }
  }, [selectedListing]);

  useEffect(() => {
    if (quantity && pricePerUnit) {
      const totalPrice = parseFloat(quantity) * parseFloat(pricePerUnit);
      setPrice(totalPrice.toFixed(2));
    } else {
      setPrice("");
    }
  }, [quantity, pricePerUnit]);

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    if (pricePerUnit) {
      const totalPrice = parseFloat(qty) * parseFloat(pricePerUnit);
      setPrice(totalPrice.toFixed(2));
    }
  };

  const handlePricePerUnitChange = (e) => {
    const ppu = e.target.value;
    setPricePerUnit(ppu);
    if (quantity) {
      const totalPrice = parseFloat(quantity) * parseFloat(ppu);
      setPrice(totalPrice.toFixed(2));
    }
  };

  const handlePlaceOrder = async () => {
    if (
      !productName ||
      !category ||
      !quantity ||
      !price ||
      !unit ||
      !pricePerUnit ||
      !deliveryAddress ||
      !paymentMode ||
      !expectedDeliveryDate
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      toast.error("Please login to place order");
      return;
    }

    // Send to API for both retailers and distributers
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const orderData = {
        productId: produceId,
        orderedBy: user.id,
        orderedByRole: user.role,
        quantity: parseInt(quantity),
      };

      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to place order";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON (e.g., HTML error page), use status text
          errorMessage = `Failed to place order: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      toast.success("Your order has been placed successfully!");
      // Navigate based on user role
      if (user.role === "distributer") {
        navigate("/distributer-myorders");
      } else if (user.role === "retailer") {
        navigate("/retailer-cart");
      } else {
        navigate("/"); // Default fallback
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
      return; // Don't reset form if error
    }

    // Reset form
    setProductName("");
    setCategory("");
    setQuantity("");
    setPrice("");
    setFarmerId("");
    setDistributerId("");
    setProduceId("");
    setUnit("");
    setPricePerUnit("");
    setDeliveryAddress("");
    setPaymentMode("");
    setExpectedDeliveryDate("");
    setRemark("");
  };

  return (
    <div className="formContainer">
      <h3>Order Form</h3>
      <input
        className="inputt"
        type="text"
        value={productName}
        readOnly
        placeholder="Product name"
      />
      <input
        className="inputt"
        type="text"
        value={category}
        readOnly
        placeholder="Category"
      />
      <input
        className="inputt"
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        placeholder="Quantity"
        required
      />
      <select
        className="inputt"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        required
      >
        <option value="">Select Unit</option>
        <option value="Kg">Kg</option>
        <option value="Liter">Liter</option>
      </select>
      <input
        className="inputt"
        type="number"
        value={pricePerUnit}
        readOnly
        placeholder="Price per unit"
      />
      <input
        className="inputt"
        type="text"
        value={price}
        readOnly
        placeholder="Total Price"
      />
      <textarea
        className="inputt"
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
        placeholder="Delivery Address"
        required
      />
      <select
        className="inputt"
        value={paymentMode}
        onChange={(e) => setPaymentMode(e.target.value)}
        required
      >
        <option value="">Select Payment Mode</option>
        <option value="Cash">Cash</option>
        <option value="Online">Online</option>
      </select>
      <div>
        Expected Delivery Date
        <input
          className="inputt"
          type="date"
          value={expectedDeliveryDate}
          onChange={(e) => setExpectedDeliveryDate(e.target.value)}
          placeholder="Expected Delivery Date"
          required
        />
      </div>
      <textarea
        className="inputt"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        placeholder="Remark"
      />
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default form;
