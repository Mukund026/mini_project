import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import io from "socket.io-client";

const ListingsTable = ({
  listings: propListings,
  userType,
  sortBy,
  onSortChange,
  isBrowse,
}) => {
  const [listings, setListings] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

  useEffect(() => {
    if (isBrowse && propListings) { 
      // Use props for browse mode
      setListings(propListings);
      return;
    }

    const fetchListings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) return;

        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/products/distributer/${user.id}`,
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
  }, [isBrowse, propListings]);

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
    localStorage.setItem(
      "distributerListings",
      JSON.stringify(updatedListings)
    );
    setEditingIndex(null);
    setEditedPrice("");
    setEditedQuantity("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedPrice("");
    setEditedQuantity("");
  };

  const handleAddToCart = (listing) => {
    const cart = JSON.parse(localStorage.getItem("distributerCart") || "[]");
    const newItem = {
      productId: listing._id,
      productName: listing.name,
      category: listing.category,
      quantity: 1,
      price: listing.price,
      image: listing.images ? listing.images[0] : null,
    };
    cart.push(newItem);
    localStorage.setItem("distributerCart", JSON.stringify(cart));
    toast.success("Added to cart!");
  };

  const handlePlaceOrder = async (listing) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        toast.error("Please log in to place an order");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: listing._id,
          orderedBy: user.id,
          orderedByRole: "distributer",
          quantity: 1, // Default quantity for direct order
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      console.log("Order created:", data);

      // Record order on blockchain
      try {
        const contract = await getContract();
        const orderId = ethers.id(data._id + Date.now().toString());
        const tx = await contract.addTrace(
          listing._id,
          1, // quantity
          parseFloat(listing.price),
          "Ordered", // quality/status
          `Order placed by distributer: ${user.username}` // metaUri
        );
        await tx.wait();
        toast.success("Order placed successfully on blockchain!");
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
        toast.warning(
          "Order placed in database, but blockchain recording failed"
        );
      }

      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order");
    }
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
          {!isBrowse && (
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
          )}
          {!isBrowse && (
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
          )}
          {isBrowse && (
            <>
              <th
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                  color: "green",
                }}
              >
                Add to Cart
              </th>
              <th
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bolder",
                  color: "green",
                }}
              >
                Place Order
              </th>
            </>
          )}
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
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  {listing.status || "-"}
                </td>
              )}
              {!isBrowse && (
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
              )}
              {isBrowse && (
                <>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      fontWeight: "bolder",
                    }}
                  >
                    <button
                      onClick={() => handleAddToCart(listing)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Add to Cart
                    </button>
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      fontWeight: "bolder",
                    }}
                  >
                    <button
                      onClick={() => handlePlaceOrder(listing)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#FF9800",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Place Order
                    </button>
                  </td>
                </>
              )}
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
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {isBrowse && (
                <>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      fontWeight: "bolder",
                    }}
                  >
                    -
                  </td>
                </>
              )}
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
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
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
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
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
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
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
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {!isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
              {isBrowse && (
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  -
                </td>
              )}
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};

export default ListingsTable;
