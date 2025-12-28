'use client';

import AdminLayout from '../../../components/AdminLayout';
import api from '../../../lib/apiClient';
import { useState, useEffect } from 'react';
import { MdCheckCircle, MdAccessTime, MdPerson, MdDelete } from 'react-icons/md';

export default function AdminPayLaterPage() {
    const [payLaterEntries, setPayLaterEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [markingPaid, setMarkingPaid] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [deleteAllType, setDeleteAllType] = useState(null); // 'unpaid', 'paid', or 'all'

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

    const handleDeleteClick = (id) => {
        setEntryToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!entryToDelete) return;
        try {
            setDeleting(entryToDelete);
            await api.deletePayLater(entryToDelete);
            await fetchPayLaterEntries();
            setShowDeleteModal(false);
            setEntryToDelete(null);
        } catch (err) {
            setError(err.message || 'Failed to delete entry');
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteAllClick = (type) => {
        setDeleteAllType(type);
    };

    const handleDeleteAll = async () => {
        if (deleteAllType === null) return;
        
        let isPaid = null;
        if (deleteAllType === 'paid') isPaid = true;
        else if (deleteAllType === 'unpaid') isPaid = false;
        
        try {
            setDeleting('all');
            await api.deleteAllPayLater(isPaid);
            await fetchPayLaterEntries();
            setShowDeleteAllConfirm(false);
            setDeleteAllType(null);
        } catch (err) {
            setError(err.message || 'Failed to delete entries');
        } finally {
            setDeleting(null);
        }
    };

    const unpaidEntries = payLaterEntries.filter(e => !e.isPaid);
    const paidEntries = payLaterEntries.filter(e => e.isPaid);

    return (
        <AdminLayout currentPage="pay-later">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Header */}
                    <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-primary-900">
                                Pay Later Entries
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                                Manage all customer payments that are pending across all barbers
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteAllConfirm(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors min-h-[44px] flex items-center gap-2"
                            >
                                <MdDelete size={20} />
                                Delete All
                            </button>
                        </div>
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
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase mb-1">Barber</p>
                                                            <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                                <MdPerson size={16} />
                                                                {entry.barber?.name || 'N/A'}
                                                            </p>
                                                        </div>
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
                                                        <div className="sm:col-span-2 lg:col-span-4">
                                                            <p className="text-xs text-gray-500 uppercase mb-1">Amount</p>
                                                            <p className="text-2xl font-bold text-orange-600">£{entry.amount.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleMarkAsPaid(entry.id)}
                                                            disabled={markingPaid === entry.id || deleting === entry.id}
                                                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2 whitespace-nowrap"
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
                                                        <button
                                                            onClick={() => handleDeleteClick(entry.id)}
                                                            disabled={markingPaid === entry.id || deleting === entry.id}
                                                            className="px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
                                                            title="Delete entry"
                                                        >
                                                            {deleting === entry.id ? (
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <MdDelete size={20} />
                                                            )}
                                                        </button>
                                                    </div>
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
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase mb-1">Barber</p>
                                                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                            <MdPerson size={16} />
                                                            {entry.barber?.name || 'N/A'}
                                                        </p>
                                                    </div>
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
                                                        <div className="sm:col-span-2 lg:col-span-3">
                                                            <p className="text-xs text-gray-500 uppercase mb-1">Paid At</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {new Date(entry.paidAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                                                        <button
                                                            onClick={() => handleDeleteClick(entry.id)}
                                                            disabled={deleting === entry.id}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
                                                            title="Delete entry"
                                                        >
                                                            {deleting === entry.id ? (
                                                                <>
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                    Deleting...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <MdDelete size={20} />
                                                                    Delete
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
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

            {/* Delete Single Entry Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <MdDelete className="text-red-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Delete Pay Later Entry</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this pay later entry? This will only remove the history record. 
                            If this entry was marked as paid, the corresponding entry in the system will remain untouched.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={deleting === entryToDelete}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
                            >
                                {deleting === entryToDelete ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setEntryToDelete(null);
                                }}
                                disabled={deleting === entryToDelete}
                                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete All Modal */}
            {showDeleteAllConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        {deleteAllType === null ? (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <MdDelete className="text-red-600" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Delete Pay Later Entries</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Choose which entries to delete. This will only remove the history records. 
                                    If any entries were marked as paid, the corresponding entries in the system will remain untouched.
                                </p>
                                <div className="flex flex-col gap-2 mb-6">
                                    <button
                                        onClick={() => handleDeleteAllClick('unpaid')}
                                        className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors min-h-[44px]"
                                    >
                                        Delete All Unpaid
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAllClick('paid')}
                                        className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors min-h-[44px]"
                                    >
                                        Delete All Paid
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAllClick('all')}
                                        className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors min-h-[44px]"
                                    >
                                        Delete ALL Entries
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowDeleteAllConfirm(false);
                                        setDeleteAllType(null);
                                    }}
                                    className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors min-h-[44px]"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <MdDelete className="text-red-600" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {deleteAllType === 'all' 
                                        ? 'Are you sure you want to delete ALL pay later entries? This action cannot be undone. This will only remove the history records.'
                                        : deleteAllType === 'paid'
                                        ? 'Are you sure you want to delete ALL paid entries? This action cannot be undone. This will only remove the history records.'
                                        : 'Are you sure you want to delete ALL unpaid entries? This action cannot be undone. This will only remove the history records.'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDeleteAll}
                                        disabled={deleting === 'all'}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
                                    >
                                        {deleting === 'all' ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteAllType(null);
                                        }}
                                        disabled={deleting === 'all'}
                                        className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

