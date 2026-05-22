// components/UserPanel.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Sample package data
  const packages = [
    { id: 1, name: "Basic Plan", price: "₹999", duration: "1 Month", features: ["5 Users", "10GB Storage", "Basic Support"] },
    { id: 2, name: "Standard Plan", price: "₹1999", duration: "3 Months", features: ["15 Users", "50GB Storage", "Priority Support"] },
    { id: 3, name: "Premium Plan", price: "₹3999", duration: "6 Months", features: ["Unlimited Users", "200GB Storage", "24/7 Support"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Import Kel */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'home' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Travel Agency</h2>
            <p className="text-xl text-gray-600 mb-8">Discover amazing travel packages at best prices!</p>
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Why Choose Us?</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-3">✈️</div>
                  <h4 className="font-bold text-lg">Best Prices</h4>
                  <p className="text-gray-600">Get competitive rates on all packages</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-3">🏨</div>
                  <h4 className="font-bold text-lg">Premium Hotels</h4>
                  <p className="text-gray-600">Luxury stays with best amenities</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-3">🎉</div>
                  <h4 className="font-bold text-lg">24/7 Support</h4>
                  <p className="text-gray-600">We're here to help anytime</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Travel Packages</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-blue-600 p-4">
                    <h3 className="text-xl font-bold text-white text-center">{pkg.name}</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-gray-800">{pkg.price}</span>
                      <span className="text-gray-500">/{pkg.duration}</span>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Contact Us</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">✉️</span>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-600">info@travelagency.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-gray-600">123, Travel Street, Mumbai, India - 400001</p>
                  </div>
                </div>
              </div>
              <form className="mt-8 space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;