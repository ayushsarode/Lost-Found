import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  MdEmail,
  MdPhone,
  MdPerson,
  MdArrowBack,
  MdLocationOn,
  MdNotifications,
  MdSchedule,
} from "react-icons/md";
import * as timeago from "timeago.js";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Use Vite's environment variables
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const userId = import.meta.env.VITE_EMAILJS_USER_ID;

// Get base URL from API
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Failed to fetch item details:", error);
        toast.error("Failed to load item details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleNotify = () => {
    if (!item || !item.user) {
      toast.error("User or item details not available.");
      return;
    }

    const templateParams = {
      to_name: item.user.name,
      to_email: item.user.email,
      message: `There is an update regarding your item listing: ${item.title}`,
    };

    toast.info("Sending notification...", { autoClose: 1000 });

    emailjs.send(serviceId, templateId, templateParams, userId).then(
      (response) => {
        toast.success("Notification sent successfully!");
      },
      (error) => {
        console.error("FAILED...", error);
        toast.error("Failed to send notification.");
      }
    );
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Check if it's already a full URL (Cloudinary)
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // If it's a local path, prepend the base URL
    return `${baseURL}/${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] bg-indigo-600 flex justify-center items-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">
            Loading item details...
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="h-[80vh] bg-indigo-600 flex justify-center items-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-4">Item not found</p>
          <Link
            to="/items"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            <MdArrowBack />
            Back to items
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(item.image);

  return (
    <div className="h-[80vh] bg-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Back Button */}
          <div className="p-4 bg-indigo-50 border-b border-indigo-100">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              <MdArrowBack />
              Back to items
            </Link>
          </div>

          {/* Image Section */}
          <div className="relative">
            {imageUrl && !imageError ? (
              <div
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => setShowFullImage(true)}
              >
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full p-0 group-hover:p-3 transition-all duration-300">
                    <svg
                      className="w-0 h-0 group-hover:w-6 group-hover:h-6 text-gray-800 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ) : item.image && imageError ? (
              <div className="w-full h-48 bg-indigo-100 flex items-center justify-center">
                <div className="text-center text-indigo-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-medium text-sm">Image failed to load</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-indigo-100 flex items-center justify-center">
                <div className="text-center text-indigo-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-medium text-sm">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status?.toLowerCase() === "lost"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      item.status?.toLowerCase() === "lost"
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                  ></div>
                  {item.status}
                </span>
              </div>

              {/* Time Posted */}
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <MdSchedule className="text-indigo-500" />
                <span>{timeago.format(item.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                {item.description}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              {/* Posted By */}
              {item.user && (
                <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <MdPerson className="text-white text-sm" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">
                      Posted By
                    </p>
                    <p className="text-sm font-semibold text-indigo-700">
                      {item.user.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              {item.user && (
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <MdEmail className="text-white text-sm" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-xs font-medium text-gray-600">Email</p>
                    <a
                      href={`mailto:${item.user.email}`}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200"
                    >
                      {item.user.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {item.phone && (
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <MdPhone className="text-white text-sm" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-xs font-medium text-gray-600">Phone</p>
                    <a
                      href={`tel:${item.phone}`}
                      className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors duration-200"
                    >
                      {item.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={handleNotify}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <MdNotifications className="text-sm" />
                <span>Notify Owner</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && imageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200 z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={imageUrl}
              alt={item.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm opacity-90">Click outside to close</p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default ItemDetail;
