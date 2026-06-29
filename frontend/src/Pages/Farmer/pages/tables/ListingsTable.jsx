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
    setEditedPrice(listings[index].price.replace(" Rs", ""));
    setEditedQuantity(listings[index].quantity);
  };

  const handleSave = async (index) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) return;

      const token = localStorage.getItem("token");
      const listing = listings[index];

      const response = await fetch(
        `http://localhost:5000/api/products/${listing._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            price: parseFloat(editedPrice),
            quantity: parseInt(editedQuantity),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      const updatedListings = [...listings];
      updatedListings[index].price = `${editedPrice} Rs`;
      updatedListings[index].quantity = editedQuantity;
      setListings(updatedListings);
      toast.success("Listing updated successfully");

      // Trigger notification update in dashboard
      localStorage.setItem("readNotificationsFarmer", JSON.stringify([]));
      window.dispatchEvent(new Event("storage"));

      setEditingIndex(null);
      setEditedPrice("");
      setEditedQuantity("");
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
    }
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
            Status
          </th>
          <th
            style={{
              border: "2px solid black",
              padding: "10px",
              fontWeight: "bolder",
              color: "green",
            }}
          >
            Action
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
                    src={listing.images[0]}
                    alt={listing.name}
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
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {listing.name || "-"}
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {listing.category || "-"}
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
                    type="text"
                    value={editedQuantity}
                    onChange={(e) => setEditedQuantity(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  listing.quantity || "-"
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
                    style={{
                      width: "100%",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  listing.price || "-"
                )}
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                }}
              >
                {listing.status || "-"}
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
                    <button
                      onClick={() => handleSave(index)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(index)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
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
