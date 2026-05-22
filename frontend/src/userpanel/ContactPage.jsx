// components/user/ContactPage.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    imageType: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('🎨 Query sent! Our AI team will respond within 2 hours.');
    setFormData({ name: '', email: '', imageType: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact AI Image Studio</h1>
          <p className="text-xl">Get support for your AI image generation needs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🎨</span>
                <h2 className="text-2xl font-bold text-gray-800">AI Image Support</h2>
              </div>
              <p className="text-gray-600">Our AI experts are ready to help you with image generation, custom models, and bulk orders.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Generation Support</h3>
                  <p className="text-gray-600">24/7 assistance for prompt engineering & image optimization</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Custom AI Models</h3>
                  <p className="text-gray-600">Fine-tuned models for your specific needs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Bulk Generation</h3>
                  <p className="text-gray-600">1000+ images with special pricing</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Request AI Image Generation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Image Type / Style</label>
                <select
                  name="imageType"
                  value={formData.imageType}
                  onChange={handleChange}
                  className="w-full cursor-pointer px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select style</option>
                  <option>Realistic Photography</option>
                  <option>Anime/Manga</option>
                  <option>Digital Art</option>
                  <option>3D Render</option>
                  <option>Oil Painting</option>
                  <option>Cyberpunk</option>
                  <option>Fantasy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Your Requirements</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe the images you want to generate..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                🎨 Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;