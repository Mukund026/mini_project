import { toast } from "react-toastify";
import "./addProduct.css";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { getContract } from "../../../blockchain/wallet.js";
import { ethers } from "ethers";

const produceOptions = [
  { value: "Rice", label: "Rice" },
  { value: "Wheat", label: "Wheat" },
  { value: "Maize", label: "Maize" },
  { value: "Barley", label: "Barley" },
  { value: "Jowar", label: "Jowar" },
  { value: "Bajra", label: "Bajra" },
  { value: "Ragi", label: "Ragi" },
  { value: "Chickpeas", label: "Chickpeas" },
  { value: "Pigeon Pea", label: "Pigeon Pea" },
  { value: "Green Gram", label: "Green Gram" },
  { value: "Black Gram", label: "Black Gram" },
  { value: "Lentils", label: "Lentils" },
  { value: "Peas", label: "Peas" },
  { value: "Turmeric", label: "Turmeric" },
  { value: "Cardamom", label: "Cardamom" },
  { value: "Black Pepper", label: "Black Pepper" },
  { value: "Cumin", label: "Cumin" },
  { value: "Coriander", label: "Coriander" },
  { value: "Fenugreek", label: "Fenugreek" },
  { value: "Mustard Seeds", label: "Mustard Seeds" },
  { value: "Fennel", label: "Fennel" },
  { value: "Clove", label: "Clove" },
  { value: "Nutmeg", label: "Nutmeg" },
  { value: "Groundnut", label: "Groundnut" },
  { value: "Soybean", label: "Soybean" },
  { value: "Sunflower", label: "Sunflower" },
  { value: "Sesame", label: "Sesame" },
  { value: "Castor", label: "Castor" },
  { value: "Linseed", label: "Linseed" },
  { value: "Coconut", label: "Coconut" },
  { value: "Sugarcane", label: "Sugarcane" },
  { value: "Cotton", label: "Cotton" },
  { value: "Jute", label: "Jute" },
  { value: "Tobacco", label: "Tobacco" },
  { value: "Tea", label: "Tea" },
  { value: "Coffee", label: "Coffee" },
  { value: "Rubber", label: "Rubber" },
  { value: "Mango", label: "Mango" },
  { value: "Banana", label: "Banana" },
  { value: "Apple", label: "Apple" },
  { value: "Grapes", label: "Grapes" },
  { value: "Guava", label: "Guava" },
  { value: "Papaya", label: "Papaya" },
  { value: "Pomegranate", label: "Pomegranate" },
  { value: "Orange", label: "Orange" },
  { value: "Litchi", label: "Litchi" },
  { value: "Pineapple", label: "Pineapple" },
  { value: "Watermelon", label: "Watermelon" },
  { value: "Sapota", label: "Sapota" },
  { value: "Potato", label: "Potato" },
  { value: "Onion", label: "Onion" },
  { value: "Tomato", label: "Tomato" },
  { value: "Brinjal", label: "Brinjal" },
  { value: "Cabbage", label: "Cabbage" },
  { value: "Cauliflower", label: "Cauliflower" },
  { value: "Carrot", label: "Carrot" },
  { value: "Okra", label: "Okra" },
  { value: "Spinach", label: "Spinach" },
  { value: "Bitter Gourd", label: "Bitter Gourd" },
  { value: "Bottle Gourd", label: "Bottle Gourd" },
  { value: "Pumpkin", label: "Pumpkin" },
  { value: "Milk", label: "Milk" },
  { value: "Eggs", label: "Eggs" },
  { value: "Fish", label: "Fish" },
  { value: "Honey", label: "Honey" },
  { value: "Flowers", label: "Flowers" },
];

const categorySelect = [
  { value: "Cereals", label: "Cereals" },
  { value: "Pulses", label: "Pulses" },
  { value: "Spices", label: "Spices" },
  { value: "Oilseeds", label: "Oilseeds" },
  { value: "Cash Crops", label: "Cash Crops" },
  { value: "Fruits", label: "Fruits" },
  { value: "Vegetables", label: "Vegetables" },
  { value: "Others", label: "Others" },
];

const liquidProduces = ["Milk", "Honey"];

const allQuantitySelect = [
  { value: "Kg", label: "Kg" },
  { value: "Quintal", label: "Quintal" },
  { value: "Ton", label: "Ton" },
  { value: "Liters", label: "Liters" },
];

