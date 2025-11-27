'use client';

import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import AdminLayout from '../../../components/AdminLayout';
import api from '../../../lib/apiClient';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

const validationSchema = Yup.object({
    name: Yup.string().required('Service name is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
});

export default function ServicesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await api.getServices();
                setServices(data || []);
            } catch (err) {
                setError('Failed to load services');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setError('');
            setSuccess('');
            if (editingService) {
                setUpdateLoading(true);
                await api.updateService(editingService.id, values);
                await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
                setSuccess('Service Updated');
            } else {
                setCreateLoading(true);
                await api.createService(values);
                await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
                setSuccess('Service Created');
            }
            // Refetch services
            const data = await api.getServices();
            setServices(data || []);
            setIsModalOpen(false);
            setEditingService(null);
        } catch (err) {
            setError(err.message || 'Error');
        } finally {
            setCreateLoading(false);
            setUpdateLoading(false);
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!serviceToDelete) return;
        try {
            setError('');
            setSuccess('');
            setDeleteLoading(true);
            await api.deleteService(serviceToDelete.id);
            await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
            setSuccess('Service Deleted');
            // Refetch services
            const data = await api.getServices();
            setServices(data || []);
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
        } catch (err) {
            setError(err.message || 'Failed to delete service. It may be in use.');
            setIsDeleteModalOpen(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const isMutationLoading = createLoading || updateLoading || deleteLoading;

    if (loading) {
        return (
            <AdminLayout currentPage="services">
                <div className="h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout currentPage="services">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-primary-900">Services</h1>
                            <p className="text-gray-600">Manage available services and pricing</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingService(null);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-xl hover:bg-primary-800 transition-colors"
                        >
                            <MdAdd size={20} />
                            Add Service
                        </button>
                    </div>

                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-600 text-sm">{success}</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Service Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {services.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold">{service.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg text-green-600 font-bold">
                                                £{service.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingService(service);
                                                            setIsModalOpen(true);
                                                        }}
                                                        disabled={isMutationLoading}
                                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                    >
                                                        <MdEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(service)}
                                                        disabled={deleteLoading}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                    >
                                                        {deleteLoading ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <MdDelete size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingService(null);
                                    }}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                                <h2 className="text-2xl font-bold mb-6 text-primary-900">
                                    {editingService ? 'Edit Service' : 'Add Service'}
                                </h2>
                                <Formik
                                    initialValues={{
                                        name: editingService?.name || '',
                                        price: editingService?.price || 0,
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                                        <Form>
                                            <div className="flex flex-col gap-4">
                                                <Field name="name">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Service Name
                                                            </label>
                                                            <input
                                                                {...field}
                                                                placeholder="Haircut"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                            {errors.name && touched.name && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name="price">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Price (£)
                                                            </label>
                                                            <input
                                                                {...field}
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={values.price}
                                                                onChange={(e) => setFieldValue('price', parseFloat(e.target.value) || 0)}
                                                                placeholder="5.00"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                            {errors.price && touched.price && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Field>
                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting || isMutationLoading}
                                                        className="flex-1 bg-primary-900 text-white py-3 rounded-xl font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting || isMutationLoading ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                {editingService ? 'Updating...' : 'Creating...'}
                                                            </span>
                                                        ) : (
                                                            editingService ? 'Update' : 'Create'
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsModalOpen(false);
                                                            setEditingService(null);
                                                        }}
                                                        disabled={isMutationLoading}
                                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 relative">
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary-900">
                                    Delete Service
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete <strong>{serviceToDelete?.name}</strong>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 active:scale-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                                    >
                                        {deleteLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Deleting...
                                            </span>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsDeleteModalOpen(false);
                                            setServiceToDelete(null);
                                        }}
                                        disabled={deleteLoading}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 active:scale-95 transition-colors disabled:opacity-50 min-h-[44px]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
