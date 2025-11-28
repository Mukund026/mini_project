import ListingT from "../../Farmer/pages/tables/listingsTableDistributer";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import "./browse.css";

const Browse = () => {
  const [combinedListings, setCombinedListings] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/products/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        // Filter to show only farmer products for distributor view
        const filteredData = data.filter((item) => item.role === "farmer");
        const combined = filteredData.map((item) => ({
          ...item,
          source: "Farmer",
        }));
        setCombinedListings(combined);
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast.error("Failed to load listings");
      }
    };

    fetchListings();
  }, []);

  const filteredAndSortedListings = useMemo(() => {
    let filtered = combinedListings;
    if (searchQuery) {
      filtered = combinedListings.filter(
        (listing) =>
          listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (!sortBy) return filtered;
    return [...filtered].sort((a, b) => {
      if (sortBy === "price") {
        return a.price - b.price;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "source") {
        return a.source.localeCompare(b.source);
      }
      return 0;
    });
  }, [combinedListings, sortBy, searchQuery]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy === sortBy ? null : newSortBy);
  };

  return (
    <div>
      <div className="browseContainer">
        <input
          type="text"
          placeholder="Search by name, category, or source..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="searchInput"
        />
      </div>
      <ListingT
        listings={filteredAndSortedListings}
        userType="distributer"
        sortBy={sortBy}
        onSortChange={handleSortChange}
        isBrowse={true}
      />
    </div>
  );
};

export default Browse;
