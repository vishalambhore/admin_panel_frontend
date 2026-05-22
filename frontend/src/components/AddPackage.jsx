import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';
import { 
    FaPlus, FaSearch, FaTimes, FaBox, FaEdit, 
    FaTrash, FaStar, FaClock, FaArrowRight,
    FaGem, FaFire, FaCrown, FaRocket, FaShieldAlt
} from 'react-icons/fa';
import { IndianRupee } from 'lucide-react';

// ✅ API calls (corrected endpoints)
const fetchPackages = async () => {
    const response = await axiosInstance.get('/admin/packages/all');
    return response.data.packages || [];
};

const addPackage = async (data) => {
    const payload = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        duration_days: parseInt(data.duration) || 30,
        features: data.features ? data.features.split(',').map(f => f.trim()) : []
    };
    const response = await axiosInstance.post('/admin/packages/create', payload);
    return response.data;
};

const updatePackage = async ({ id, data }) => {
    const payload = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        duration_days: parseInt(data.duration) || 30,
        features: data.features ? data.features.split(',').map(f => f.trim()) : []
    };
    const response = await axiosInstance.put(`/admin/packages/${id}`, payload);
    return response.data;
};

const deletePackage = async (id) => {
    const response = await axiosInstance.delete(`/admin/packages/${id}?hard_delete=false`);
    return response.data;
};

// Helper functions (unchanged)
const getPackageIcon = (title) => {
    const name = title?.toLowerCase() || '';
    if (name.includes('premium') || name.includes('gold')) return <FaCrown className="w-6 h-6" />;
    if (name.includes('pro') || name.includes('professional')) return <FaRocket className="w-6 h-6" />;
    if (name.includes('enterprise')) return <FaShieldAlt className="w-6 h-6" />;
    if (name.includes('basic') || name.includes('starter')) return <FaBox className="w-6 h-6" />;
    return <FaGem className="w-6 h-6" />;
};

const getCardGradient = (index) => {
    const gradients = [
        'from-indigo-500 to-purple-600',
        'from-pink-500 to-rose-600',
        'from-blue-500 to-cyan-600',
        'from-orange-500 to-red-600',
        'from-emerald-500 to-teal-600',
        'from-violet-500 to-fuchsia-600'
    ];
    return gradients[index % gradients.length];
};

const AddPackage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', description: '', price: '', duration: '', features: '' 
    });
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: packages = [], isLoading, error } = useQuery({ 
        queryKey: ['packages'], 
        queryFn: fetchPackages 
    });

    const addMutation = useMutation({
        mutationFn: addPackage,
        onSuccess: () => {
            toast.success('Package added successfully!');
            queryClient.invalidateQueries(['packages']);
            closeModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.detail?.error || 'Failed to add package');
        }
    });

    const updateMutation = useMutation({
        mutationFn: updatePackage,
        onSuccess: () => {
            toast.success('Package updated successfully!');
            queryClient.invalidateQueries(['packages']);
            closeEditModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.detail?.error || 'Failed to update package');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deletePackage,
        onSuccess: () => {
            toast.success('Package deleted successfully!');
            queryClient.invalidateQueries(['packages']);
        },
        onError: (err) => {
            toast.error(err.response?.data?.detail?.error || 'Failed to delete package');
        }
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', price: '', duration: '', features: '' });
        setFormErrors({});
    };

    const openEditModal = (pkg) => {
        setEditingPackage(pkg);
        setFormData({
            title: pkg.title,
            description: pkg.description || '',
            price: pkg.price,
            duration: pkg.duration_days || '',
            features: Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features || ''
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingPackage(null);
        setFormData({ title: '', description: '', price: '', duration: '', features: '' });
        setFormErrors({});
    };

    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title required';
        if (!formData.price) errors.price = 'Price required';
        else if (isNaN(formData.price) || formData.price <= 0) errors.price = 'Must be a positive number';
        if (formData.duration && isNaN(formData.duration)) errors.duration = 'Must be a number';
        return errors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length) return setFormErrors(errors);
        addMutation.mutate(formData);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length) return setFormErrors(errors);
        updateMutation.mutate({ id: editingPackage.id, data: formData });
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const filteredPackages = packages.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Manage Packages</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {filteredPackages.length} packages available
                        </p>
                    </div>
                    <button onClick={openModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
                        <FaPlus className="w-4 h-4" />
                        <span>Add Package</span>
                    </button>
                </div>

                {/* Search */}
                <div className="mb-8 max-w-md">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search packages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                </div>

                {/* Loading / Error / Grid */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {error && (
                    <div className="text-center py-20 bg-white rounded-2xl">
                        <p className="text-red-500">Error loading packages</p>
                    </div>
                )}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPackages.map((pkg, idx) => (
                            <div key={pkg.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
                                <div className={`relative bg-gradient-to-r ${getCardGradient(idx)} px-5 py-4`}>
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button onClick={() => openEditModal(pkg)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
                                            <FaEdit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(pkg.id, pkg.title)} className="p-2 bg-white/20 hover:bg-red-500/80 rounded-lg text-white">
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                            {getPackageIcon(pkg.title)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{pkg.title}</h3>
                                            <div className="flex gap-0.5 mt-1">
                                                {[...Array(4)].map((_, i) => <FaStar key={i} className="w-3 h-3 text-yellow-400" />)}
                                                <FaStar className="w-3 h-3 text-yellow-400/50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 space-y-4">
                                    {pkg.description && <p className="text-gray-600 text-sm">{pkg.description}</p>}
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-50 rounded-lg"><IndianRupee className="w-4 h-4 text-blue-600" /></div>
                                            <div><p className="text-xs text-gray-400">Price</p><p className="text-xl font-bold">₹{pkg.price}</p></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-orange-50 rounded-lg"><FaClock className="w-4 h-4 text-orange-600" /></div>
                                            <div><p className="text-xs text-gray-400">Duration</p><p className="font-semibold">{pkg.duration_days} days</p></div>
                                        </div>
                                    </div>
                                    {pkg.features && pkg.features.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-2 mb-2"><FaFire className="text-orange-500" /><span className="text-xs font-semibold">Features</span></div>
                                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                                {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium flex items-center justify-center gap-2">
                                        <span>View Details</span> <FaArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modals (same as yours but ensure fields match) */}
                {isModalOpen && <Modal title="Add New Package" formData={formData} formErrors={formErrors} isPending={addMutation.isPending} onChange={handleChange} onSubmit={handleSubmit} onClose={closeModal} />}
                {isEditModalOpen && <Modal title="Edit Package" formData={formData} formErrors={formErrors} isPending={updateMutation.isPending} onChange={handleChange} onSubmit={handleUpdate} onClose={closeEditModal} />}
            </div>
        </div>
    );
};

const Modal = ({ title, formData, formErrors, isPending, onChange, onSubmit, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><FaTimes /></button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-5">
                <div>
                    <label>Title *</label>
                    <input name="title" value={formData.title} onChange={onChange} className={`w-full px-4 py-2.5 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-xl`} />
                    {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title}</p>}
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" rows="3" value={formData.description} onChange={onChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Price (₹) *</label>
                        <input type="number" name="price" step="0.01" value={formData.price} onChange={onChange} className={`w-full px-4 py-2.5 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-xl`} />
                        {formErrors.price && <p className="text-red-500 text-xs">{formErrors.price}</p>}
                    </div>
                    <div>
                        <label>Duration (days)</label>
                        <input type="number" name="duration" value={formData.duration} onChange={onChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" placeholder="30" />
                    </div>
                </div>
                <div>
                    <label>Features (comma separated)</label>
                    <textarea name="features" rows="2" value={formData.features} onChange={onChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl" placeholder="24/7 Support, Analytics, API Access" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-100 rounded-xl">Cancel</button>
                    <button type="submit" disabled={isPending} className="px-5 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-60">
                        {isPending ? 'Saving...' : (title === 'Add New Package' ? 'Add Package' : 'Update')}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

export default AddPackage;