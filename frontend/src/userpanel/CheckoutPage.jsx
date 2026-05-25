import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import { FaArrowLeft, FaShieldAlt, FaCheckCircle, FaSpinner, FaCreditCard, FaLock, FaCalendarAlt, FaUser, FaEnvelope, FaGem, FaInfinity, FaBolt, FaHeadset, FaRegClock } from 'react-icons/fa';
import { IndianRupee, Clock, Zap, Award, CheckCircle2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const CheckoutPage = () => {
    const { selectedPackage } = useLocation().state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (!selectedPackage) {
            toast.error('No package selected');
            navigate('/packages');
        }
    }, [selectedPackage, navigate]);

    const loadRazorpayScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const handlePayment = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/payments/create-subscription', {
                package_id: selectedPackage.id
            });
            if (!data.success) throw new Error(data.message);

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) throw new Error('Payment gateway failed to load');

            const options = {
                key: data.key_id,
                subscription_id: data.subscription_id,
                name: 'AI Imagify',
                description: selectedPackage.title,
                prefill: {
                    name: user?.name || '',
                    email: user?.email || ''
                },
                theme: { color: '#6366f1' },
                modal: { ondismiss: () => setLoading(false) },
                handler: async (response) => {
                    try {
                        axiosInstance.post('/payments/verify-subscription', {
    razorpay_subscription_id: response.razorpay_subscription_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature
});
                        toast.success('Subscription activated!');
                        navigate('/user-dashboard', { state: { refresh: true } });
                    } catch (err) {
                        toast.error('Verification failed. Contact support.');
                    }
                }
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedPackage) return null;

    const totalPrice = parseFloat(selectedPackage.price);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + selectedPackage.duration_days);
    const formatDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const getFeatureIcon = (text) => {
        const t = text.toLowerCase();
        if (t.includes('unlimited')) return <FaInfinity size={12} className="text-indigo-400" />;
        if (t.includes('4k') || t.includes('resolution')) return <FaBolt size={12} className="text-emerald-400" />;
        if (t.includes('priority')) return <Zap size={12} className="text-amber-400" />;
        if (t.includes('support')) return <FaHeadset size={12} className="text-blue-400" />;
        return <CheckCircle2 size={12} className="text-emerald-400" />;
    };

    const planGradient = selectedPackage.title.toLowerCase().includes('ultimate') ? 'from-purple-600 to-indigo-700' :
                        selectedPackage.title.toLowerCase().includes('pro') ? 'from-blue-600 to-cyan-600' :
                        selectedPackage.title.toLowerCase().includes('unlimited') ? 'from-rose-600 to-orange-600' :
                        'from-emerald-600 to-teal-600';

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="h-full flex flex-col p-4">
                <button onClick={() => navigate('/packages')} className="self-start mb-3 flex items-center gap-2 text-slate-600 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full text-sm shadow-sm">
                    <FaArrowLeft size={12} /> Back
                </button>

                <div className="flex-1 grid lg:grid-cols-3 gap-5 min-h-0">
                    <div className="lg:col-span-2 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1 custom-scroll">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
                            <div className={`bg-gradient-to-r ${planGradient} p-4 text-white`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {selectedPackage.title.includes('Pro') && <Zap size={14} className="text-yellow-300" />}
                                            {selectedPackage.title.includes('Ultimate') && <Award size={14} className="text-amber-300" />}
                                            {selectedPackage.title.includes('Unlimited') && <FaInfinity size={14} className="text-pink-200" />}
                                            <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">{selectedPackage.duration_days} Days</span>
                                        </div>
                                        <h1 className="text-xl font-bold">{selectedPackage.title}</h1>
                                        <p className="text-white/80 text-xs mt-0.5">{selectedPackage.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black">₹{totalPrice}</div>
                                        <div className="text-[10px] text-white/70">recurring</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2 mb-4 text-xs">
                                    <div className="flex items-center gap-2"><FaCalendarAlt className="text-indigo-500" size={12} /> {formatDate(startDate)} - {formatDate(endDate)}</div>
                                    <div className="flex items-center gap-2"><Clock size={12} className="text-indigo-500" /> {selectedPackage.duration_days} days validity</div>
                                </div>
                                <h3 className="text-sm font-bold flex items-center gap-2 mb-2"><FaGem size={12} /> What's included</h3>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 max-h-[160px] overflow-y-auto">
                                    {selectedPackage.features?.map((f, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs py-1">
                                            {getFeatureIcon(f)} <span className="text-slate-600">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/80 rounded-xl p-3 shadow-sm flex-shrink-0">
                            <h3 className="text-xs font-bold flex items-center gap-2"><FaCreditCard size={12} /> Secure payment methods</h3>
                            <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                {['Visa', 'Mastercard', 'Rupay', 'UPI', 'NetBanking'].map(m => <span key={m} className="bg-slate-50 px-3 py-1 rounded-lg">{m}</span>)}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-800 px-4 py-3"><h3 className="text-white font-bold text-sm flex items-center gap-2"><IndianRupee size={14} /> Pay now</h3></div>
                            <div className="p-4">
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <span className="text-slate-600 text-sm">Package price</span>
                                    <span className="text-xl font-bold">₹{totalPrice}</span>
                                </div>
                                <div className="text-right text-[10px] text-slate-400 mt-0.5">Auto-renews every {selectedPackage.duration_days} days</div>
                                {user && (
                                    <div className="mt-3 pt-2 border-t">
                                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg text-xs">
                                            <FaUser size={10} className="text-indigo-500" /> {user.name || 'Guest'}
                                            <FaEnvelope size={10} className="text-indigo-500 ml-1" /> {user.email || '—'}
                                        </div>
                                    </div>
                                )}
                                <button onClick={handlePayment} disabled={loading} className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                                    {loading ? <FaSpinner className="animate-spin" size={14} /> : <FaLock size={12} />}
                                    {loading ? 'Processing...' : `Pay ₹${totalPrice} securely`}
                                </button>
                                <div className="flex justify-center gap-3 text-[10px] text-slate-400 mt-3">
                                    <span className="flex items-center gap-1"><FaShieldAlt size={10} /> 100% secure</span>
                                    <span className="flex items-center gap-1"><FaLock size={8} /> encrypted</span>
                                    <span className="flex items-center gap-1"><FaRegClock size={10} /> instant access</span>
                                </div>
                                <div className="flex justify-center mt-2"><img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4 opacity-50" /></div>
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-center gap-2">
                            <FaCheckCircle className="text-emerald-600" size={14} />
                            <span className="text-xs font-medium text-emerald-800">Unlocks immediately after payment</span>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.custom-scroll::-webkit-scrollbar { width: 3px; } .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
        </div>
    );
};

export default CheckoutPage;