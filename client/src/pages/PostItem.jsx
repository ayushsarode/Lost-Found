import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PostItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Lost");
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    // Debug: Check if token exists in localStorage
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
    
    if (!token) {
      setMessage({ type: "error", text: "Please log in first" });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("phone", phone);
    
    if (image) {
      formData.append("image", image);
    }

    try {
      console.log('Making request to /items with token');
      
      const response = await api.post("/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log('Success response:', response.data);
      setMessage({ type: "success", text: "Item posted successfully! Redirecting..." });
      
      // Reset form fields
      setTitle("");
      setDescription("");
      setStatus("Lost");
      setPhone("");
      setImage(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Navigate to items page after a short delay
      setTimeout(() => {
        navigate('/items');
      }, 2000);
      
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response ? error.response.data : 'No response data');
      console.error('Error status:', error.response ? error.response.status : 'No status');
      
      if (error.response?.status === 401) {
        setMessage({ type: "error", text: "Authentication failed. Please log in again." });
      } else {
        setMessage({ type: "error", text: "Failed to post item. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-indigo-25 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent mb-3">
            Post Lost or Found Item
          </h1>
          <p className="text-indigo-700 text-lg">Help reunite items with their owners</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200/50 p-8">
          
          {/* Success/Error Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border-2 transition-all duration-300 ${
              message.type === "success" 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-xl">
                  {message.type === "success" ? "✅" : "❌"}
                </span>
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Status Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 rounded-full p-1 flex">
                <button
                  type="button"
                  onClick={() => setStatus("Lost")}
                  className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                    status === "Lost"
                      ? "bg-indigo-500 text-white shadow-lg transform scale-105"
                      : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  📍 Lost Item
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Found")}
                  className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                    status === "Found"
                      ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                      : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  ✨ Found Item
                </button>
              </div>
            </div>

            {/* Title Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-indigo-700 mb-2">
                What item {status === "Lost" ? "did you lose" : "did you find"}?
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g., ${status === "Lost" ? "iPhone 13 Pro" : "Black Wallet"}`}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 placeholder-indigo-400 group-hover:border-indigo-300"
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-semibold text-indigo-700 mb-2">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide as much detail as possible - color, brand, distinctive features, where it was lost/found..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 placeholder-indigo-400 resize-none group-hover:border-indigo-300"
              />
            </div>

            {/* Phone Number */}
            <div className="group">
              <label className="block text-sm font-semibold text-indigo-700 mb-2">
                📞 Contact Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number for contact"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 placeholder-indigo-400 group-hover:border-indigo-300"
              />
            </div>

            {/* Image Upload */}
            <div className="group">
              <label className="block text-sm font-semibold text-indigo-700 mb-2">
                📸 Upload Photo (Optional)
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <div className="text-4xl">📷</div>
                  {image ? (
                    <div className="text-indigo-600 font-medium">
                      ✅ {image.name}
                    </div>
                  ) : (
                    <>
                      <div className="text-indigo-600 font-medium">
                        Drop your image here, or click to browse
                      </div>
                      <div className="text-sm text-indigo-400">
                        PNG, JPG up to 10MB
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                isSubmitting
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 hover:scale-105 shadow-lg hover:shadow-xl"
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                `🚀 Post ${status} Item`
              )}
            </button>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-indigo-50/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/50">
          <h3 className="font-semibold text-indigo-700 mb-3">💡 Tips for better results:</h3>
          <ul className="text-sm text-indigo-600 space-y-1">
            <li>• Include specific details like brand, model, color</li>
            <li>• Mention the location where it was lost/found</li>
            <li>• Add a clear photo if possible</li>
            <li>• Keep your contact information up to date</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PostItem;