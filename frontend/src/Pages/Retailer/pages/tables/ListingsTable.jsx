import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ListingsTable = () => {
  const [listings, setListings] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) return;

        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/products/byuser/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast.error("Failed to load listings");
      }
    };

    fetchListings();
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedPrice(listings[index].price);
    setEditedQuantity(listings[index].quantity);
  };

  const handleSave = (index) => {
    const updatedListings = [...listings];
    updatedListings[index].price = editedPrice;
    updatedListings[index].quantity = editedQuantity;
    setListings(updatedListings);
    localStorage.setItem("retailerListings", JSON.stringify(updatedListings));
    setEditingIndex(null);
    setEditedPrice("");
    setEditedQuantity("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedPrice("");
    setEditedQuantity("");
  };

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th
            style={{
              border: "2px solid black",
              padding: "10px",
              fontWeight: "bolder",
              color: "green",
            }}
          >
            Images
          </th>
          <th
            style={{
              border: "2px solid black",
              padding: "10px",
              fontWeight: "bolder",
              color: "green",
            }}
          >
            Name
          </th>
          <th
            style={{
              border: "2px solid black",
              padding: "10px",
              fontWeight: "bolder",
              color: "green",
            }}
          >
            Category
          </th>
          <th
            style={{
              border: "2px solid black",
              padding: "10px",
              fontWeight: "bolder",
              color: "green",
            }}
          >
            Quantity
          </th>
          <th
            style={{
              border: "2px solid black",
              padding: "10px",
              fontWeight: "bolder",
              color: "green",
            }}
          >
            Price
          </th>
          <th
            style={{
              border: "2px solid black",
              padding: "10px",
              fontWeight: "bolder",
              color: "green",
            }}
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {listings.length > 0 ? (
          listings.map((listing, index) => (
            <tr key={index}>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${listing.images[0]}`}
                    alt={listing.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {listing.name}
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {listing.category}
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editedQuantity}
                    onChange={(e) => setEditedQuantity(e.target.value)}
                  />
                ) : (
                  listing.quantity
                )}
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                  />
                ) : (
                  listing.price
                )}
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {editingIndex === index ? (
                  <>
                    <button onClick={() => handleSave(index)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(index)}>Edit</button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <>
            <tr>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                -
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};

export default ListingsTable;
