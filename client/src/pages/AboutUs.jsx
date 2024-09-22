import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
    });
  }, []);

  return (
    <div id="about-us" className="h-[80vh] bg-gray-200 flex items-center justify-center text-center px-10 mb-10">
      <div className="max-w-4xl" data-aos="fade-up"> {/* AOS effect */}
        <h2 className="text-5xl font-bold text-indigo-600 mb-6">About Us</h2>
        <p className="text-xl text-gray-700 leading-relaxed mb-4">
          Welcome to our Lost and Found platform, where we aim to bridge the gap between lost items and their rightful owners. 
          Our mission is to foster a sense of community and trust by providing a safe and efficient way to connect lost and found items.
        </p>
        <p className="text-xl text-gray-700 leading-relaxed mb-4">
          With easy reporting and a dedicated team behind the scenes, we strive to ensure that every item finds its way back to its owner.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
