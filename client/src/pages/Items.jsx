import React, { useState, useEffect } from "react";
import api from "../services/api";
import ItemCard from "../components/ItemCard";

function Items() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/items");
        setItems(res.data);
        setFilteredItems(res.data); // Initially set filteredItems to all items
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let updatedItems = [...items]; // Create a shallow copy of the items array

    // Filter by active status (All, Found, Lost)
    if (activeFilter !== "All") {
      updatedItems = updatedItems.filter(
        (item) => item.status === activeFilter
      );
    }

    // Filter by search term
    if (searchTerm) {
      updatedItems = updatedItems.filter(
        (item) =>
          item.name &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(updatedItems);
  }, [items, searchTerm, activeFilter]);

  return (
    <div className="container mx-auto min-h-screen bg-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Lost and Found Items
      </h1>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setActiveFilter("All")}
                className={`px-5 py-2 ${
                  activeFilter === "All"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-indigo-600 border border-indigo-600"
                } 
                  rounded-md transition-colors font-medium hover:bg-indigo-700 hover:text-white`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("Found")}
                className={`px-5 py-2 ${
                  activeFilter === "Found"
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-600 border border-green-600"
                } 
                  rounded-md transition-colors font-medium hover:bg-green-700 hover:text-white`}
              >
                Found
              </button>
              <button
                onClick={() => setActiveFilter("Lost")}
                className={`px-5 py-2 ${
                  activeFilter === "Lost"
                    ? "bg-red-600 text-white"
                    : "bg-white text-red-600 border border-red-600"
                } 
                  rounded-md transition-colors font-medium hover:bg-red-700 hover:text-white`}
              >
                Lost
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No items found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}

export default Items;
