'use client';

import { MdList, MdAdd } from 'react-icons/md';
import BarberLayout from '../../../components/BarberLayout';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const GET_ENTRIES = gql`
  query GetEntries($barberId: ID) {
    entries(barberId: $barberId) {
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

export default function BarberDashboard() {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    const { data, loading, error, refetch } = useQuery(GET_ENTRIES, {
        variables: { barberId: user?.id },
        skip: !user?.id,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                await refetch();
            }
        };
        fetchData();
    }, [user?.id, refetch]);

    if (loading) {
        return (
            <BarberLayout currentPage="dashboard">
                <div className="h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                </div>
            </BarberLayout>
        );
    }

    if (error) {
        return (
            <BarberLayout currentPage="dashboard">
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <p className="text-red-500">Error loading entries: {error.message}</p>
                </div>
            </BarberLayout>
        );
    }

    const entries = data?.entries || [];

    return (
        <BarberLayout currentPage="dashboard">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-primary-900">
                                My Entries
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                                View all your client entries
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/barber/add-entry')}
                            className="flex items-center justify-center gap-2 bg-primary-900 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:bg-primary-800 transition-all duration-300 active:scale-95 sm:hover:-translate-y-0.5 sm:hover:shadow-xl min-h-[44px] w-full sm:w-auto"
                        >
                            <MdAdd size={20} />
                            <span className="text-sm sm:text-base">Add Entry</span>
                        </button>
                    </div>

                    {/* Table - Desktop / Cards - Mobile */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Client Number
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Services
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Payment Method
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {entries.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <MdList size={64} className="text-secondary-500" />
                                                    <p className="text-secondary-600 text-lg font-medium">
                                                        No entries yet
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        Add your first entry to get started!
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        entries.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className="transition-all hover:bg-gray-50 hover:scale-[1.01]"
                                            >
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap font-bold text-primary-900">
                                                    {entry.clientNumber}
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                    {new Date(entry.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                    {entry.time}
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {entry.entryServices.map((es, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-md"
                                                            >
                                                                {es.service.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap font-bold text-green-600 text-base lg:text-lg">
                                                    £{entry.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-block px-2 lg:px-3 py-1 rounded-md text-xs font-semibold ${
                                                            entry.paymentMethod === 'Cash'
                                                                ? 'bg-green-100 text-green-800'
                                                                : entry.paymentMethod === 'Card'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : entry.paymentMethod === 'Apple Pay'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-orange-100 text-orange-800'
                                                        }`}
                                                    >
                                                        {entry.paymentMethod}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {entries.length === 0 ? (
                                <div className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <MdList size={48} className="text-secondary-500" />
                                        <p className="text-secondary-600 text-base font-medium">
                                            No entries yet
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Add your first entry to get started!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                entries.map((entry) => (
                                    <div key={entry.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Client Number</p>
                                                <p className="font-bold text-primary-900">{entry.clientNumber}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase">Amount</p>
                                                <p className="font-bold text-green-600 text-lg">£{entry.totalAmount.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Date</p>
                                                <p className="text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Time</p>
                                                <p className="text-sm">{entry.time}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Services</p>
                                            <div className="flex flex-wrap gap-1">
                                                {entry.entryServices.map((es, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-md"
                                                    >
                                                        {es.service.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Payment</p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${
                                                    entry.paymentMethod === 'Cash'
                                                        ? 'bg-green-100 text-green-800'
                                                        : entry.paymentMethod === 'Card'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : entry.paymentMethod === 'Apple Pay'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-orange-100 text-orange-800'
                                                }`}
                                            >
                                                {entry.paymentMethod}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BarberLayout>
    );
}
