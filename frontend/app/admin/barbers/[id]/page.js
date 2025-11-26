'use client';

import AdminLayout from '../../../../components/AdminLayout';
import { useQuery, gql } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdAttachMoney, MdPeople, MdBarChart, MdArrowBack } from 'react-icons/md';

const GET_BARBER = gql`
  query GetBarber($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      shop {
        id
        name
      }
    }
  }
`;

const GET_BARBER_ENTRIES = gql`
  query GetBarberEntries($barberId: ID!, $startDate: String, $endDate: String) {
    entries(barberId: $barberId, startDate: $startDate, endDate: $endDate) {
      id
      clientNumber
      date
      time
      totalAmount
      paymentMethod
      entryServices {
        service {
          name
        }
      }
    }
  }
`;

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="p-6 bg-white rounded-xl border-2 border-primary-900 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <p className="text-secondary-500 text-sm font-semibold uppercase">{title}</p>
                <div className="text-primary-900">{icon}</div>
            </div>
            <p className="text-3xl font-bold text-primary-900">{value}</p>
        </div>
    );
};

export default function BarberReportPage() {
    const params = useParams();
    const router = useRouter();
    const barberId = params.id;
    
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);

    const { data: barberData, loading: barberLoading } = useQuery(GET_BARBER, {
        variables: { id: barberId },
        skip: !barberId,
    });

    const { data: entriesData, loading: entriesLoading, refetch } = useQuery(GET_BARBER_ENTRIES, {
        variables: { 
            barberId,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        },
        skip: !barberId,
    });

    const handleDateFilter = async () => {
        setIsFiltering(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // Show loader
            await refetch();
        } finally {
            setIsFiltering(false);
        }
    };

    const handleReset = async () => {
        setStartDate('');
        setEndDate('');
        setIsFiltering(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // Show loader
            await refetch({
                barberId,
                startDate: undefined,
                endDate: undefined,
            });
        } finally {
            setIsFiltering(false);
        }
    };

    const entries = entriesData?.entries || [];
    const totalRevenue = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const totalEntries = entries.length;
    const avgTicket = totalEntries > 0 ? (totalRevenue / totalEntries).toFixed(2) : '0.00';

    const paymentMethods = entries.reduce((acc, entry) => {
        acc[entry.paymentMethod] = (acc[entry.paymentMethod] || 0) + entry.totalAmount;
        return acc;
    }, {});

    if (barberLoading) {
        return (
            <AdminLayout currentPage="barbers">
                <div className="h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    const barber = barberData?.user;

    return (
        <AdminLayout currentPage="barbers">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/admin/barbers')}
                                className="flex items-center gap-2 bg-secondary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-900 transition-colors"
                            >
                                <MdArrowBack size={20} />
                                Back
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-primary-900">
                                    {barber?.name} - Report Dashboard
                                </h1>
                                <p className="text-secondary-500 mt-1">
                                    {barber?.email} {barber?.shop && `• ${barber.shop.name}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="p-6 bg-white rounded-xl border border-secondary-500">
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-semibold text-primary-900 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-semibold text-primary-900 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                />
                            </div>
                            <button
                                onClick={handleDateFilter}
                                disabled={isFiltering || entriesLoading}
                                className="bg-primary-900 text-white px-6 py-2 rounded-xl hover:bg-secondary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isFiltering || entriesLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Filtering...
                                    </span>
                                ) : (
                                    'Apply Filter'
                                )}
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={isFiltering || entriesLoading}
                                className="bg-gray-200 text-primary-900 px-6 py-2 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Entries"
                            value={totalEntries}
                            icon={<MdPeople size={24} />}
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`£${totalRevenue.toFixed(2)}`}
                            icon={<MdAttachMoney size={24} />}
                        />
                        <StatCard
                            title="Avg. Ticket"
                            value={`£${avgTicket}`}
                            icon={<MdBarChart size={24} />}
                        />
                        <StatCard
                            title="Total Services"
                            value={entries.reduce((sum, e) => sum + e.entryServices.length, 0)}
                            icon={<MdBarChart size={24} />}
                        />
                    </div>

                    {/* Payment Methods */}
                    <div className="p-6 bg-white rounded-xl border border-secondary-500">
                        <h2 className="text-lg font-semibold mb-4 text-primary-900">Payment Methods</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(paymentMethods).map(([method, amount]) => (
                                <div key={method} className="p-4 bg-gray-50 rounded-lg border border-primary-900">
                                    <p className="text-secondary-500 text-sm mb-1">{method}</p>
                                    <p className="text-xl font-bold text-primary-900">
                                        £{amount.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Entries Table */}
                    <div className="p-6 bg-white rounded-xl border border-secondary-500">
                        <h2 className="text-lg font-semibold mb-4 text-primary-900">Entries</h2>
                        {entriesLoading ? (
                            <div className="py-8 flex justify-center">
                                <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : entries.length === 0 ? (
                            <p className="text-secondary-500 text-center py-8">
                                No entries found for the selected date range
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-secondary-500">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Client Number</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Time</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Services</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Amount</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {entries.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-900">{entry.clientNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{new Date(entry.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{entry.time}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {entry.entryServices.map((es, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-block bg-primary-900 text-white text-xs font-semibold px-2 py-1 rounded-md"
                                                            >
                                                                {es.service.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-900">£{entry.totalAmount.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-block bg-secondary-500 text-white px-3 py-1 rounded-md text-xs font-semibold">
                                                        {entry.paymentMethod}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
