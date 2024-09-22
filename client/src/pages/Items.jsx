import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';

function Items() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        setItems(res.data);
        setFilteredItems(res.data); // Initially set filteredItems to all items
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let updatedItems = [...items]; // Create a shallow copy of the items array

    // Filter by active status (All, Found, Lost)
    if (activeFilter !== 'All') {
      updatedItems = updatedItems.filter(item => item.status === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      updatedItems = updatedItems.filter(item =>
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(updatedItems);
  }, [items, searchTerm, activeFilter]);

  return (
    <div className="container mx-auto h-screen bg-white w-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Lost and Found Items</h1>
      <div className="mb-4 text-center">
        <div className='flex'>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 mr-2"
          />
          <div className='flex gap-5'>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-7 py-2 bg-indigo-500 text-white rounded-full"
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('Found')}
              className="px-7 py-2 bg-indigo-500 text-white rounded-full"
            >
              Found
            </button>
            <button
              onClick={() => setActiveFilter('Lost')}
              className="px-7 py-2 bg-indigo-500 text-white rounded-full"
            >
              Lost
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ItemCard key={item._id} item={item} />
          ))
        ) : (
          <p className="text-center">No items found</p>
        )}
      </div>
    </div>
  );
}

export default Items;
