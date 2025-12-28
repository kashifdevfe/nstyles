'use client';

import { MdAttachMoney, MdPeople, MdContentCut, MdBarChart, MdDateRange, MdAccessTime } from 'react-icons/md';
import AdminLayout from '../../../components/AdminLayout';
import { api } from '../../../lib/apiClient';
import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const StatCard = ({ title, stat, icon, helpText }) => {
    return (
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-400 relative overflow-hidden border border-secondary-500 active:scale-95 sm:hover:-translate-y-2 sm:hover:shadow-2xl group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary-900" />
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-secondary-500 font-semibold uppercase tracking-wide mb-1 sm:mb-2">
                        {title}
                    </p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-900 mb-1 sm:mb-2 truncate">
                        {stat}
                    </p>
                    {helpText && (
                        <p className="text-[10px] sm:text-xs text-secondary-500 mb-0">
                            {helpText}
                        </p>
                    )}
                </div>
                <div className="p-2 sm:p-3 md:p-4 bg-primary-900 text-white rounded-lg sm:rounded-xl shadow-sm rotate-[-5deg] transition-transform group-hover:rotate-0 group-hover:scale-110 flex-shrink-0">
                    <div className="text-xl sm:text-2xl md:text-3xl">{icon}</div>
                </div>
            </div>
        </div>
    );
};

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#000000'];

export default function AdminDashboard() {
    // Get today's date for default end date
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get 7 days ago for default start date
    const getDefaultStartDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [endDate, setEndDate] = useState(getTodayDate());
    const [stats, setStats] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [statsData, weeklyReportData] = await Promise.all([
                api.getStats(startDate, endDate),
                api.getWeeklyReport(startDate, endDate)
            ]);
            setStats(statsData);
            const weekly = (weeklyReportData?.dailySales || []).map(d => ({
                name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: d.revenue
            }));
            setWeeklyData(weekly);
        } catch (err) {
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDateFilter = async () => {
        await fetchData();
    };

    const handleResetDates = async () => {
        const defaultStart = getDefaultStartDate();
        const defaultEnd = getTodayDate();
        setStartDate(defaultStart);
        setEndDate(defaultEnd);
        await fetchData();
    };

    if (loading) {
        return (
            <AdminLayout currentPage="dashboard">
                <div className="h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout currentPage="dashboard">
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <p className="text-red-500">Error loading stats: {error}</p>
                </div>
            </AdminLayout>
        );
    }

    const paymentData = [
        { name: 'Cash', value: stats?.cashPayments || 0, color: '#22c55e' },
        { name: 'Card', value: stats?.cardPayments || 0, color: '#3b82f6' },
        { name: 'Apple Pay', value: stats?.applePayPayments || 0, color: '#000000' },
        { name: 'Other', value: stats?.otherPayments || 0, color: '#f59e0b' },
    ];

    return (
        <AdminLayout currentPage="dashboard">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-10 px-3 sm:px-4">
                <div className="mb-6 sm:mb-8 md:mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-primary-900">
                                Dashboard Overview
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                                Welcome back! Here's what's happening.
                            </p>
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
                            <div className="flex-1 flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <MdDateRange size={18} />
                                            Start Date
                                        </div>
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={endDate}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <MdDateRange size={18} />
                                            End Date
                                        </div>
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        max={getTodayDate()}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleDateFilter}
                                    className="flex items-center justify-center gap-2 bg-primary-900 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 active:scale-95 transition-colors min-h-[44px] flex-1 sm:flex-none"
                                >
                                    <MdDateRange size={18} />
                                    <span className="text-sm sm:text-base">Apply Filter</span>
                                </button>
                                <button
                                    onClick={handleResetDates}
                                    className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 active:scale-95 transition-colors min-h-[44px]"
                                >
                                    <span className="text-sm sm:text-base">Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <StatCard
                        title="Total Revenue"
                        stat={`£${stats?.totalRevenueToday?.toFixed(2) || '0.00'}`}
                        icon={<MdAttachMoney size={32} />}
                    />
                    <StatCard
                        title="Total Customers"
                        stat={stats?.totalCustomersToday || 0}
                        icon={<MdPeople size={32} />}
                    />
                    <StatCard
                        title="Services Performed"
                        stat={stats?.totalServicesPerformed || 0}
                        icon={<MdContentCut size={32} />}
                    />
                    <StatCard
                        title="Avg. Ticket"
                        stat={`£${stats?.totalCustomersToday ? (stats.totalRevenueToday / stats.totalCustomersToday).toFixed(2) : '0.00'}`}
                        icon={<MdBarChart size={32} />}
                    />
                    <StatCard
                        title="Loan Remaining"
                        stat={`£${(stats?.loanRemaining || 0).toFixed(2)}`}
                        icon={<MdAccessTime size={32} />}
                        helpText="Unpaid Pay Later"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    <div className="lg:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-secondary-500">
                        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-primary-900">
                            Revenue Trend
                        </h2>
                        {isClient && (
                            <div className="h-[250px] sm:h-[300px] md:h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                                            {weeklyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-secondary-500">
                        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-primary-900">
                            Payment Methods
                        </h2>
                        {isClient && (
                            <div className="h-[250px] sm:h-[300px] md:h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {paymentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
