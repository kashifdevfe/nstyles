'use client';

import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import AdminLayout from '../../../components/AdminLayout';
import { api } from '../../../lib/apiClient';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters'),
    phone: Yup.string(),
    role: Yup.string().required('Role is required'),
});

export default function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await api.getUsers();
            setUsers(data || []);
        } catch (err) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');
            const userData = {
                ...values,
                status: values.status || 'active',
                canEditEntries: values.role === 'barber' ? (values.canEditEntries || false) : undefined,
                canDeleteEntries: values.role === 'barber' ? (values.canDeleteEntries || false) : undefined,
            };
            
            // Remove undefined fields
            Object.keys(userData).forEach(key => {
                if (userData[key] === undefined) {
                    delete userData[key];
                }
            });

            if (editingUser) {
                if (!values.password) {
                    delete userData.password;
                }
                await api.updateUser(editingUser.id, userData);
                await new Promise(resolve => setTimeout(resolve, 500));
                setSuccess('User Updated');
            } else {
                await api.createUser(userData);
                await new Promise(resolve => setTimeout(resolve, 500));
                setSuccess('User Created');
            }
            await fetchUsers();
            setIsModalOpen(false);
            setEditingUser(null);
            resetForm();
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');
            await api.deleteUser(userToDelete.id);
            await new Promise(resolve => setTimeout(resolve, 500));
            setSuccess('User Deleted');
            await fetchUsers();
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err) {
            setError(err.message || 'Failed to delete user. Please try again.');
            setIsDeleteModalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout currentPage="users">
                <div className="h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout currentPage="users">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-primary-900">Users</h1>
                            <p className="text-gray-600">Manage all system users</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingUser(null);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-xl hover:bg-primary-800 transition-colors"
                        >
                            <MdAdd size={20} />
                            Add User
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
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Permissions</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${
                                                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.role === 'barber' ? (
                                                    <div className="flex flex-col gap-1">
                                                        {user.canEditEntries && (
                                                            <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800">
                                                                Can Edit
                                                            </span>
                                                        )}
                                                        {user.canDeleteEntries && (
                                                            <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-800">
                                                                Can Delete
                                                            </span>
                                                        )}
                                                        {!user.canEditEntries && !user.canDeleteEntries && (
                                                            <span className="text-xs text-gray-400">No permissions</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(user);
                                                            setIsModalOpen(true);
                                                        }}
                                                        disabled={isSubmitting}
                                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                    >
                                                        <MdEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(user)}
                                                        disabled={isSubmitting}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                    >
                                                        {isSubmitting ? (
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
                                        setEditingUser(null);
                                    }}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                                <h2 className="text-2xl font-bold mb-6 text-primary-900">
                                    {editingUser ? 'Edit User' : 'Add User'}
                                </h2>
                                <Formik
                                    initialValues={{
                                        name: editingUser?.name || '',
                                        email: editingUser?.email || '',
                                        password: '',
                                        phone: editingUser?.phone || '',
                                        role: editingUser?.role || 'barber',
                                        status: editingUser?.status || 'active',
                                        canEditEntries: editingUser?.canEditEntries || false,
                                        canDeleteEntries: editingUser?.canDeleteEntries || false,
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched, values }) => (
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
                                                                placeholder="John Smith"
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
                                                                placeholder="user@barber.com"
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
                                                                Password {editingUser && '(leave blank to keep current)'}
                                                            </label>
                                                            <input
                                                                {...field}
                                                                type="password"
                                                                placeholder="••••••"
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
                                                                placeholder="+44 1234 567890"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name="role">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Role
                                                            </label>
                                                            <select
                                                                {...field}
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            >
                                                                <option value="barber">Barber</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                            {errors.role && touched.role && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name="status">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Status
                                                            </label>
                                                            <select
                                                                {...field}
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </Field>
                                                {values.role === 'barber' && (
                                                    <div className="space-y-3 pt-2 border-t border-gray-200">
                                                        <p className="text-sm font-semibold text-gray-700">Entry Permissions</p>
                                                        <Field name="canEditEntries">
                                                            {({ field }) => (
                                                                <label className="flex items-center gap-3 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        {...field}
                                                                        checked={field.value}
                                                                        className="w-5 h-5 text-primary-900 border-gray-300 rounded focus:ring-primary-900"
                                                                    />
                                                                    <span className="text-sm text-gray-700">Allow editing entries</span>
                                                                </label>
                                                            )}
                                                        </Field>
                                                        <Field name="canDeleteEntries">
                                                            {({ field }) => (
                                                                <label className="flex items-center gap-3 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        {...field}
                                                                        checked={field.value}
                                                                        className="w-5 h-5 text-primary-900 border-gray-300 rounded focus:ring-primary-900"
                                                                    />
                                                                    <span className="text-sm text-gray-700">Allow deleting entries</span>
                                                                </label>
                                                            )}
                                                        </Field>
                                                    </div>
                                                )}
                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="flex-1 bg-primary-900 text-white py-3 rounded-xl font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                {editingUser ? 'Updating...' : 'Creating...'}
                                                            </span>
                                                        ) : (
                                                            editingUser ? 'Update' : 'Create'
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsModalOpen(false);
                                                            setEditingUser(null);
                                                        }}
                                                        disabled={isSubmitting}
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
                                    Delete User
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 active:scale-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                                    >
                                        {isSubmitting ? (
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
                                            setUserToDelete(null);
                                        }}
                                        disabled={isSubmitting}
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
