import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdPhone, MdPerson } from 'react-icons/md';


const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  const isAuthenticated = Boolean(localStorage.getItem("token")); // Check if token exists
  const username = localStorage.getItem("username"); // Retrieve username from localStorage

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("username"); // Remove username
    navigate("/login"); // Redirect to login page
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  return (
    <nav className="pt-5 font-plus-jakarta">
      <div className="container text-black mx-auto flex justify-around gap-[34rem]">
        <Link to="/" className="text-black text-3xl font-bold ">
          Lost & Found
        </Link>

        <div className="flex items-center space-x-4 ">
          <div className="flex gap-8">
            <Link to="/" className="ml-5">
              Home
            </Link>
            <Link to="/about-us" className="">
              About us
            </Link>
          </div>

          {isAuthenticated && (
            <div className="relative flex items-center gap-8 px-5">
              <Link to="/items" className="">
                Items
              </Link>
              <Link to="/post-item" className="">
                Post Item
              </Link>

              {/* Username and Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600"
                >
                  <MdPerson className="text-white text-2xl" />
                 
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg ">
                 
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-black bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="border-2 py-3 px-6 rounded-full text-white font-bold bg-indigo-500"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
