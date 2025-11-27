'use client';

import BarberLayout from '../../../components/BarberLayout';
import api from '../../../lib/apiClient';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const validationSchema = Yup.object({
    date: Yup.string().required('Date is required'),
    time: Yup.string().required('Time is required'),
    serviceIds: Yup.array().min(1, 'Select at least one service').required('Services are required'),
    paymentMethod: Yup.string().required('Payment method is required'),
});

export default function AddEntryPage() {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const [selectedServices, setSelectedServices] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setServicesLoading(true);
                const data = await api.getServices();
                setServices(data || []);
            } catch (err) {
                setError('Failed to load services');
            } finally {
                setServicesLoading(false);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const total = selectedServices.reduce((sum, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            return sum + (service?.price || 0);
        }, 0);
        setTotalAmount(total);
    }, [selectedServices, services]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setError('');
            setSuccess('');
            setLoading(true);
            const data = await api.createEntry({
                barberId: user.id,
                serviceIds: values.serviceIds,
                date: values.date,
                time: values.time,
                paymentMethod: values.paymentMethod,
            });
            await new Promise(resolve => setTimeout(resolve, 500)); // Show loader

            setSuccess(`Entry Created! Client Number: ${data.clientNumber} | Total: £${data.totalAmount.toFixed(2)}`);
            resetForm();
            setSelectedServices([]);
            setTotalAmount(0);

            setTimeout(() => {
                router.push('/barber/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error creating entry');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    return (
        <BarberLayout currentPage="add-entry">
            <div className="max-w-3xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Header */}
                    <div className="mb-2">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-primary-900">
                            Add New Entry
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                            Create a new client entry with auto-generated client number
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
                        <Formik
                            initialValues={{
                                date: getTodayDate(),
                                time: getCurrentTime(),
                                serviceIds: [],
                                paymentMethod: 'Cash',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                                <Form>
                                    <div className="flex flex-col gap-6">
                                        {/* Client Number Info */}
                                        <div className="p-5 bg-gray-100 rounded-xl border-l-4 border-primary-900 shadow-sm">
                                            <p className="text-sm font-semibold text-primary-900">
                                                ℹ️ Client Number will be auto-generated (Format: C-0001, C-0002, etc.)
                                            </p>
                                        </div>

                                        {/* Date */}
                                        <Field name="date">
                                            {({ field }) => (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Date *
                                                    </label>
                                                    <input
                                                        {...field}
                                                        type="date"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent"
                                                    />
                                                    {errors.date && touched.date && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                                                    )}
                                                </div>
                                            )}
                                        </Field>

                                        {/* Time */}
                                        <Field name="time">
                                            {({ field }) => (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Time *
                                                    </label>
                                                    <input
                                                        {...field}
                                                        type="time"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent"
                                                    />
                                                    {errors.time && touched.time && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                                                    )}
                                                </div>
                                            )}
                                        </Field>

                                        <div className="border-t border-gray-200" />

                                        {/* Services Multi-Select */}
                                        <Field name="serviceIds">
                                            {({ field }) => (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                        Select Services * (Multiple Selection)
                                                    </label>
                                                    {servicesLoading ? (
                                                        <div className="py-8 flex justify-center">
                                                            <div className="w-8 h-8 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                            {services.map((service) => (
                                                                <label
                                                                    key={service.id}
                                                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                                        selectedServices.includes(service.id)
                                                                            ? 'border-primary-900 bg-gray-50'
                                                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={service.id}
                                                                            checked={selectedServices.includes(service.id)}
                                                                            onChange={(e) => {
                                                                                const newSelected = e.target.checked
                                                                                    ? [...selectedServices, service.id]
                                                                                    : selectedServices.filter(id => id !== service.id);
                                                                                setSelectedServices(newSelected);
                                                                                setFieldValue('serviceIds', newSelected);
                                                                            }}
                                                                            className="w-5 h-5 text-primary-900 border-gray-300 rounded focus:ring-primary-900"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <p className="font-semibold text-gray-900">{service.name}</p>
                                                                            <p className="text-lg text-green-600 font-bold">
                                                                                £{service.price.toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {errors.serviceIds && touched.serviceIds && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.serviceIds}</p>
                                                    )}
                                                </div>
                                            )}
                                        </Field>

                                        {/* Total Amount Display */}
                                        <div className="p-8 bg-gray-100 rounded-2xl border-2 border-primary-900 shadow-lg relative overflow-hidden">
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-primary-900" />
                                            <div className="flex justify-between items-center">
                                                <p className="text-xl font-semibold text-primary-900">
                                                    Total Amount:
                                                </p>
                                                <p className="text-4xl font-bold text-primary-900">
                                                    £{totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                            {selectedServices.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-sm text-gray-600 mb-2">Selected Services:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedServices.map((serviceId) => {
                                                            const service = services.find(s => s.id === serviceId);
                                                            return service ? (
                                                                <span
                                                                    key={serviceId}
                                                                    className="inline-block bg-primary-900 text-white text-sm font-semibold px-2 py-1 rounded-md"
                                                                >
                                                                    {service.name} - £{service.price.toFixed(2)}
                                                                </span>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-200" />

                                        {/* Payment Method */}
                                        <Field name="paymentMethod">
                                            {({ field }) => (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                        Payment Method *
                                                    </label>
                                                    <div className="flex flex-col gap-3">
                                                        {['Cash', 'Card', 'Apple Pay', 'Other'].map((method) => (
                                                            <label
                                                                key={method}
                                                                className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-900 transition-colors"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    {...field}
                                                                    value={method}
                                                                    checked={values.paymentMethod === method}
                                                                    onChange={(e) => setFieldValue('paymentMethod', e.target.value)}
                                                                    className="w-5 h-5 text-primary-900 border-gray-300 focus:ring-primary-900"
                                                                />
                                                                <span className="text-lg font-semibold">{method}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {errors.paymentMethod && touched.paymentMethod && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
                                                    )}
                                                </div>
                                            )}
                                        </Field>

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

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || loading}
                                            className="w-full bg-primary-900 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-primary-800 transition-all duration-300 active:scale-95 sm:hover:-translate-y-0.5 sm:hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                                        >
                                            {isSubmitting || loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Creating Entry...
                                                </span>
                                            ) : (
                                                'Create Entry'
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => router.push('/barber/dashboard')}
                                            className="w-full bg-transparent text-gray-600 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </BarberLayout>
    );
}
