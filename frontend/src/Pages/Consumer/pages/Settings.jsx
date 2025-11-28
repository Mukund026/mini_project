import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./settings.css";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    preferences: {
      notifications: true,
      language: "English",
    },
  });

  useEffect(() => {
    // Simulate API call to fetch user profile
    const fetchProfile = async () => {
      try {
        // Replace with actual API call: const response = await fetch('/api/user/profile');
        // const data = await response.json();
        // setProfile(data);

        // For now, using localStorage to simulate
        const storedProfile = JSON.parse(
          localStorage.getItem("consumerProfile") || "{}"
        );
        setProfile({ ...profile, ...storedProfile });
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProfile({
        ...profile,
        preferences: { ...profile.preferences, [name]: checked },
      });
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile({
        ...profile,
        [parent]: { ...profile[parent], [child]: value },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      // Simulate API call to save profile
      // Replace with actual API call: await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(profile) });

      // For now, using localStorage to simulate
      localStorage.setItem("consumerProfile", JSON.stringify(profile));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <form className="settings-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="preferences.language">Language:</label>
          <select
            id="preferences.language"
            name="preferences.language"
            value={profile.preferences.language}
            onChange={handleInputChange}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="notifications"
              checked={profile.preferences.notifications}
              onChange={handleInputChange}
            />
            Enable Notifications
          </label>
        </div>
        <button type="button" onClick={handleSave}>
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
