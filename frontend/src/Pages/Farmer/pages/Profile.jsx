import "./Profile.css";
import React from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [location, setlocation] = useState("");
  const [phone, setPhone] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Check if user is logged in and is a farmer
    if (!user || !user.id || user.role !== 'farmer') {
      window.location.href = '/login';
      return;
    }

    const savedProfile =
      JSON.parse(localStorage.getItem("farmerProfile")) || {};
    setName(savedProfile.name || "");
    setlocation(savedProfile.location || "");
    setPhone(savedProfile.phone || "");
    setPreview(savedProfile.preview || null);
    setFarmerId(localStorage.getItem("userId") || "");
  }, []);

  const saveProfile = () => {
    const profileData = {
      name,
      location,
      phone,
      preview,
    };
    localStorage.setItem("farmerProfile", JSON.stringify(profileData));
    toast.success("Profile saved successfully!");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
    setShowMenu(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters long!");
      return;
    }
    // Here you can integrate with backend to change password
    alert("Password changed successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <Layout>
        <div className="profileContainer">
          <button id="logout" onClick={handleLogout}>
            Logout
          </button>

          <div style={{ position: "relative" }}>
            <div
              className="profileImageContainer"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img
                src={preview || "https://via.placeholder.com/200"}
                alt="Profile"
                className="profileImage"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            {showMenu && (
              <div className="menu">
                <div
                  onClick={() => {
                    if (preview) {
                      setViewImage(true);
                    }
                    setShowMenu(false);
                  }}
                >
                  View
                </div>
                <div onClick={triggerFileInput}>Edit</div>
                <div
                  onClick={() => {
                    setPreview(null);
                    setShowMenu(false);
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
          <div className="name">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="location">
            <label htmlFor="Location">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setlocation(e.target.value)}
              placeholder="Enter the location"
            />
          </div>
          <div className="phone">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="farmerId">
            <label htmlFor="farmerId">Farmer ID</label>
            <input
              type="text"
              value={farmerId}
              readOnly
              placeholder="Farmer ID"
            />
          </div>
          <div className="changepassword">
            <label htmlFor="password">Change Password</label>
            <div className="btn">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              <button onClick={changePassword}>Change Password</button>
            </div>
          </div>
          <button
            onClick={saveProfile}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "300px"
            }}
          >
            {name || location || phone || preview
              ? "Change Profile"
              : "Add Profile"}
          </button>
        </div>
      </Layout>
      {viewImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setViewImage(false)}
        >
          <img
            src={preview}
            alt="Profile"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