const nonLiquidQuantitySelect = [
  { value: "Kg", label: "Kg" },
  { value: "Quintal", label: "Quintal" },
  { value: "Ton", label: "Ton" },
];

const produceToCategory = {
  Rice: "Cereals",
  Wheat: "Cereals",
  Maize: "Cereals",
  Barley: "Cereals",
  Jowar: "Cereals",
  Bajra: "Cereals",
  Ragi: "Cereals",
  Chickpeas: "Pulses",
  "Pigeon Pea": "Pulses",
  "Green Gram": "Pulses",
  "Black Gram": "Pulses",
  Lentils: "Pulses",
  Peas: "Pulses",
  Turmeric: "Spices",
  Cardamom: "Spices",
  "Black Pepper": "Spices",
  Cumin: "Spices",
  Coriander: "Spices",
  Fenugreek: "Spices",
  "Mustard Seeds": "Spices",
  Fennel: "Spices",
  Clove: "Spices",
  Nutmeg: "Spices",
  Groundnut: "Oilseeds",
  Soybean: "Oilseeds",
  Sunflower: "Oilseeds",
  Sesame: "Oilseeds",
  Castor: "Oilseeds",
  Linseed: "Oilseeds",
  Coconut: "Cash Crops",
  Sugarcane: "Cash Crops",
  Cotton: "Cash Crops",
  Jute: "Cash Crops",
  Tobacco: "Cash Crops",
  Tea: "Cash Crops",
  Coffee: "Cash Crops",
  Rubber: "Cash Crops",
  Mango: "Fruits",
  Banana: "Fruits",
  Apple: "Fruits",
  Grapes: "Fruits",
  Guava: "Fruits",
  Papaya: "Fruits",
  Pomegranate: "Fruits",
  Orange: "Fruits",
  Litchi: "Fruits",
  Pineapple: "Fruits",
  Watermelon: "Fruits",
  Sapota: "Fruits",
  Potato: "Vegetables",
  Onion: "Vegetables",
  Tomato: "Vegetables",
  Brinjal: "Vegetables",
  Cabbage: "Vegetables",
  Cauliflower: "Vegetables",
  Carrot: "Vegetables",
  Okra: "Vegetables",
  Spinach: "Vegetables",
  "Bitter Gourd": "Vegetables",
  "Bottle Gourd": "Vegetables",
  Pumpkin: "Vegetables",
  Milk: "Others",
  Eggs: "Others",
  Fish: "Others",
  Honey: "Others",
  Flowers: "Others",
};

