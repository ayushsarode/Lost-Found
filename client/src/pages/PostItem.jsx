import React, { useState } from 'react';
import api from '../services/api';

function PostItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Lost');
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState(''); // Add state for phone number

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('phone', phone); // Include phone in formData
    if (image) {
      formData.append('image', image);
    }

    try {
      // Get the token from localStorage (or wherever you store it)
      const token = localStorage.getItem('token');

      await api.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add the token to the headers
        },
      });
      alert('Item posted successfully!');
      // Reset form fields
      setTitle('');
      setDescription('');
      setStatus('Lost');
      setPhone(''); // Reset phone number
      setImage(null);
    } catch (error) {
      alert('Failed to post item');
      console.error(error.response ? error.response.data : error);
    }
  };

  return (
    <div className=' h-[78vh]  bg-indigo-200 flex items-center mt-7 rounded-lg'>
    <form onSubmit={handleSubmit} className="p-6 bg-white w-[40rem]  mx-auto  rounded-lg shadow-2xl">
      <h2 className="text-2xl font-bold mb-4">Post Item</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 mb-4 border border-gray-300 rounded">
        <option value="Lost">Lost</option>
        <option value="Found">Found</option>
      </select>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
      >
        Post Item
      </button>
    </form>
    </div>
  );
}

export default PostItem;
