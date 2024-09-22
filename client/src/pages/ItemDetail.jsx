import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { MdEmail, MdPhone, MdPerson } from "react-icons/md";
import * as timeago from "timeago.js";
import emailjs from "emailjs-com"; // Import EmailJS
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

// Use Vite's environment variables
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const userId = import.meta.env.VITE_EMAILJS_USER_ID;

function ItemDetail() {
  const { id } = useParams(); // Get the item ID from the URL
  const [item, setItem] = useState(null); // Initialize state for item details

  // Log environment variables to verify they are being read correctly
  console.log("Service ID:", serviceId);
  console.log("Template ID:", templateId);
  console.log("User ID:", userId);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        console.log(res.data);
        setItem(res.data);
      } catch (error) {
        console.error("Failed to fetch item details:", error);
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

    emailjs.send(serviceId, templateId, templateParams, userId).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        toast.success("Notification sent successfully!");
      },
      (error) => {
        console.error("FAILED...", error);
        toast.error("Failed to send notification.");
      }
    );
  };

  if (!item) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="container mx-auto p-5 flex justify-center bg-indigo-200 h-[86vh]">
      <div className="max-w-[35rem] w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md relative h-[37rem]">
        
        {/* Display the image if it exists */}
        {item.image && (
          <img
            src={`http://localhost:5000/${item.image}`}
            alt={item.title}
            className="w-[30rem] h-60 object-cover mb-2 rounded mx-auto"

          />
        )}
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2 text-black">{item.title}</h1>
          <p className="text-gray-700 mb-4">{item.description}</p>
          <span className="block bg-blue-100 text-blue-500 py-1 px-3 rounded-full text-sm mb-4">
            {item.status}
          </span>
        </div>

        {/* Display the user's email and phone number */}
        <div className="text-gray-500 mb-4">
          {item.user && (
            <p className="flex items-center mb-2">
              <span className="rounded-full bg-indigo-500 p-2 mr-2">
                <MdPerson className="text-white" />
              </span>
              <span className="font-semibold">Posted By: </span>
              <p className="font-semibold text-blue-500"> {item.user.name}</p>
            </p>
          )}
          {/* Display phone number if it exists */}
          {item.phone && (
            <p className="flex items-center mb-2">
              <span className="rounded-full bg-indigo-500 p-2 mr-2">
                <MdPhone className="text-white" />
              </span>
              <span className="font-semibold">Phone:</span>
              <a
                href={`tel:${item.phone}`}
                className="font-semibold text-blue-500 hover:underline ml-2"
              >
                {item.phone}
              </a>
            </p>
          )}
          {item.user && (
            <p className="flex items-center">
              <span className="rounded-full bg-indigo-500 p-2 mr-2">
                <MdEmail className="text-white" />
              </span>
              <span className="font-semibold">Mail: </span>
              <a
                href={`mailto:${item.user.email}`}
                className="font-semibold text-blue-500 hover:underline ml-2"
              >
                {item.user.email}
              </a>
            </p>
          )}
          {/* Notify Button */}
        <button
          onClick={handleNotify}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-3"
        >
          Notify
        </button>
        </div>

        

        {/* Display the time ago on the bottom right */}
        <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
          Posted {timeago.format(item.createdAt)}
        </div>
      </div>
      <ToastContainer autoClose={2000} /> {/* Add ToastContainer here */}
    </div>
  );
}

export default ItemDetail;
