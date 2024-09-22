import React, { useState, useEffect } from "react";
import img from "../assets/img.png";
import { Link } from "react-router-dom";
import '../App.css'; // Import the CSS file for animations

const Home = () => {
  const items = ["Wallet", "Key", "Chain", "Items"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [item, setItem] = useState(items[currentIndex]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Trigger fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setFade(false); // Trigger fade in
      }, 500); // Match this to the CSS animation duration
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [items.length]);

  useEffect(() => {
    setItem(items[currentIndex]);
  }, [currentIndex]);

  return (
    <div className="bg-white text-black flex justify-around gap-[20rem] h-[80vh] items-center">
      <div className="w-[500px] ">
        <h1 className="text-7xl font-bold leading-tight mb-5">
          Find your lost <br />
          <span className={`text-indigo-500 ${fade ? 'fade-out' : 'fade-in'}`}>
            {item}
          </span>
        </h1>
        <p className="text-xl mb-8">
          Your Trusted Platform to Help You Locate, Reclaim, and Reunite with
          Your Lost Items Effortlessly
        </p>
        <Link
          to="/login"
          className="px-7 py-3 border-2 bg-indigo-500 rounded-full text-white text-lg"
        >
          Get Started
        </Link>
      </div>
      <div>
        <img src={img} style={{ height: "350px" }} alt="img" />
      </div>
    </div>
  );
};

export default Home;
