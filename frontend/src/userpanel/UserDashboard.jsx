import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axiosInstance, { pythonApi, pythonGet, pythonPost, pythonPut, pythonDelete } from '../api/axiosInstance';
import toast from 'react-hot-toast';
import {
  FaUser, FaCheckCircle, FaSpinner, FaCreditCard, FaArrowRight,
  FaGoogle, FaInstagram, FaLink, FaUnlink, FaSync, FaPlus,
  FaCrown, FaRegCalendarCheck, FaCircle, FaFacebook, FaTimes
} from 'react-icons/fa';
import {
  IndianRupee, Layers, Sparkles
} from 'lucide-react';
import CalendarComponent from './user/CalendarComponent';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  const [connectedAccounts, setConnectedAccounts] = useState({
    googleBusiness: { connected: false, name: '', profiles: [] },
    instagram: { connected: false, name: '' },
    facebook: { connected: false, name: '', pages: [] }
  });
  const [isFetching, setIsFetching] = useState(false);
  const facebookFetchCalled = useRef(false);
  const googleFetchCalled = useRef(false);

  const getToken = () => localStorage.getItem('userToken') || localStorage.getItem('token');

  // Offers state
  const [offers, setOffers] = useState([]);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [offerForm, setOfferForm] = useState({ title: '', description: '' });

  // Axios interceptor for Node (already in axiosInstance, but we keep for safety)
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, []);

  const loadRazorpayScript = () => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    let userId = user?.id;
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) userId = JSON.parse(storedUser).id;
    }
    if (!userId) { setLoading(false); return; }
    try {
      const { data } = await axiosInstance.get(`/payments/my-subscriptions?user_id=${userId}`);
      if (data.success) setSubscriptions(data.subscriptions || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subscriptions');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  // Google Business functions
  const fetchGoogleBusinessProfiles = async (showToast = true) => {
    setIsFetching(true);
    try {
      const { data } = await axiosInstance.get('/google/business-profiles');
      if (data.success && data.locations && data.locations.length > 0) {
        setConnectedAccounts(prev => ({
          ...prev,
          googleBusiness: {
            connected: true,
            name: data.locations[0].title || 'My Business',
            profiles: data.locations
          }
        }));
        if (showToast) toast.success(`Connected to ${data.locations[0].title}`);
      } else if (data.success) {
        setConnectedAccounts(prev => ({
          ...prev,
          googleBusiness: { connected: false, name: '', profiles: [] }
        }));
        if (showToast) toast('No business locations found.');
      }
    } catch (err) {
      setConnectedAccounts(prev => ({
        ...prev,
        googleBusiness: { connected: false, name: '', profiles: [] }
      }));
      if (showToast) toast.error('Could not load business profiles');
    } finally {
      setIsFetching(false);
    }
  };

  const handleConnectGoogleBusiness = () => {
    const token = getToken();
    if (!token) { toast.error('Please log in again'); return; }
    window.location.href = `http://localhost:5000/api/auth/google?token=${token}`;
  };

  const handleDisconnectGoogleBusiness = async () => {
    try {
      await axiosInstance.delete('/google/disconnect');
      setConnectedAccounts(prev => ({ ...prev, googleBusiness: { connected: false, name: '', profiles: [] } }));
      toast.success('Google Business disconnected');
    } catch { toast.error('Failed to disconnect'); }
  };

  const handleConnectInstagram = () => toast.success('Instagram integration coming soon!');
  const handleDisconnectInstagram = () => {
    setConnectedAccounts(prev => ({ ...prev, instagram: { connected: false, name: '' } }));
    toast.success('Instagram disconnected');
  };

  // ========== FACEBOOK INTEGRATION using shared pythonApi ==========
  const fetchFacebookPages = async (showToast = true) => {
    setIsFetching(true);
    try {
      const { data } = await pythonApi.get('/social/facebook/pages');
      if (data.success && data.pages && data.pages.length > 0) {
        setConnectedAccounts(prev => ({
          ...prev,
          facebook: {
            connected: true,
            name: data.pages[0].name || 'Facebook Page',
            pages: data.pages
          }
        }));
        if (showToast) toast.success(`Connected to ${data.pages[0].name}`);
      } else if (data.success) {
        setConnectedAccounts(prev => ({
          ...prev,
          facebook: { connected: false, name: '', pages: [] }
        }));
        if (showToast) toast('No Facebook pages found.');
      }
    } catch (err) {
      setConnectedAccounts(prev => ({
        ...prev,
        facebook: { connected: false, name: '', pages: [] }
      }));
      if (showToast) toast.error('Could not fetch Facebook pages');
    } finally {
      setIsFetching(false);
    }
  };

  const handleConnectFacebook = async () => {
  const token = getToken();
  if (!token) {
    toast.error('Please log in again');
    return;
  }
  try {
    // Step 1: Get redirect URL from Python (token in header)
    const response = await pythonApi.get('/social/facebook/auth-url', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { redirect_url } = response.data;
    window.location.href = redirect_url;
  } catch (error) {
    toast.error('Failed to initiate Facebook login');
  }
};

  const handleDisconnectFacebook = async () => {
    try {
      await pythonApi.delete('/social/facebook/disconnect');
      setConnectedAccounts(prev => ({
        ...prev,
        facebook: { connected: false, name: '', pages: [] }
      }));
      toast.success('Facebook disconnected');
    } catch (err) {
      toast.error('Failed to disconnect Facebook');
    }
  };

  // Handle Facebook OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('facebook_connected') === 'true' && !facebookFetchCalled.current) {
      facebookFetchCalled.current = true;
      fetchFacebookPages(true);
      window.history.replaceState({}, document.title, '/user-dashboard');
    } else if (params.get('facebook_error') === 'true') {
      toast.error('Facebook connection failed');
      window.history.replaceState({}, document.title, '/user-dashboard');
    }
  }, []);

  // Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('google_connected') === 'true' && !googleFetchCalled.current) {
      googleFetchCalled.current = true;
      fetchGoogleBusinessProfiles(true);
      window.history.replaceState({}, document.title, '/user-dashboard');
    } else if (params.get('google_error') === 'true') {
      toast.error('Google connection failed');
      window.history.replaceState({}, document.title, '/user-dashboard');
    }
  }, []);

  const handlePendingClick = async (sub) => {
    try {
      const { data } = await axiosInstance.get(`/payments/get-pending-order/${sub.id}`);
      if (!data.success) { toast.error('Could not resume payment'); return; }
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { toast.error('Failed to load payment gateway'); return; }
      const options = {
        key: data.key_id,
        subscription_id: data.subscription_id,
        order_id: data.order_id,
        name: 'AI Imagify',
        description: sub.package_title,
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#3b82f6' },
        handler: async (response) => {
          try {
            await axiosInstance.post('/payments/verify-subscription', {
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            toast.success('Payment successful!');
            fetchSubscriptions();
          } catch { toast.error('Verification failed'); }
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) { toast.error('Failed to resume payment'); }
  };

  const handleCancelSubscription = async (subId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to cancel this subscription? Future payments will stop.')) return;
    setCancelLoading(subId);
    try {
      await axiosInstance.post(`/payments/cancel-subscription/${subId}`);
      toast.success('Subscription cancelled');
      fetchSubscriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelLoading(null);
    }
  };

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-6 mb-8 overflow-hidden border border-slate-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Welcome, {user?.name || 'Creator'}!
              </h1>
              <p className="text-slate-500 mt-0.5 flex items-center gap-2 text-sm">
                <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-slate-200/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-indigo-100 rounded-xl"><FaLink size={20} className="text-indigo-600" /></div>
            <h2 className="text-xl font-bold text-slate-800">Connected Accounts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Google Business Card */}
            <div className={`rounded-xl border p-4 transition-all ${connectedAccounts.googleBusiness.connected ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${connectedAccounts.googleBusiness.connected ? 'bg-white shadow-sm' : 'bg-slate-200'}`}>
                    <FaGoogle className={`text-xl ${connectedAccounts.googleBusiness.connected ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Google Business</h3>
                    <p className="text-xs text-slate-500">Manage your GMB profile</p>
                  </div>
                </div>
                {connectedAccounts.googleBusiness.connected ? (
                  <button onClick={handleDisconnectGoogleBusiness} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50"><FaUnlink size={12} /> Disconnect</button>
                ) : (
                  <button onClick={handleConnectGoogleBusiness} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 shadow-sm"><FaLink size={12} /> Connect</button>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                <button onClick={() => fetchGoogleBusinessProfiles(true)} disabled={isFetching} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                  {isFetching ? <FaSpinner className="animate-spin" size={10} /> : <FaSync size={10} />}
                  {isFetching ? ' Fetching...' : ' Refresh Profiles'}
                </button>
              </div>
              {connectedAccounts.googleBusiness.connected && (
                <div className="mt-2 text-sm font-medium text-emerald-800 flex items-center gap-2"><FaCheckCircle size={12} /> <span>Account: <strong>{connectedAccounts.googleBusiness.name}</strong></span></div>
              )}
            </div>

            {/* Instagram Card */}
            <div className={`rounded-xl border p-4 transition-all ${connectedAccounts.instagram.connected ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${connectedAccounts.instagram.connected ? 'bg-white shadow-sm' : 'bg-slate-200'}`}>
                    <FaInstagram className={`text-xl ${connectedAccounts.instagram.connected ? 'text-pink-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Instagram</h3>
                    <p className="text-xs text-slate-500">Connect your business account</p>
                  </div>
                </div>
                {connectedAccounts.instagram.connected ? (
                  <button onClick={handleDisconnectInstagram} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-50"><FaUnlink size={12} /> Disconnect</button>
                ) : (
                  <button onClick={handleConnectInstagram} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 shadow-sm"><FaLink size={12} /> Connect</button>
                )}
              </div>
              {connectedAccounts.instagram.connected && (
                <div className="mt-3 text-sm font-medium text-rose-800 flex items-center gap-2 border-t border-rose-200 pt-2"><FaCheckCircle size={12} /> <span>Username: <strong>{connectedAccounts.instagram.name}</strong></span></div>
              )}
            </div>

            {/* Facebook Card using shared pythonApi */}
            <div className={`rounded-xl border p-4 transition-all ${connectedAccounts.facebook.connected ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${connectedAccounts.facebook.connected ? 'bg-white shadow-sm' : 'bg-slate-200'}`}>
                    <FaFacebook className={`text-xl ${connectedAccounts.facebook.connected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Facebook</h3>
                    <p className="text-xs text-slate-500">Connect your Facebook page</p>
                  </div>
                </div>
                {connectedAccounts.facebook.connected ? (
                  <button onClick={handleDisconnectFacebook} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50"><FaUnlink size={12} /> Disconnect</button>
                ) : (
                  <button onClick={handleConnectFacebook} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 shadow-sm"><FaLink size={12} /> Connect</button>
                )}
              </div>
              {connectedAccounts.facebook.connected && (
                <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                  <button onClick={() => fetchFacebookPages(true)} disabled={isFetching} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                    {isFetching ? <FaSpinner className="animate-spin" size={10} /> : <FaSync size={10} />}
                    {isFetching ? ' Fetching...' : ' Refresh Pages'}
                  </button>
                </div>
              )}
              {connectedAccounts.facebook.connected && (
                <div className="mt-2 text-sm font-medium text-blue-800 flex items-center gap-2">
                  <FaCheckCircle size={12} /> 
                  <span>Page: <strong>{connectedAccounts.facebook.name}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subscriptions Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-slate-200/50 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl"><Layers size={22} className="text-indigo-600" /></div>
              <h2 className="text-xl font-bold text-slate-800">Your Subscriptions</h2>
            </div>
            {subscriptions.length > 0 && (
              <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-100">
                {subscriptions.length} {subscriptions.length === 1 ? 'plan' : 'plans'}
              </span>
            )}
          </div>

          {loading && (
            <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-indigo-500 text-3xl" /></div>
          )}

          {!loading && subscriptions.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><FaCreditCard className="text-slate-400 text-3xl" /></div>
              <p className="text-slate-500 mb-2">No active subscriptions yet</p>
              <button onClick={() => navigate('/packages')} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-all text-sm font-medium mt-2">
                Browse Packages <FaArrowRight size={12} />
              </button>
            </div>
          )}

          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map((sub) => {
              const isActive = sub.status === 'success';
              const isPending = sub.status === 'pending';
              const isRecurring = sub.is_recurring === 1;
              const nextBillingDate = isRecurring && isActive ? formatDate(sub.next_billing_date) : null;
              const startDate = new Date(sub.start_date);
              const endDate = new Date(sub.end_date);
              const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
              const daysElapsed = Math.min(totalDays, Math.max(0, Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24))));
              const progressPercent = totalDays > 0 ? Math.min(100, Math.round((daysElapsed / totalDays) * 100)) : 0;
              const remainingDays = isActive ? Math.max(0, Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))) : 0;

              const features = sub.features
                ? (Array.isArray(sub.features) ? sub.features : sub.features.split('\n').filter(f => f.trim()))
                : [];

              return (
                <div
                  key={sub.id}
                  onClick={() => isPending ? handlePendingClick(sub) : null}
                  className={`relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
                    isPending ? 'cursor-pointer hover:-translate-y-1' : ''
                  } ${
                    isActive ? 'ring-2 ring-emerald-200' : isPending ? 'ring-2 ring-amber-200' : ''
                  }`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
                    sub.package_title?.toLowerCase().includes('pro') ? 'from-blue-500 to-cyan-500' :
                    sub.package_title?.toLowerCase().includes('ultimate') ? 'from-purple-500 to-pink-500' :
                    sub.package_title?.toLowerCase().includes('unlimited') ? 'from-orange-500 to-rose-500' :
                    'from-emerald-500 to-teal-500'
                  }`}></div>

                  <div className="p-5 pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <FaCrown className="text-white text-sm" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-800">{sub.package_title}</h3>
                          <p className="text-xs text-slate-500">{sub.description?.substring(0, 60) || 'Premium plan'}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                        isActive ? 'bg-emerald-100 text-emerald-700' :
                        isPending ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {isActive ? <FaCheckCircle size={10} /> : isPending ? <FaSpinner className="animate-spin" size={10} /> : null}
                        {isActive ? 'Active' : isPending ? 'Pending' : 'Inactive'}
                      </span>
                    </div>

                    {isActive && totalDays > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Plan used</span>
                          <span>{remainingDays} days left</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              progressPercent > 80 ? 'from-amber-400 to-red-400' : 'from-emerald-400 to-cyan-400'
                            } transition-all duration-1000`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-slate-400">Price</p>
                        <p className="text-sm font-bold text-slate-700 flex items-center justify-center gap-0.5">
                          <IndianRupee size={12} />{sub.amount}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-slate-400">Started</p>
                        <p className="text-xs font-medium text-slate-600">{formatDate(sub.start_date)}</p>
                      </div>
                      {isActive && nextBillingDate && (
                        <div className="bg-indigo-50 p-2 rounded-lg text-center border border-indigo-100 col-span-2">
                          <p className="text-[10px] text-indigo-400 flex items-center justify-center gap-1">
                            <FaRegCalendarCheck size={10} /> Next Auto Payment
                          </p>
                          <p className="text-sm font-bold text-indigo-700 flex items-center justify-center gap-1">
                            <IndianRupee size={12} />{sub.amount} on {nextBillingDate}
                          </p>
                        </div>
                      )}
                    </div>

                    {features.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-medium text-slate-400 mb-1 uppercase tracking-wider">What's included</p>
                        <div className="space-y-1 max-h-28 overflow-y-auto custom-scroll pr-1">
                          {features.slice(0, 5).map((feat, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                              <FaCircle className="text-[6px] text-indigo-400 mt-1.5 flex-shrink-0" />
                              <span className="leading-tight">{feat}</span>
                            </div>
                          ))}
                          {features.length > 5 && (
                            <p className="text-[10px] text-indigo-500 ml-3.5">+{features.length - 5} more</p>
                          )}
                        </div>
                      </div>
                    )}

                    {isRecurring && isActive && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
                          <FaSync size={8} className="animate-spin" />
                          <span>Auto-renews monthly</span>
                        </div>
                        <button
                          onClick={(e) => handleCancelSubscription(sub.id, e)}
                          disabled={cancelLoading === sub.id}
                          className="w-full text-[10px] cursor-pointer bg-white border border-red-200 text-red-600 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors font-medium"
                        >
                          {cancelLoading === sub.id ? 'Cancelling...' : 'Cancel Subscription'}
                        </button>
                      </div>
                    )}

                    {isPending && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePendingClick(sub); }}
                        className="mt-3 w-full py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors"
                      >
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Offers Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-slate-200/50 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl"><Sparkles size={22} className="text-amber-600" /></div>
              <h2 className="text-xl font-bold text-slate-800">Your Offers</h2>
            </div>
            <button onClick={() => { setOfferForm({ title: '', description: '' }); setShowOfferPopup(true); }} className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-all text-sm font-medium shadow-md">
              <FaPlus size={12} /> Add Offer
            </button>
          </div>

          {offers.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><Sparkles size={32} className="text-slate-400" /></div>
              <p className="text-slate-500 mb-2">No offers created yet</p>
              <p className="text-xs text-slate-400">Click the button above to add a special offer</p>
            </div>
          )}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow border border-amber-100 hover:shadow-md transition-all">
                <h3 className="font-semibold text-slate-800 mb-1">{offer.title}</h3>
                <p className="text-sm text-slate-600">{offer.description || 'No description'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Component */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl"><FaRegCalendarCheck size={22} className="text-indigo-600" /></div>
            <h2 className="text-xl font-bold text-slate-800">Content Calendar</h2>
          </div>
          <CalendarComponent />
        </div>
      </div>

      {/* Offer Popup */}
      {showOfferPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setShowOfferPopup(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Sparkles className="text-amber-500" size={22} /> Add New Offer</h3>
              <button onClick={() => setShowOfferPopup(false)} className="p-2 rounded-full hover:bg-slate-100"><FaTimes className="text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Offer Title <span className="text-red-500">*</span></label>
                <input type="text" value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} placeholder="e.g., 20% Diwali Discount" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={offerForm.description} onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} placeholder="Describe your offer..." rows={3} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowOfferPopup(false)} className="px-5 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
              <button onClick={() => { if (!offerForm.title.trim()) { toast.error('Please enter a title'); return; } setOffers(prev => [...prev, offerForm]); setOfferForm({ title: '', description: '' }); setShowOfferPopup(false); toast.success('Offer added!'); }} className="px-5 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-medium shadow flex items-center gap-2">
                <FaCheckCircle size={14} /> Save Offer
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`.custom-scroll::-webkit-scrollbar { width: 3px; } .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
};

export default UserDashboard;