export default function AddProductForm() {
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [category, setCategory] = useState(null);
  const [quantityValue, setQuantityValue] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [quantitySelect, setQuantitySelect] = useState(allQuantitySelect);
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [images, setImages] = useState([]);
  const [selectedFilesText, setSelectedFilesText] = useState("Choose Files");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // Check if user is logged in and is a retailer
    if (!user || !user.id || user.role !== "retailer") {
      window.location.href = "/login";
      return;
    }
  }, []);

  return (
    <div className="container21">
      <div className="container2">
        <form onSubmit={handleSubmit}>
          <div className="Input">
            <label htmlFor="produce" className="item">
              Select Produce
            </label>
            <Select
              id="produce"
              value={selectedProduce}
              onChange={(selectedOption) => {
                setSelectedProduce(selectedOption);
                if (selectedOption) {
                  const autoCategory = produceToCategory[selectedOption.value];
                  const categoryOption = categorySelect.find(
                    (cat) => cat.value === autoCategory
                  );
                  setCategory(categoryOption || null);
                  // Update quantitySelect based on produce type
                  if (liquidProduces.includes(selectedOption.value)) {
                    setQuantitySelect([{ value: "Liters", label: "Liters" }]);
                  } else {
                    setQuantitySelect(nonLiquidQuantitySelect);
                  }
                  // Reset quantity selection
                  setQuantity(null);
                } else {
                  setCategory(null);
                  setQuantitySelect(allQuantitySelect);
                  setQuantity(null);
                }
              }}
              options={produceOptions}
              placeholder="Choose One"
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? "rgba(100, 143, 39, 0.7)" // Olive green highlight on hover
                    : "white", // Default white background
                  color: state.isFocused ? "white" : "black", // White text on hover, black otherwise
                  fontWeight: "bold", // Bold text
                  cursor: "pointer", // Pointer cursor on hover
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white", // White text
                  padding: "12px", // Comfortable spacing
                  caretColor: "transparent", // Hide blinking cursor
                  border: "none", // Remove grey line
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "rgba(255, 255, 255, 0.8)",
                  padding: "0px 0px 30px 0px",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "white", // White text for selected value
                  padding: "0px 0px 35px",
                }),
                menu: (provided) => ({
                  ...provided,
                  width: "300px", // Match control width for proper fit
                }),
                control: (provided, state) => ({
                  ...provided,
                  width: "300px", // Match input width
                  padding: 0, // No internal padding
                  margin: "5px 10px 5px 10px", // External spacing
                  borderRadius: "8px", // Rounded corners
                  fontSize: "14px", // Text size
                  fontWeight: "600", // Bold text
                  transition: "all 0.3s ease", // Smooth transitions
                  outline: "none", // Removes default focus outline
                  height: "40px", // Fixed height
                  background:
                    "linear-gradient(145deg, #a9c69f 0%, #a8df8e 100%)", // Gradient background
                  border: "2px solid #6b8e23", // Olive green border
                  color: "white", // Text color
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(107, 142, 35, 0.2)"
                    : "none", // Glow effect on focus
                  transform: state.isFocused ? "scale(1.02)" : "none", // Slight zoom on focus
                }),
                indicatorSeparator: () => ({
                  display: "none", // Completely hides the vertical separator line
                }),

                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: "0px 0px 30px 0px",
                }),
              }}
            />
          </div>

          <div className="Input">
            <label htmlFor="category" className="item">
              Select Category
            </label>
            <Select
              id="category"
              value={category}
              options={categorySelect}
              placeholder="Auto-selected based on produce"
              isDisabled={true}
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? "rgba(100, 143, 39, 0.7)" // Olive green highlight on hover
                    : "white", // Default white background
                  color: state.isFocused ? "white" : "black", // White text on hover, black otherwise
                  fontWeight: "bold", // Bold text
                  cursor: "pointer", // Pointer cursor on hover
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white", // White text
                  padding: "12px", // Comfortable spacing
                  caretColor: "transparent", // Hide blinking cursor
                  border: "none", // Remove grey line
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
                  padding: "0px 0px 30px 0px",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "white", // White text for selected value
                  padding: "0px 0px 35px",
                }),
                menu: (provided) => ({
                  ...provided,
                  width: "300px", // Match control width for proper fit
                }),
                control: (provided, state) => ({
                  ...provided,
                  width: "300px", // Match input width
                  padding: 0, // No internal padding
                  margin: "5px 10px 5px 10px", // External spacing
                  borderRadius: "8px", // Rounded corners
                  fontSize: "14px", // Text size
                  fontWeight: "600", // Bold text
                  transition: "all 0.3s ease", // Smooth transitions
                  outline: "none", // Removes default focus outline
                  height: "40px", // Fixed height
                  background:
                    "linear-gradient(145deg, #a9c69f 0%, #a8df8e 100%)", // Gradient background
                  border: "2px solid #6b8e23", // Olive green border
                  color: "white", // Text color
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(107, 142, 35, 0.2)"
                    : "none", // Glow effect on focus
                  transform: state.isFocused ? "scale(1.02)" : "none", // Slight zoom on focus
                }),
                indicatorSeparator: () => ({
                  display: "none", // Completely hides the vertical separator line
                }),

                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: "0px 0px 30px 0px",
                }),
              }}
            />
          </div>

          <div className="Input quantity">
            <label htmlFor="quantity" className="item">
              Quantity
            </label>
            <input
              type="text"
              value={quantityValue}
              onChange={(e) => setQuantityValue(e.target.value)}
              placeholder="Enter the Quantity"
            />
            <Select
              name="qty"
              id="qty"
              value={quantity}
              onChange={setQuantity}
              options={quantitySelect}
              placeholder="Unit"
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? "rgba(100, 143, 39, 0.7)" // Olive green highlight on hover
                    : "white", // Default white background
                  color: state.isFocused ? "white" : "black", // White text on hover, black otherwise
                  fontWeight: "bold", // Bold text
                  cursor: "pointer", // Pointer cursor on hover
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white", // White text
                  padding: "10px", // Comfortable spacing
                  caretColor: "transparent", // Hide blinking cursor
                  border: "none", // Remove grey line
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
                  padding: "0px 0px 30px 0px",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "white", // White text for selected value
                  fontWeight: "600",
                  lineHeight: "10px", // Match control height
                  padding: "0px 0px 35px", // Horizontal padding only
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }),
                control: (provided, state) => ({
                  ...provided,
                  width: "100px", // Fixed width as in CSS
                  height: "30px", // Match parent height
                  padding: 0, // No internal padding
                  borderRadius: "8px", // Rounded right corners
                  fontSize: "14px", // Text size
                  fontWeight: "600", // Bold text
                  transition: "all 0.3s ease", // Smooth transitions
                  outline: "none", // Removes default focus outline
                  background: "linear-gradient(145deg, #a8df8e 100%)", // Gradient background
                  color: "white", // Text color
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(107, 142, 35, 0.2)"
                    : "none", // Glow effect on focus
                  transform: state.isFocused ? "scale(1.02)" : "none", // Slight zoom on focus
                }),
                indicatorSeparator: () => ({
                  display: "none", // Completely hides the vertical separator line
                }),

                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: "0px 0px 30px 0px",
                }),
              }}
            />
          </div>

          <div className="Input">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter the Price in Rupees"
            />
          </div>

          <div className="Input">
            <label htmlFor="location">Location</label>
            <input
              name="loc"
              id="loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your Location"
            />
          </div>

          <div className="Input">
            <label htmlFor="availablility">Availablility</label>
            <input
              type="date"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Available from"
            />
          </div>

          <div className="Input">
            <label htmlFor="images">Images</label>
            <div className="file-input-container">
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setImages((prev) => {
                    const combined = [...prev, ...newFiles];
                    // Remove duplicates based on file name
                    const unique = combined.filter(
                      (file, index, self) =>
                        index === self.findIndex((f) => f.name === file.name)
                    );
                    if (unique.length > 0) {
                      setSelectedFilesText(
                        `${unique.length} file${
                          unique.length > 1 ? "s" : ""
                        } selected`
                      );
                    } else {
                      setSelectedFilesText("Choose Files");
                    }
                    return unique;
                  });
                }}
                className="file-input"
              />
              <label htmlFor="images" className="file-input-label">
                <span className="file-text">{selectedFilesText}</span>
                {images.length > 0 && (
                  <div className="file-letters">
                    {images.map((file, index) => (
                      <span key={index} className="file-letter-circle">
                        {file.name.charAt(0).toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="Input">
            <label htmlFor="description">Description</label>
            <textarea
              name="descr"
              id="descr"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product here"
            ></textarea>
          </div>

          <button
            type="submit"
            onClick={async () => {
              if (
                !selectedProduce ||
                !category ||
                !quantityValue ||
                !quantity ||
                !price ||
                !location ||
                !availability ||
                images.length === 0 ||
                !description
              ) {
                toast.warning("Fill all the details Correctly");
              } else {
                try {
                  const user = JSON.parse(localStorage.getItem("user"));
                  if (!user || !user.id) {
                    toast.error("User not logged in");
                    return;
                  }

                  // Create FormData for multipart/form-data upload
                  const formData = new FormData();
                  formData.append("name", selectedProduce.label);
                  formData.append("category", category.label);
                  formData.append("quantity", parseFloat(quantityValue));
                  formData.append("price", parseFloat(price));
                  formData.append("description", description);
                  formData.append("listedBy", user.id);
                  formData.append("role", "retailer");

                  // Append images as files
                  images.forEach((file, index) => {
                    formData.append("images", file);
                  });

                  const token = localStorage.getItem("token");
                  const response = await fetch(
                    "http://localhost:5000/api/products/add",
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      body: formData, // Send FormData instead of JSON
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Failed to add product");
                  }

                  const productData = await response.json();

                  // Generate unique productId for blockchain
                  const productId = ethers.id(
                    selectedProduce.label + Date.now().toString()
                  );

                  // Create product on blockchain
                  try {
                    const contract = await getContract();
                    const tx = await contract.createProduct(
                      productId,
                      selectedProduce.label,
                      category.label,
                      parseInt(quantityValue),
                      parseInt(price),
                      "Good", // quality
                      description // metaUri
                    );
                    await tx.wait();
                    toast.success("Product Added Successfully to Blockchain");
                  } catch (blockchainError) {
                    console.error("Blockchain error:", blockchainError);
                    toast.warning(
                      "Product added to database, but blockchain update failed"
                    );
                  }

                  // Refresh the page to update listings
                  window.location.reload();
                } catch (error) {
                  console.error("Error adding product:", error);
                  toast.error("Failed to add product");
                }
              }
            }}
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
