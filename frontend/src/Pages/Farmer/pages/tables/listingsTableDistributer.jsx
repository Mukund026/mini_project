import "./LTD.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../../Distributer/pages/form/form";
import Modal from "react-modal"; // Assuming react-modal is installed, or use a simple div modal

const ListingsTableDistributer = ({
  listings: propListings,
  userType = "distributer",
  sortBy,
  onSortChange,
  isBrowse = false,
}) => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user ? user.role : "distributer";

    if (propListings) {
      if (isBrowse) {
        // For browse, use the passed listings directly
        setListings(propListings);
      } else {
        // For "My Listing", filter to only show products listed by the current user
        const filteredListings = propListings.filter(
          (listing) => listing.listedBy === user.id
        );
        setListings(filteredListings);
      }
    } else {
      // Fetch products based on user role (for distributors: farmer products, for retailers: retailer products)
      const fetchListings = async () => {
        try {
          const token = localStorage.getItem("token");
          const endpoint = role === "retailer" ? "retailer" : "farmer";
          const response = await fetch(
            `http://localhost:5000/api/products/role/${endpoint}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint} products`);
          }

          const data = await response.json();
          // Add source to listings
          const listingsWithSource = data.map((listing) => ({
            ...listing,
            source: role === "retailer" ? "Distributor" : "Farmer",
          }));
          setListings(listingsWithSource);
        } catch (error) {
          console.error("Error fetching listings:", error);
          toast.error("Failed to load listings");
        }
      };

      fetchListings();
    }
  }, [propListings, isBrowse]);

  const orderBTN = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const addToCart = (listing) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role !== userType) {
      toast.warning("You are not authorized to add to this cart");
      return;
    }
    const cartKey =
      userType === "retailer" ? "retailerCart" : "distributerCart";
    const ordersKey =
      userType === "retailer" ? "retailerOrders" : "distributerOrders";
    const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || "[]");
    const orderedProductIds = existingOrders.map((order) => order.productId);
    if (orderedProductIds.includes(listing._id)) {
      toast.warning("Item already ordered!");
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const itemExists = existingCart.find(
      (item) => item.productId === listing._id
    );
    if (itemExists) {
      toast.warning("Item already in cart!");
      return;
    }
    existingCart.push({
      productId: listing._id,
      productName: listing.name,
      category: listing.category,
      quantity: 1, // default quantity
      price: listing.price,
      image: listing.images ? listing.images[0] : null,
    });
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    toast.success("Item added to cart!");
  };

  return (
    <>
      <div className="sortby">
        <h1>Sort By</h1>
        <div className="sortBy">
          <input
            type="checkbox"
            id="price"
            checked={sortBy === "price"}
            onChange={() => onSortChange && onSortChange("price")}
          />
          Price
          <input
            type="checkbox"
            id="name"
            checked={sortBy === "name"}
            onChange={() => onSortChange && onSortChange("name")}
          />
          Name
          <input
            type="checkbox"
            id="source"
            checked={sortBy === "source"}
            onChange={() => onSortChange && onSortChange("source")}
          />
          Source
        </div>
      </div>
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
              Source
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
                  {listing.quantity || "-"}
                </td>
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  {listing.price || "-"}
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
                  {listing.source || "Farmer"}
                </td>
                <td
                  style={{
                    border: "2px solid black",
                    padding: "10px",
                    fontWeight: "bolder",
                  }}
                >
                  {(() => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    const isRetailer = user && user.role === "retailer";
                    const isOwnProduct = user && user.id === listing.listedBy;
                    return isRetailer || !isOwnProduct ? (
                      <button
                        onClick={() => orderBTN(listing)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        OrderNow
                      </button>
                    ) : null;
                  })()}
                  <button
                    onClick={() => addToCart(listing)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Add to cart
                  </button>
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "auto",
            maxHeight: "80vh",
            padding: "20px",
            overflow: "auto",
          },
        }}
      >
        <Form selectedListing={selectedListing} />
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </>
  );
};

export default ListingsTableDistributer;
