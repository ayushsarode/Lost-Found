import React from 'react';
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  // Determine status color based on 'Lost' or 'Found'
  const statusColor = item.status === 'Lost'
    ? 'bg-red-100 text-red-500' // Red color for 'Lost'
    : 'bg-green-100 text-green-500'; // Green color for 'Found'

  return (
    <Link to={`/items/${item._id}`}>
      <div className="border border-gray-300 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Display the image if it exists */}
        {item.image && (
          <img
            src={`http://localhost:5000/${item.image}`} // Adjust based on your image path
            alt={item.title}
            className="w-full h-48 object-cover mb-4 rounded"
          />
        )}
        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
        <p className="text-gray-700 mb-4">
          {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
        </p>

        

        {/* Apply conditional class to status badge */}
        <span className={`block py-1 px-3 rounded-full text-sm ${statusColor}`}>
          {item.status}
        </span>
      </div>
    </Link>
  );
}

export default ItemCard;
