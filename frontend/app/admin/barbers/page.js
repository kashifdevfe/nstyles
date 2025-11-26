'use client';

import { MdAdd, MdEdit, MdDelete, MdPerson, MdEmail, MdPhone, MdStore } from 'react-icons/md';
import AdminLayout from '../../../components/AdminLayout';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GET_BARBERS_AND_SHOPS = gql`
  query GetBarbersAndShops {
    users {
      id
      name
      email
      phone
      role
      status
      shop {
        id
        name
      }
    }
    shops {
      id
      name
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!, $phone: String, $role: String!, $shopId: ID) {
    createUser(name: $name, email: $email, password: $password, phone: $phone, role: $role, shopId: $shopId) {
      id
      name
      email
      role
      shop {
        id
        name
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $password: String, $phone: String, $role: String, $status: String, $shopId: ID) {
    updateUser(id: $id, name: $name, email: $email, password: $password, phone: $phone, role: $role, status: $status, shopId: $shopId) {
      id
      name
      email
      role
      status
      shop {
        id
        name
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const BarberSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!'),
    phone: Yup.string(),
    shopId: Yup.string().nullable(),
});

export default function BarbersPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [barberToDelete, setBarberToDelete] = useState(null);
    const [editingBarber, setEditingBarber] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { data, loading, error: queryError, refetch } = useQuery(GET_BARBERS_AND_SHOPS);
    const [createUser, { loading: createLoading }] = useMutation(CREATE_USER);
    const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);
    const [deleteUser, { loading: deleteLoading }] = useMutation(DELETE_USER);

    const barbers = data?.users.filter(user => user.role === 'barber') || [];
    const shops = data?.shops || [];

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setError('');
            setSuccess('');
            if (editingBarber) {
                const variables = {
                    id: editingBarber.id,
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    role: 'barber',
                    shopId: values.shopId || null,
                };
                if (values.password) {
                    variables.password = values.password;
                }
                await updateUser({ variables });
                await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
                setSuccess('Barber updated');
            } else {
                await createUser({
                    variables: {
                        ...values,
                        role: 'barber',
                        shopId: values.shopId || null,
                    },
                });
                await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
                setSuccess('Barber created');
            }
            await refetch();
            setIsModalOpen(false);
            resetForm();
            setEditingBarber(null);
        } catch (err) {
            // Extract error message from GraphQL error
            const errorMessage = err?.graphQLErrors?.[0]?.message || 
                                err?.networkError?.result?.errors?.[0]?.message ||
                                err?.message || 
                                'An error occurred. Please try again.';
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (barber) => {
        setBarberToDelete(barber);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!barberToDelete) return;
        try {
            setError('');
            await deleteUser({ variables: { id: barberToDelete.id } });
            await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
            setSuccess('Barber deleted');
            await refetch();
            setIsDeleteModalOpen(false);
            setBarberToDelete(null);
        } catch (err) {
            setError(err.message || 'Error');
        }
    };

    const handleStatusToggle = async (barber) => {
        try {
            setError('');
            setSuccess('');
            await updateUser({
                variables: {
                    id: barber.id,
                    status: barber.status === 'active' ? 'inactive' : 'active'
                }
            });
            await new Promise(resolve => setTimeout(resolve, 300)); // Show loader
            setSuccess('Status updated');
            await refetch();
        } catch (err) {
            setError(err.message || 'Error');
        }
    };

    const isMutationLoading = createLoading || updateLoading || deleteLoading;

    const handleBarberClick = (barber, e) => {
        if (e.target.closest('button') || e.target.closest('[role="button"]')) {
            return;
        }
        router.push(`/admin/barbers/${barber.id}`);
    };

    if (loading) {
        return (
            <AdminLayout currentPage="barbers">
                <div className="h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout currentPage="barbers">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="flex flex-col gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary-900">Barbers Management</h1>
                            <p className="text-gray-600 text-sm sm:text-base">Manage your barber team</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingBarber(null);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 bg-primary-900 text-white px-4 py-2 sm:py-2 rounded-xl hover:bg-primary-800 active:scale-95 transition-colors min-h-[44px] w-full sm:w-auto"
                        >
                            <MdAdd size={20} />
                            <span className="text-sm sm:text-base">Add Barber</span>
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

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-secondary-500">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary-500">
                                    <tr>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-white">Name</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-white">Contact</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-white">Shop</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-white">Status</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {barbers.map((barber) => (
                                        <tr
                                            key={barber.id}
                                            className="cursor-pointer hover:bg-secondary-500 hover:text-white transition-colors"
                                            onClick={(e) => handleBarberClick(barber, e)}
                                        >
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                                        {barber.name?.charAt(0)?.toUpperCase() || 'B'}
                                                    </div>
                                                    <span className="font-medium text-primary-900 group-hover:text-white truncate">{barber.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-xs sm:text-sm text-primary-900 truncate">{barber.email}</span>
                                                    <span className="text-[10px] sm:text-xs text-secondary-500">{barber.phone || 'No phone'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                {barber.shop ? (
                                                    <span className="inline-block bg-primary-900 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                                        {barber.shop.name}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block bg-secondary-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={barber.status === 'active'}
                                                        onChange={() => handleStatusToggle(barber)}
                                                        disabled={updateLoading}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
                                                </label>
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingBarber(barber);
                                                            setIsModalOpen(true);
                                                        }}
                                                        disabled={isMutationLoading}
                                                        className="p-2 bg-primary-900 text-white rounded-lg hover:bg-secondary-500 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                    >
                                                        <MdEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(barber);
                                                        }}
                                                        disabled={deleteLoading}
                                                        className="p-2 bg-primary-900 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
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

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {barbers.map((barber) => (
                                <div
                                    key={barber.id}
                                    className="p-4 space-y-3 cursor-pointer active:bg-gray-50"
                                    onClick={(e) => handleBarberClick(barber, e)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-primary-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                                {barber.name?.charAt(0)?.toUpperCase() || 'B'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-primary-900 truncate">{barber.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{barber.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingBarber(barber);
                                                    setIsModalOpen(true);
                                                }}
                                                disabled={isMutationLoading}
                                                className="p-2 bg-primary-900 text-white rounded-lg hover:bg-secondary-500 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(barber);
                                                }}
                                                disabled={deleteLoading}
                                                className="p-2 bg-primary-900 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                            >
                                                {deleteLoading ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <MdDelete size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
                                            <p className="text-sm">{barber.phone || 'No phone'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Shop</p>
                                            {barber.shop ? (
                                                <span className="inline-block bg-primary-900 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                                    {barber.shop.name}
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-secondary-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                                    Unassigned
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <p className="text-xs text-gray-500 uppercase mb-2">Status</p>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={barber.status === 'active'}
                                                onChange={() => handleStatusToggle(barber)}
                                                disabled={updateLoading}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 relative my-4 max-h-[90vh] overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingBarber(null);
                                    }}
                                    className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary-900 pr-8">
                                    {editingBarber ? 'Edit Barber' : 'Add New Barber'}
                                </h2>
                                <Formik
                                    initialValues={{
                                        name: editingBarber?.name || '',
                                        email: editingBarber?.email || '',
                                        password: '',
                                        phone: editingBarber?.phone || '',
                                        shopId: editingBarber?.shop?.id || '',
                                    }}
                                    validationSchema={BarberSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <Form>
                                            <div className="flex flex-col gap-4">
                                                <Field name="name">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Name
                                                            </label>
                                                            <input
                                                                {...field}
                                                                placeholder="John Doe"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                            {errors.name && touched.name && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name="email">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Email
                                                            </label>
                                                            <input
                                                                {...field}
                                                                type="email"
                                                                placeholder="john@barber.com"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                            {errors.email && touched.email && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name="password">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Password {editingBarber && '(Leave blank to keep current)'}
                                                            </label>
                                                            <input
                                                                {...field}
                                                                type="password"
                                                                placeholder="******"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                            {errors.password && touched.password && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name="phone">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Phone
                                                            </label>
                                                            <input
                                                                {...field}
                                                                placeholder="+1 234 567 890"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name="shopId">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Assigned Shop
                                                            </label>
                                                            <select
                                                                {...field}
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            >
                                                                <option value="">Select shop</option>
                                                                {shops.map(shop => (
                                                                    <option key={shop.id} value={shop.id}>{shop.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </Field>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting || isMutationLoading}
                                                    className="w-full bg-primary-900 text-white py-3 rounded-xl font-semibold hover:bg-primary-800 active:scale-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 min-h-[44px]"
                                                >
                                                    {isSubmitting || isMutationLoading ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            {editingBarber ? 'Updating...' : 'Creating...'}
                                                        </span>
                                                    ) : (
                                                        editingBarber ? 'Update Barber' : 'Create Barber'
                                                    )}
                                                </button>
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
                                    Delete Barber
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete <strong>{barberToDelete?.name}</strong>? This action cannot be undone.
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
                                            setBarberToDelete(null);
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
