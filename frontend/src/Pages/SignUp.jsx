import "./signup.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

const Signup = () => {
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [userType, setUserType] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const userOptions = [
    { value: "farmer", label: "Farmer" },
    { value: "distributer", label: "Distributor" },
    { value: "retailer", label: "Retailer" },
    { value: "consumer", label: "Consumer" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not installed!", { closeButton: false });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      toast.success("Wallet connected successfully!", { closeButton: false });
    } catch (error) {
      toast.error("Failed to connect wallet!", { closeButton: false });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirm_password } = formdata;

    if (
      !username ||
      !email ||
      !password ||
      !confirm_password ||
      !userType ||
      !walletAddress
    ) {
      toast.error("Please fill all fields and connect your wallet!", {
        closeButton: false,
      });
      return;
    }

    if (password !== confirm_password) {
      toast.warning("Passwords do not match!", { closeButton: false });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: username,
        email,
        password,
        userType: userType.value,
        walletAddress,
      });
      toast.success(res.data.message || "Signup successful!", {
        closeButton: false,
      });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed!", {
        closeButton: false,
      });
    }
  };

  return (
    <div className="container">
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Signup</h1>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formdata.username}
            onChange={handleChange}
            onInvalid={(e) =>
              e.target.setCustomValidity("Username cannot be empty")
            }
            onInput={(e) => e.target.setCustomValidity("")}
            required
          />
          <br />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formdata.email}
            onChange={handleChange}
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter a valid email")
            }
            onInput={(e) => e.target.setCustomValidity("")}
            required
          />
          <br />
          <Select
            options={userOptions}
            value={userType}
            onChange={(selectedOption) => setUserType(selectedOption)}
            placeholder="Select user type"
            styles={{
              control: (provided, state) => ({
                ...provided,
                width: "100%",
                padding: 0,
                margin: "5px 10px 5px 10px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                outline: "none",
                height: "40px",
                background: "linear-gradient(145deg, #a9c69f 0%, #a8df8e 100%)",
                border: "2px solid #6b8e23",
                color: "white",
                boxShadow: state.isFocused
                  ? "0 0 0 3px rgba(107, 142, 35, 0.2)"
                  : "none",
                transform: state.isFocused ? "scale(1.02)" : "none",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "white",
              }),
              placeholder: (provided) => ({
                ...provided,
                color: "rgba(255, 255, 255, 0.8)",
                width: "235px",
                padding: "0px 0px 35px 0px",
              }),
              input: (provided) => ({
                ...provided,
                color: "white",
                padding: "12px",
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                display: "flex",
                alignItems: "center",
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                color: "#333",
                padding: "0px 0px 35px 0px",
              }),
              menu: (provided) => ({
                ...provided,
                borderRadius: "5px",
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused
                  ? "rgba(100, 143, 39, 0.7)"
                  : "white",
                color: state.isFocused ? "white" : "black",
                fontWeight: "bold",
                cursor: "pointer",
              }),
            }}
            components={{
              IndicatorSeparator: () => null, // removes the vertical separator line
            }}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formdata.password}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formdata.confirm_password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="button" onClick={connectWallet} disabled={isConnecting}>
            {isConnecting
              ? "Connecting..."
              : walletAddress
              ? "Wallet Connected"
              : "Connect Wallet"}
          </button>
          <br />
          <button type="submit">Signup</button>
          <div className="last">
            <div className="last1">already have an account?</div>
            <div
              className="last2"
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
