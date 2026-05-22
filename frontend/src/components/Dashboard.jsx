import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';
import { FaUsers, FaBox, FaArrowUp } from 'react-icons/fa';

const fetchStats = async () => {
    const results = await Promise.allSettled([
        axiosInstance.get('/admin/dashboard/total-users'),
        axiosInstance.get('/admin/dashboard/total-packages'),
    ]);
    
    let usersCount = 0, packagesCount = 0;
    
    if (results[0].status === 'fulfilled') {
        usersCount = results[0].value.data.total_users || 0;
    } else {
        console.error('Users error:', results[0].reason);
    }
    
    if (results[1].status === 'fulfilled') {
        packagesCount = results[1].value.data.total_packages || 0;
    } else {
        console.error('Packages error:', results[1].reason);
    }
    
    return { usersCount, packagesCount };
};

const Dashboard = () => {
    const { data: stats = { usersCount: 0, packagesCount: 0 }, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchStats,
        retry: 1,
    });

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Welcome back, here's your overview</p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white/80 rounded-2xl shadow-md p-6 animate-pulse">
                                <div className="h-24 bg-gray-200 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Users Card */}
                        <div className="relative group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-white/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                            <div className="relative p-6 z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-semibold uppercase">Total Users</p>
                                        <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.usersCount.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg">
                                        <FaUsers className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <FaArrowUp className="w-3 h-3 mr-1" />
                                        +12%
                                    </span>
                                    <span className="text-gray-400">vs last month</span>
                                </div>
                            </div>
                        </div>

                        {/* Packages Card */}
                        <div className="relative group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-white/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                            <div className="relative p-6 z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-semibold uppercase">Total Packages</p>
                                        <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.packagesCount.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                                        <FaBox className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <FaArrowUp className="w-3 h-3 mr-1" />
                                        +5
                                    </span>
                                    <span className="text-gray-400">new this week</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;