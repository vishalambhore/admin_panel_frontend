import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaTimes, FaUserPlus, FaEnvelope, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa';

const fetchUsers = async () => {
    const response = await axiosInstance.get('/admin/users');  // ← admin prefix
    return response.data.users;
};

const addUser = async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
};

const AddUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const mutation = useMutation({
        mutationFn: addUser,
        onSuccess: () => {
            toast.success('User added successfully!', {
                style: { background: '#10B981', color: '#fff', borderRadius: '12px' },
                iconTheme: { primary: '#fff', secondary: '#10B981' },
            });
            queryClient.invalidateQueries(['users']);
            queryClient.invalidateQueries(['dashboardStats']);
            closeModal();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add user', {
                style: { background: '#EF4444', color: '#fff', borderRadius: '12px' },
            });
        }
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phone: '' });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name required';
        if (!formData.email.trim()) errors.email = 'Email required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
        return errors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length) {
            setFormErrors(errors);
            return;
        }
        mutation.mutate(formData);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8">
                {/* Header Section with Glassmorphism effect */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="relative">
                        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Manage Users
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
                            View, search and add new members
                        </p>
                    </div>
                    
                </div>

                {/* Search Bar with enhanced design */}
                <div className="mb-8 max-w-md">
                    <div className="relative group">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>

                {/* Users Table with modern card styling */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {isLoading && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-500 font-medium">Loading users...</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {error && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-red-500 text-5xl">⚠️</div>
                                                <p className="text-red-500 font-medium">Error loading users. Please try again.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && !error && filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-gray-400 text-5xl">👥</div>
                                                <p className="text-gray-500 font-medium">No users found</p>
                                                <p className="text-gray-400 text-sm">Try adjusting your search</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filteredUsers.map((user, idx) => (
                                    <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="w-3.5 h-3.5 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaPhoneAlt className="w-3.5 h-3.5 text-gray-400" />
                                                {user.phone || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modern Modal with animation and glassmorphism */}
                {isModalOpen && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
                        onClick={closeModal}
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-in zoom-in-95"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                                            <FaUserPlus className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Add New User</h3>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer group"
                                    >
                                        <FaTimes className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </button>
                                </div>
                                {/* <p className="text-sm text-gray-500 mt-2 ml-12">Fill in the details below</p> */}
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 border ${formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white`}
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    {formErrors.name && <p className="text-xs text-red-500 flex items-center gap-1 mt-1">⚠️ {formErrors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white`}
                                            placeholder="user@example.com"
                                        />
                                    </div>
                                    {formErrors.email && <p className="text-xs text-red-500 flex items-center gap-1 mt-1">⚠️ {formErrors.email}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                                    <div className="relative">
                                        <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            placeholder="+91 1234567890"
                                        />
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    {/* <button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <FaUserPlus className="w-4 h-4" />
                                                Add User
                                            </>
                                        )}
                                    </button> */}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddUser;