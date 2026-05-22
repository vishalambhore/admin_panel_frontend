// components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white mt-auto">
      {/* Animated Top Border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-8xl">✨</div>
        <div className="absolute bottom-20 right-10 text-8xl">🎨</div>
        <div className="absolute top-40 right-32 text-6xl">🤖</div>
        <div className="absolute bottom-40 left-32 text-7xl">⚡</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <FaRobot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  AI Project
                </h2>
                <p className="text-xs text-gray-400">Creative AI Studio</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transform your imagination into breathtaking artwork using cutting-edge AI technology. 
              Create stunning images in seconds with our advanced AI models.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="bg-white/10 hover:bg-purple-500 p-2 rounded-lg transition-all duration-300 hover:scale-110">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-purple-500 p-2 rounded-lg transition-all duration-300 hover:scale-110">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-purple-500 p-2 rounded-lg transition-all duration-300 hover:scale-110">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-purple-500 p-2 rounded-lg transition-all duration-300 hover:scale-110">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2">
                  <span className="text-purple-400">→</span> Home
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2">
                  <span className="text-purple-400">→</span> Packages
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2">
                  <span className="text-purple-400">→</span> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2">
                  <span className="text-purple-400">→</span> About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group">
                <FaPhoneAlt className="w-4 h-4 text-purple-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group">
                <FaEnvelope className="w-4 h-4 text-purple-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">support@aiproject.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group">
                <FaMapMarkerAlt className="w-4 h-4 text-purple-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Newsletter
            </h3>
            <p className="text-gray-300 text-sm">
              Subscribe to get updates about new features and special offers.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; 2026 AI Project. All rights reserved. | Powered by Artificial Intelligence
            </p>
            <div className="flex gap-4">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <button
                onClick={scrollToTop}
                className="bg-white/10 hover:bg-purple-500 p-2 rounded-lg transition-all duration-300 group"
              >
                <FaArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500 rounded-full filter blur-3xl opacity-10"></div>
    </footer>
  );
};

export default Footer;