'use client';

import BarberLayout from '../../../components/BarberLayout';
import api from '../../../lib/apiClient';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { MdCheckCircle, MdAccessTime } from 'react-icons/md';

export default function PayLaterPage() {
    const { user } = useSelector((state) => state.auth);
    const [payLaterEntries, setPayLaterEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [markingPaid, setMarkingPaid] = useState(null);

    useEffect(() => {
        fetchPayLaterEntries();
    }, []);

    const fetchPayLaterEntries = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await api.getPayLaterEntries();
            setPayLaterEntries(data || []);
        } catch (err) {
            setError('Failed to load pay later entries');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (id) => {
        try {
            setMarkingPaid(id);
            await api.markPayLaterAsPaid(id);
            await fetchPayLaterEntries();
        } catch (err) {
            setError(err.message || 'Failed to mark as paid');
        } finally {
            setMarkingPaid(null);
        }
    };

    const unpaidEntries = payLaterEntries.filter(e => !e.isPaid);
    const paidEntries = payLaterEntries.filter(e => e.isPaid);

    return (
        <BarberLayout currentPage="pay-later">
            <div className="max-w-6xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Header */}
                    <div className="mb-2">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-primary-900">
                            Pay Later Entries
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                            Manage customer payments that are pending
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Unpaid Entries */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                                <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                                    <MdAccessTime className="text-orange-500" />
                                    Pending Payments ({unpaidEntries.length})
                                </h2>
                                {unpaidEntries.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No pending payments</p>
                                ) : (
                                    <div className="space-y-3">
                                        {unpaidEntries.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase mb-1">Customer Name</p>
                                                                <p className="font-semibold text-gray-900">{entry.customerName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase mb-1">Phone Number</p>
                                                                <p className="font-semibold text-gray-900">{entry.customerPhone}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase mb-1">Date & Time</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {new Date(entry.date).toLocaleDateString()} at {entry.time}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase mb-1">Amount</p>
                                                                <p className="text-2xl font-bold text-orange-600">£{entry.amount.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleMarkAsPaid(entry.id)}
                                                        disabled={markingPaid === entry.id}
                                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
                                                    >
                                                        {markingPaid === entry.id ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MdCheckCircle size={20} />
                                                                Amount Received
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Paid Entries */}
                            {paidEntries.length > 0 && (
                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                                    <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                                        <MdCheckCircle className="text-green-500" />
                                        Paid Entries ({paidEntries.length})
                                    </h2>
                                    <div className="space-y-3">
                                        {paidEntries.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="p-4 border-2 border-green-200 bg-green-50 rounded-lg"
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase mb-1">Customer Name</p>
                                                        <p className="font-semibold text-gray-900">{entry.customerName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase mb-1">Phone Number</p>
                                                        <p className="font-semibold text-gray-900">{entry.customerPhone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase mb-1">Date & Time</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {new Date(entry.date).toLocaleDateString()} at {entry.time}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase mb-1">Amount</p>
                                                        <p className="text-2xl font-bold text-green-600">£{entry.amount.toFixed(2)}</p>
                                                    </div>
                                                    {entry.paidAt && (
                                                        <div className="sm:col-span-2">
                                                            <p className="text-xs text-gray-500 uppercase mb-1">Paid At</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {new Date(entry.paidAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </BarberLayout>
    );
}

