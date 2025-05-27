import React, { useState } from "react";
import { Link } from "react-router-dom";

// Get base URL from environment or default to localhost
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ItemCard({ item }) {
  const [imageError, setImageError] = useState(false);
  
  // Determine status color based on 'Lost' or 'Found'
  const statusColor =
    item.status?.toLowerCase() === "lost"
      ? "bg-red-100 text-red-500 border border-red-200" // Red color for 'Lost'
      : "bg-green-100 text-green-500 border border-green-200"; // Green color for 'Found'
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Check if it's already a full URL (Cloudinary)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a local path, prepend the base URL
    return `${baseURL}/${imagePath}`;
  };
  
  const imageUrl = getImageUrl(item.image);
  
  return (
    <Link to={`/items/${item._id}`} className="block h-full">
      <div className="border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
        {/* Display the image if it exists */}
        <div className="relative mb-4">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-52 object-cover rounded-md"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-52 bg-gray-100 rounded-md flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          
          {/* Status badge positioned on the image */}
          <span
            className={`absolute top-2 right-2 py-1 px-3 rounded-full text-sm font-medium ${statusColor}`}
          >
            {item.status}
          </span>
        </div>
        
        <h2 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h2>
        
        <p className="text-gray-600 mb-4 flex-grow">
          {item.description &&
            (item.description.length > 100
              ? `${item.description.substring(0, 100)}...`
              : item.description)}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-indigo-500 text-sm font-medium">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;