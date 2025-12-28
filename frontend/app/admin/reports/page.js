'use client';

import AdminLayout from '../../../components/AdminLayout';
import { api } from '../../../lib/apiClient';
import { MdDateRange } from 'react-icons/md';
import { useState, useEffect } from 'react';

const CHART_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#000000', '#f97316', '#14b8a6'];

const StatBox = ({ label, value, color = '#000000' }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4" style={{ borderLeftColor: color }}>
            <p className="text-sm text-secondary-500 mb-2 font-semibold">{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        </div>
    );
};

export default function ReportsPage() {
    // Get today's date for default end date
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get default start date based on tab type
    const getDefaultStartDate = (tab = 'weekly') => {
        const date = new Date();
        if (tab === 'monthly') {
            date.setDate(date.getDate() - 30);
        } else if (tab === 'weekly') {
            date.setDate(date.getDate() - 7);
        } else {
            // daily - today
            date.setDate(date.getDate());
        }
        return date.toISOString().split('T')[0];
    };

    // Get current month in YYYY-MM format for default
    const getCurrentMonth = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    // Get start and end dates for a given month (YYYY-MM format)
    const getMonthDates = (monthYear) => {
        const [year, month] = monthYear.split('-').map(Number);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    };

    const [activeTab, setActiveTab] = useState('daily');
    const [startDate, setStartDate] = useState(() => getDefaultStartDate('daily'));
    const [endDate, setEndDate] = useState(getTodayDate());
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [dailyReport, setDailyReport] = useState(null);
    const [weeklyReport, setWeeklyReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialMount, setIsInitialMount] = useState(true);

    useEffect(() => {
        // Initial fetch with default dates for all tabs
        const { start, end } = getMonthDates(selectedMonth);
        fetchReports();
        setIsInitialMount(false);
    }, []);

    // Fetch data when tab changes and update date range
    useEffect(() => {
        if (isInitialMount) return; // Skip on initial mount
        
        if (activeTab === 'monthly') {
            // For monthly, use the selected month
            const { start, end } = getMonthDates(selectedMonth);
            setStartDate(start);
            setEndDate(end);
            fetchReportForTab(activeTab, start, end);
        } else {
            // For daily and weekly, use default date ranges
            const newStartDate = getDefaultStartDate(activeTab);
            const newEndDate = getTodayDate();
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            fetchReportForTab(activeTab, newStartDate, newEndDate);
        }
    }, [activeTab, selectedMonth]);

    const fetchReportForTab = async (tab = activeTab, start = startDate, end = endDate) => {
        try {
            setError(null);
            let report;
            if (tab === 'daily') {
                report = await api.getDailyReport(start, end);
                setDailyReport(report);
            } else if (tab === 'weekly') {
                report = await api.getWeeklyReport(start, end);
                setWeeklyReport(report);
            } else if (tab === 'monthly') {
                report = await api.getMonthlyReport(start, end);
                setMonthlyReport(report);
            }
        } catch (err) {
            setError(err.message || 'Failed to load report');
        }
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const { start: monthStart, end: monthEnd } = getMonthDates(selectedMonth);
            const [daily, weekly, monthly] = await Promise.all([
                api.getDailyReport(startDate, endDate),
                api.getWeeklyReport(startDate, endDate),
                api.getMonthlyReport(monthStart, monthEnd)
            ]);
            setDailyReport(daily);
            setWeeklyReport(weekly);
            setMonthlyReport(monthly);
        } catch (err) {
            setError(err.message || 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilter = async () => {
        await fetchReportForTab();
    };

    const handleMonthChange = async (monthYear) => {
        setSelectedMonth(monthYear);
        const { start, end } = getMonthDates(monthYear);
        setStartDate(start);
        setEndDate(end);
        await fetchReportForTab('monthly', start, end);
    };

    const handleResetDates = async () => {
        if (activeTab === 'monthly') {
            const currentMonth = getCurrentMonth();
            setSelectedMonth(currentMonth);
            const { start, end } = getMonthDates(currentMonth);
            setStartDate(start);
            setEndDate(end);
            await fetchReportForTab('monthly', start, end);
        } else {
            const defaultStart = getDefaultStartDate(activeTab);
            const defaultEnd = getTodayDate();
            setStartDate(defaultStart);
            setEndDate(defaultEnd);
            await fetchReportForTab(activeTab, defaultStart, defaultEnd);
        }
    };

    if (loading) {
        return (
            <AdminLayout currentPage="reports">
                <div className="h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout currentPage="reports">
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <p className="text-red-500">Error loading reports: {error}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout currentPage="reports">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-primary-900">Reports</h1>
                        <p className="text-secondary-500">Detailed analytics and insights</p>
                    </div>

                    {/* Date Range Filter / Month Selector */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                        {activeTab === 'monthly' ? (
                            // Month Selector for Monthly Report
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <MdDateRange size={18} />
                                            Select Month
                                        </div>
                                    </label>
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) => handleMonthChange(e.target.value)}
                                        max={getCurrentMonth()}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                    />
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleResetDates}
                                        className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 active:scale-95 transition-colors min-h-[44px]"
                                    >
                                        <span className="text-sm sm:text-base">Reset to Current Month</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Date Range Filter for Daily and Weekly
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
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('daily')}
                                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                                    activeTab === 'daily'
                                        ? 'border-primary-900 text-primary-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Daily Report
                            </button>
                            <button
                                onClick={() => setActiveTab('weekly')}
                                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                                    activeTab === 'weekly'
                                        ? 'border-primary-900 text-primary-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Weekly Report
                            </button>
                            <button
                                onClick={() => setActiveTab('monthly')}
                                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                                    activeTab === 'monthly'
                                        ? 'border-primary-900 text-primary-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Monthly Report
                            </button>
                        </div>
                    </div>

                    {/* Daily Report */}
                    {activeTab === 'daily' && (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <StatBox
                                    label="Total Customers"
                                    value={dailyReport?.totalCustomers || 0}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Total Revenue"
                                    value={`£${(dailyReport?.totalRevenue || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Cash Payments"
                                    value={`£${(dailyReport?.cashPayments || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Card Payments"
                                    value={`£${(dailyReport?.cardPayments || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Loan Remaining"
                                    value={`£${(dailyReport?.loanRemaining || 0).toFixed(2)}`}
                                    color="#f97316"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold mb-4 text-primary-900">Payment Method Breakdown</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Cash</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(dailyReport?.cashPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Card</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(dailyReport?.cardPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Apple Pay</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(dailyReport?.applePayPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Other</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(dailyReport?.otherPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-500">
                                        <p className="text-sm text-secondary-500">Pay Later (Paid)</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(dailyReport?.payLaterPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold mb-4 text-primary-900">Service Usage Count</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary-500">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Service</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-white">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dailyReport?.serviceUsage?.map((service, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-primary-900">{service.serviceName}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-primary-900">{service.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Weekly Report */}
                    {activeTab === 'weekly' && (
                        <div className="flex flex-col gap-6">
                            {/* Date Range Tag */}
                            <div className="bg-primary-900 text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-center gap-2">
                                <MdDateRange size={20} />
                                <span className="font-semibold">
                                    {new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <StatBox
                                    label="Total Customers"
                                    value={weeklyReport?.totalCustomers || 0}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Total Revenue"
                                    value={`£${(weeklyReport?.totalRevenue || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Cash Payments"
                                    value={`£${(weeklyReport?.cashPayments || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Card Payments"
                                    value={`£${(weeklyReport?.cardPayments || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Loan Remaining"
                                    value={`£${(weeklyReport?.loanRemaining || 0).toFixed(2)}`}
                                    color="#f97316"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold mb-4 text-primary-900">Payment Method Breakdown</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Cash</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(weeklyReport?.cashPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Card</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(weeklyReport?.cardPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Apple Pay</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(weeklyReport?.applePayPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Other</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(weeklyReport?.otherPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-500">
                                        <p className="text-sm text-secondary-500">Pay Later (Paid)</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(weeklyReport?.payLaterPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold mb-4 text-primary-900">Service Usage Count</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary-500">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Service</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-white">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {weeklyReport?.serviceUsage?.map((service, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-primary-900">{service.serviceName}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-primary-900">{service.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Monthly Report */}
                    {activeTab === 'monthly' && (
                        <div className="flex flex-col gap-6">
                            {/* Month Name Tag */}
                            <div className="bg-primary-900 text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-center gap-2">
                                <MdDateRange size={20} />
                                <span className="font-semibold text-lg">
                                    {new Date(selectedMonth + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <StatBox
                                    label="Total Customers"
                                    value={monthlyReport?.totalCustomers || 0}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Total Revenue"
                                    value={`£${(monthlyReport?.totalRevenue || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Cash Payments"
                                    value={`£${(monthlyReport?.cashPayments || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Card Payments"
                                    value={`£${(monthlyReport?.cardPayments || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Loan Remaining"
                                    value={`£${(monthlyReport?.loanRemaining || 0).toFixed(2)}`}
                                    color="#f97316"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold mb-4 text-primary-900">Payment Method Breakdown</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Cash</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(monthlyReport?.cashPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Card</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(monthlyReport?.cardPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Apple Pay</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(monthlyReport?.applePayPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-primary-900">
                                        <p className="text-sm text-secondary-500">Other</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(monthlyReport?.otherPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-500">
                                        <p className="text-sm text-secondary-500">Pay Later (Paid)</p>
                                        <p className="text-xl font-bold text-primary-900">
                                            £{(monthlyReport?.payLaterPayments || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold mb-4 text-primary-900">Service Usage Count</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary-500">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Service</th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-white">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {monthlyReport?.serviceUsage?.map((service, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-primary-900">{service.serviceName}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-primary-900">{service.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
