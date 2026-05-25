import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaRobot, 
  FaBolt, 
  FaPalette, 
  FaChartLine, 
  FaUsers, 
  FaShieldAlt,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaCloudUploadAlt,
  FaDownload,
  FaMagic
} from 'react-icons/fa';
import { GiArtificialIntelligence } from 'react-icons/gi';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <GiArtificialIntelligence className="w-8 h-8" />,
      title: "Advanced AI Models",
      description: "Powered by state-of-the-art AI including Stable Diffusion, DALL-E, and Midjourney",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaBolt className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Generate stunning images in seconds with our optimized infrastructure",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <FaPalette className="w-8 h-8" />,
      title: "50+ Art Styles",
      description: "From realistic to anime, cyberpunk to oil painting - endless possibilities",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <FaCloudUploadAlt className="w-8 h-8" />,
      title: "Cloud Storage",
      description: "All your creations saved securely in the cloud, access anywhere",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Digital Artist",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      comment: "This AI tool has revolutionized my creative process. The quality is mind-blowing!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Marketing Director",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      comment: "Generated over 1000+ images for our campaigns. Incredible value for money!",
      rating: 5
    },
    {
      name: "Anjali Desai",
      role: "Content Creator",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      comment: "Best AI image generator I've used. Simple, fast, and amazing results!",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Images Generated", icon: <FaChartLine className="w-6 h-6" /> },
    { number: "10K+", label: "Happy Users", icon: <FaUsers className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <FaShieldAlt className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <FaRobot className="w-6 h-6" /> }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - Modern Gradient with Floating Elements */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">AI-Powered Creativity Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Create Stunning
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> AI Images</span>
              <br />
              in Seconds
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Transform your imagination into breathtaking artwork using cutting-edge AI technology. 
              No design skills needed - just type and create!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => navigate('/admin/packages')}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative cursor-pointer z-10">Start Creating Free</span>
                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="inline-flex cursor-pointer items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all hover:scale-105">
                <FaPlay className="w-4 h-4" />
                Watch Demo
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-purple-400 mb-2 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create amazing AI artwork in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to create amazing artwork
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Write Your Prompt",
                description: "Describe what you want to create in words",
                icon: <FaMagic className="w-8 h-8" />,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "02",
                title: "Choose Style",
                description: "Pick from 50+ art styles and AI models",
                icon: <FaPalette className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "03",
                title: "Generate & Download",
                description: "Get your high-quality image in seconds",
                icon: <FaDownload className="w-8 h-8" />,
                color: "from-green-500 to-teal-500"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {item.step}
                    </div>
                  </div>
                  <div className="mt-6 mb-4 text-gray-400 group-hover:scale-110 transition-transform inline-block">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <FaArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of happy creators using our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-200">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Create Amazing Art?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators and start generating stunning AI images today
          </p>
          <button
            onClick={() => navigate('/user-panel/packages')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            Start Your Creative Journey
            <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;