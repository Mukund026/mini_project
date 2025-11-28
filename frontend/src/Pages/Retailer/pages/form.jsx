import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./form.css";

const form = ({ selectedListing }) => {
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

  const handlePlaceOrder = () => {
    if (
      !productName ||
      !category ||
      !quantity ||
      !price ||
      !farmerId ||
      !distributerId ||
      !produceId ||
      !unit ||
      !pricePerUnit ||
      !deliveryAddress ||
      !paymentMode ||
      !expectedDeliveryDate
    ) {
      toast.error("Please fill all required fields!");
      return;
    }
    const order = {
      productName,
      category,
      quantity,
      price,
      farmerId,
      distributerId,
      produceId,
      unit,
      pricePerUnit,
      deliveryAddress,
      paymentMode,
      expectedDeliveryDate,
      remark,
      status: "Placed",
      date: new Date().toLocaleString(),
    };
    const existingOrders = JSON.parse(
      localStorage.getItem("retailerOrders") || "[]"
    );
    existingOrders.push(order);
    localStorage.setItem("retailerOrders", JSON.stringify(existingOrders));

    // Add to seller's orders based on source
    if (selectedListing) {
      if (selectedListing.source === "Farmer") {
        const farmerOrder = {
          buyerName: "Retailer", // Assuming retailer name or ID
          produce: productName,
          quantity,
          amount: price,
          status: "Placed",
          contact: farmerId, // Or contact info
          date: new Date().toLocaleString(),
        };
        const farmerOrders = JSON.parse(
          localStorage.getItem("farmerOrders") || "[]"
        );
        farmerOrders.push(farmerOrder);
        localStorage.setItem("farmerOrders", JSON.stringify(farmerOrders));
      } else if (selectedListing.source === "Distributor") {
        const distributerOrder = {
          productName,
          category,
          quantity,
          price,
          farmerId,
          distributerId,
          produceId,
          unit,
          pricePerUnit,
          deliveryAddress,
          paymentMode,
          expectedDeliveryDate,
          remark,
          status: "Placed",
          date: new Date().toLocaleString(),
          buyerType: "Retailer",
        };
        const distributerOrders = JSON.parse(
          localStorage.getItem("distributerOrders") || "[]"
        );
        distributerOrders.push(distributerOrder);
        localStorage.setItem(
          "distributerOrders",
          JSON.stringify(distributerOrders)
        );
      }
    }

    toast.success("Your order has been placed successfully!");
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
      <input
        className="inputt"
        type="text"
        value={farmerId}
        onChange={(e) => setFarmerId(e.target.value)}
        placeholder="Farmer ID"
        required
      />
      <input
        className="inputt"
        type="text"
        value={distributerId}
        onChange={(e) => setDistributerId(e.target.value)}
        placeholder="Distributer ID"
        required
      />
      <input
        className="inputt"
        type="text"
        value={produceId}
        onChange={(e) => setProduceId(e.target.value)}
        placeholder="Produce ID"
        required
      />
      <input
        className="inputt"
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product name"
        required
      />
      <input
        className="inputt"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
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
        <option value="Quintal">Quintal</option>
        <option value="Ton">Ton</option>
      </select>
      <input
        className="inputt"
        type="number"
        value={pricePerUnit}
        onChange={handlePricePerUnitChange}
        placeholder="Price per unit"
        required
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
        <option value="Cheque">Cheque</option>
      </select>
      <input
        className="inputt"
        type="date"
        value={expectedDeliveryDate}
        onChange={(e) => setExpectedDeliveryDate(e.target.value)}
        placeholder="Expected Delivery Date"
        required
      />
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
