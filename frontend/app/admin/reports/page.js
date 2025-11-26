'use client';

import AdminLayout from '../../../components/AdminLayout';
import { useQuery, gql } from '@apollo/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';

const GET_REPORTS = gql`
  query GetReports {
    dailyReport {
      totalCustomers
      totalRevenue
      cashPayments
      cardPayments
      applePayPayments
      otherPayments
      serviceUsage {
        serviceName
        count
      }
    }
    weeklyReport {
      totalRevenue
      mostUsedService
      dailySales {
        date
        revenue
      }
    }
    monthlyReport {
      totalRevenue
      topBarber
      mostRequestedService
      dailySales {
        date
        revenue
      }
    }
  }
`;

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
    const [activeTab, setActiveTab] = useState('daily');
    const { data, loading, error } = useQuery(GET_REPORTS);

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
                    <p className="text-red-500">Error loading reports: {error.message}</p>
                </div>
            </AdminLayout>
        );
    }

    const dailyReport = data?.dailyReport;
    const weeklyReport = data?.weeklyReport;
    const monthlyReport = data?.monthlyReport;

    return (
        <AdminLayout currentPage="reports">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-primary-900">Reports</h1>
                        <p className="text-secondary-500">Detailed analytics and insights</p>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <StatBox
                                    label="Total Revenue (7 Days)"
                                    value={`£${(weeklyReport?.totalRevenue || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Most Used Service"
                                    value={weeklyReport?.mostUsedService || 'N/A'}
                                    color="#000000"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold mb-4 text-primary-900">Last 7 Days Sales</h2>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={weeklyReport?.dailySales || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Revenue (£)" radius={[4, 4, 0, 0]}>
                                            {(weeklyReport?.dailySales || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Monthly Report */}
                    {activeTab === 'monthly' && (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatBox
                                    label="Total Revenue (30 Days)"
                                    value={`£${(monthlyReport?.totalRevenue || 0).toFixed(2)}`}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Top Barber"
                                    value={monthlyReport?.topBarber || 'N/A'}
                                    color="#000000"
                                />
                                <StatBox
                                    label="Most Requested Service"
                                    value={monthlyReport?.mostRequestedService || 'N/A'}
                                    color="#000000"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold mb-4 text-primary-900">Monthly Revenue Chart</h2>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={monthlyReport?.dailySales || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Revenue (£)" radius={[4, 4, 0, 0]}>
                                            {(monthlyReport?.dailySales || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
