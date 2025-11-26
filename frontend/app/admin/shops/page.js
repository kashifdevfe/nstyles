'use client';

import { MdAdd, MdEdit, MdDelete, MdStore, MdPhone, MdLocationOn } from 'react-icons/md';
import AdminLayout from '../../../components/AdminLayout';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GET_SHOPS = gql`
  query GetShops {
    shops {
      id
      name
      address
      phone
      image
      barbers {
        id
        name
      }
      stats {
        totalRevenue
        totalEntries
        barberCount
      }
    }
  }
`;

const CREATE_SHOP = gql`
  mutation CreateShop($name: String!, $address: String!, $phone: String, $image: String) {
    createShop(name: $name, address: $address, phone: $phone, image: $image) {
      id
      name
    }
  }
`;

const UPDATE_SHOP = gql`
  mutation UpdateShop($id: ID!, $name: String, $address: String, $phone: String, $image: String) {
    updateShop(id: $id, name: $name, address: $address, phone: $phone, image: $image) {
      id
      name
    }
  }
`;

const DELETE_SHOP = gql`
  mutation DeleteShop($id: ID!) {
    deleteShop(id: $id)
  }
`;

const ShopSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    phone: Yup.string(),
    image: Yup.string().url('Must be a valid URL'),
});

export default function ShopsPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [shopToDelete, setShopToDelete] = useState(null);
    const [editingShop, setEditingShop] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { data, loading, refetch } = useQuery(GET_SHOPS);
    const [createShop, { loading: createLoading }] = useMutation(CREATE_SHOP);
    const [updateShop, { loading: updateLoading }] = useMutation(UPDATE_SHOP);
    const [deleteShop, { loading: deleteLoading }] = useMutation(DELETE_SHOP);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setError('');
            setSuccess('');
            if (editingShop) {
                await updateShop({
                    variables: { id: editingShop.id, ...values },
                });
                await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
                setSuccess('Shop updated');
            } else {
                await createShop({
                    variables: values,
                });
                await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
                setSuccess('Shop created');
            }
            await refetch();
            setIsModalOpen(false);
            resetForm();
            setEditingShop(null);
        } catch (err) {
            setError(err.message || 'Error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (shop) => {
        setShopToDelete(shop);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!shopToDelete) return;
        try {
            setError('');
            await deleteShop({ variables: { id: shopToDelete.id } });
            await new Promise(resolve => setTimeout(resolve, 500)); // Show loader
            setSuccess('Shop deleted');
            await refetch();
            setIsDeleteModalOpen(false);
            setShopToDelete(null);
        } catch (err) {
            setError(err.message || 'Error');
        }
    };

    const isMutationLoading = createLoading || updateLoading || deleteLoading;

    if (loading) {
        return (
            <AdminLayout currentPage="shops">
                <div className="h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout currentPage="shops">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="flex flex-col gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary-900">Shops Management</h1>
                            <p className="text-gray-600 text-sm sm:text-base">Manage your barber shop locations</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingShop(null);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 bg-primary-900 text-white px-4 py-2 sm:py-2 rounded-xl hover:bg-primary-800 active:scale-95 transition-colors min-h-[44px] w-full sm:w-auto"
                        >
                            <MdAdd size={20} />
                            <span className="text-sm sm:text-base">Add Shop</span>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {data?.shops.map((shop) => (
                            <div
                                key={shop.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden border border-secondary-500 transition-all active:scale-95 sm:hover:-translate-y-1 sm:hover:shadow-2xl cursor-pointer"
                                onClick={() => router.push(`/admin/shops/${shop.id}`)}
                            >
                                <div className="h-[120px] sm:h-[150px] bg-gray-100 relative">
                                    {shop.image ? (
                                        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="h-full bg-primary-900 text-white flex items-center justify-center">
                                            <MdStore size={48} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-primary-900">{shop.name}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingShop(shop);
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
                                                    handleDeleteClick(shop);
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
                                    </div>
                                    <div className="flex flex-col gap-1 text-secondary-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MdLocationOn size={16} />
                                            <span className="text-sm">{shop.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MdPhone size={16} />
                                            <span className="text-sm">{shop.phone || 'No phone'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Barbers</p>
                                            <p className="text-lg font-semibold text-primary-900">{shop.barbers?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 relative my-4 max-h-[90vh] overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingShop(null);
                                    }}
                                    className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary-900 pr-8">
                                    {editingShop ? 'Edit Shop' : 'Add New Shop'}
                                </h2>
                                <Formik
                                    initialValues={{
                                        name: editingShop?.name || '',
                                        address: editingShop?.address || '',
                                        phone: editingShop?.phone || '',
                                        image: editingShop?.image || '',
                                    }}
                                    validationSchema={ShopSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <Form>
                                            <div className="flex flex-col gap-4">
                                                <Field name="name">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Shop Name
                                                            </label>
                                                            <input
                                                                {...field}
                                                                placeholder="e.g. Downtown Barber"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                            {errors.name && touched.name && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field name="address">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Address
                                                            </label>
                                                            <input
                                                                {...field}
                                                                placeholder="123 Main St"
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                            {errors.address && touched.address && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
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
                                                <Field name="image">
                                                    {({ field }) => (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Image URL (Optional)
                                                            </label>
                                                            <input
                                                                {...field}
                                                                placeholder="https://..."
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                                            />
                                                            {errors.image && touched.image && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                                                            )}
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
                                                            {editingShop ? 'Updating...' : 'Creating...'}
                                                        </span>
                                                    ) : (
                                                        editingShop ? 'Update Shop' : 'Create Shop'
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
                                    Delete Shop
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete <strong>{shopToDelete?.name}</strong>? This action cannot be undone.
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
                                            setShopToDelete(null);
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
