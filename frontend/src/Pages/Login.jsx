import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import React, { useState } from "react";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [userType, setUserType] = useState(null);

  const userOptions = [
    { value: "farmer", label: "Farmer" },
    { value: "distributer", label: "Distributer" },
    { value: "retailer", label: "Retailer" },
    { value: "consumer", label: "Consumer" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formdata;
    if (!email || !password || !userType) {
      toast.error("Please fill all fields!", { closeButton: false });
      return;
    }

    try {
      //Api call
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        userType: userType.value,
      });

      toast.success(res.data.message || "Login successful!", {
        closeButton: false,
      });

      //store the returned token

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("loginMessage", res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      switch (userType.value) {
        case "farmer":
          navigate("/Overview");
          break;
        case "distributer":
          navigate("/distributer");
          break;
        case "retailer":
          navigate("/retailer");
          break;
        case "consumer":
          navigate("/consumere");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!", {
        closeButton: false,
      });
    }
  };

  return (
    <div className="login-wrapper">
      {/* <div className="container"> */}
        <div className="container1">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formdata.username}
              onChange={handleChange}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity("Username cannot be empty")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formdata.email}
              onChange={handleChange}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity("Please enter a valid email")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
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
                  background:
                    "linear-gradient(145deg, #a9c69f 0%, #a8df8e 100%)",
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
                  width: "238px",
                  marginRight: "0px",
                  padding: "0px 0px 35px 0px",
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  color: "#333",
                  padding: "0px 0px 35px 0px",
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white",
                  padding: "12px",
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
              components={{ IndicatorSeparator: () => null }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formdata.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
            <div className="last">
              <div className="last1">Don't have an account?</div>
              <div className="last2" onClick={() => navigate("/signup")}>
                Signup
              </div>
            </div>
          </form>
        </div>
      {/* </div> */}
    </div>
  );
};

export default Login;
