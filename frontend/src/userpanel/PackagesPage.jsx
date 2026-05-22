import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import { FaBox, FaGem, FaRocket, FaCloud, FaStar, FaClock, FaArrowRight, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IndianRupee } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const PackagesPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');          // ✅ added missing state
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPackage, setPendingPackage] = useState(null);

  // ✅ Use the correct localStorage key (same as in UserContext)
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('userToken');
    return !!token;
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/packages/all');
      if (response.data.success && response.data.packages) {
        setPackages(response.data.packages);
      } else {
        setPackages([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err.response?.data?.message || 'Failed to load packages');
      toast.error('Could not load packages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoosePlan = (pkg) => {
    if (isUserLoggedIn()) {
      navigate('/checkout', { state: { selectedPackage: pkg } });
    } else {
      setPendingPackage(pkg);
      setShowAuthModal(true);
    }
  };

  const toggleFeatureExpand = (packageId) => {
    setExpandedFeatures(prev => ({ ...prev, [packageId]: !prev[packageId] }));
  };

  const getPackageIcon = (title) => {
    const name = title?.toLowerCase() || '';
    if (name.includes('premium')) return <FaGem className="w-5 h-5" />;
    if (name.includes('max')) return <FaRocket className="w-5 h-5" />;
    if (name.includes('cloud')) return <FaCloud className="w-5 h-5" />;
    if (name.includes('starter')) return <FaBox className="w-5 h-5" />;
    return <FaStar className="w-5 h-5" />;
  };

  const formatPrice = (price) => parseFloat(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features.filter(f => f && f.trim().length > 0);
    if (typeof features === 'string') {
      const lines = features.split('\n');
      const result = [];
      lines.forEach(line => {
        let cleanedLine = line.replace(/^\d+\.\s*/, '').trim();
        if (cleanedLine) result.push(cleanedLine);
      });
      return result;
    }
    return [];
  };

  const getDisplayDuration = (pkg) => {
    if (pkg.duration) return pkg.duration;
    if (pkg.duration_days) return `${pkg.duration_days} days`;
    return 'Flexible';
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Packages</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchPackages}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Optional search bar – uncomment if needed */}
        {/* <div className="mb-6">
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        {filteredPackages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">No packages found</p>
            <p className="text-gray-400">Try adjusting your search</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => {
            const featuresList = parseFeatures(pkg.features);
            const isExpanded = expandedFeatures[pkg.id] || false;
            const visibleFeatures = isExpanded ? featuresList : featuresList.slice(0, 3);
            const hasMoreFeatures = featuresList.length > 3;

            return (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 flex flex-col h-full">
                <div className="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      {getPackageIcon(pkg.title)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{pkg.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <FaClock className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500 text-xs">{getDisplayDuration(pkg)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg"><IndianRupee className="w-4 h-4 text-blue-600" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-2xl font-bold text-gray-800">₹{formatPrice(pkg.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-50 rounded-lg"><FaClock className="w-4 h-4 text-orange-600" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="font-semibold text-gray-700">{getDisplayDuration(pkg)}</p>
                      </div>
                    </div>
                  </div>

                  {pkg.description && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 flex-shrink-0">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{pkg.description}</p>
                    </div>
                  )}

                  {featuresList.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-6 flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <FaStar className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-semibold text-gray-600 uppercase">Features</span>
                      </div>
                      <div className="space-y-1.5">
                        {visibleFeatures.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-sm text-gray-600">
                            <FaCheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{feature}</span>
                          </div>
                        ))}
                      </div>
                      {hasMoreFeatures && (
                        <button onClick={() => toggleFeatureExpand(pkg.id)} className="mt-3 text-blue-600 cursor-pointer hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          {isExpanded ? <><FaChevronUp className="w-3 h-3" /> Show less</> : <><FaChevronDown className="w-3 h-3" /> Show more ({featuresList.length - 3} more)</>}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex-grow"></div>

                  <button onClick={() => handleChoosePlan(pkg)} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 mt-4 flex-shrink-0">
                    <FaStar className="w-4 h-4 text-yellow-300" />
                    <span>Choose Plan</span>
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingPackage(null);
        }}
        onLoginSuccess={() => {
          if (pendingPackage) {
            const packageToBuy = pendingPackage;
            setPendingPackage(null);
            setShowAuthModal(false);
            navigate('/checkout', { state: { selectedPackage: packageToBuy } });
          } else {
            navigate('/packages');
          }
        }}
      />
    </div>
  );
};

export default PackagesPage;