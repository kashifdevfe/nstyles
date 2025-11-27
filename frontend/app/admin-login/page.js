'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import api from '../../lib/apiClient';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useState } from 'react';
import Image from 'next/image';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export default function AdminLogin() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setError('');
            setLoading(true);
            const data = await api.login(values.email, values.password);
            await new Promise(resolve => setTimeout(resolve, 500)); // Show loader

            if (data.user.role !== 'admin') {
                setError('Only admins can access this panel');
                return;
            }

            dispatch(setCredentials(data));
            router.push('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image - Full Cover */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/barber-tools.jpg"
                    alt="Professional Barber Tools"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-primary-900/70" />
            </div>

            {/* Animated Background Elements */}
            <div className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] bg-tertiary-50 rounded-full opacity-10 blur-[80px] animate-float z-10" />
            <div className="absolute -bottom-[20%] -left-[20%] w-[500px] h-[500px] bg-tertiary-50 rounded-full opacity-10 blur-[80px] animate-float-reverse z-10" />

            <div className="min-h-screen flex items-center justify-center relative z-20 px-3 sm:px-4 py-8 sm:py-12 md:py-20">
                <div className="max-w-md w-full">
                    <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30">
                    <div className="flex flex-col gap-6 sm:gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-primary-900 rounded-2xl flex items-center justify-center shadow-lg rotate-[-5deg] animate-float-icon text-white">
                                <MdAdminPanelSettings size={40} className="sm:w-12 sm:h-12" />
                            </div>
                            <h1 className="text-lg sm:text-xl font-bold text-primary-900 mb-2">
                                Admin Login
                            </h1>
                            <p className="text-gray-600 text-xs sm:text-sm mt-2">
                                Access the admin dashboard
                            </p>
                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-tertiary-50 rounded-xl border border-purple-200 shadow-sm">
                                <p className="text-[10px] sm:text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">
                                    Demo Credentials
                                </p>
                                <div className="flex flex-col gap-1 items-start">
                                    <p className="text-xs sm:text-sm text-purple-600 font-mono break-all">
                                        📧 admin@barber.com
                                    </p>
                                    <p className="text-xs sm:text-sm text-purple-600 font-mono">
                                        🔒 admin123
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form>
                                    <div className="flex flex-col gap-4">
                                        <Field name="email">
                                            {({ field }) => (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    <input
                                                        {...field}
                                                        type="email"
                                                        placeholder="admin@barber.com"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent"
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
                                                        Password
                                                    </label>
                                                    <input
                                                        {...field}
                                                        type="password"
                                                        placeholder="Enter your password"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent"
                                                    />
                                                    {errors.password && touched.password && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                                    )}
                                                </div>
                                            )}
                                        </Field>

                                        {error && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-600 text-sm">{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading || isSubmitting}
                                            className="w-full bg-primary-900 text-white py-3 sm:py-3 rounded-xl font-semibold mt-2 hover:bg-primary-800 transition-all duration-300 active:scale-95 sm:hover:-translate-y-0.5 sm:hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                                        >
                                            {loading || isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Logging in...
                                                </span>
                                            ) : (
                                                'Login'
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => router.push('/')}
                                            className="w-full bg-transparent text-gray-600 py-2 sm:py-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px]"
                                        >
                                            Back to Home
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-50px, -50px) rotate(180deg); }
                }
                @keyframes float-reverse {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(50px, 50px) rotate(-180deg); }
                }
                @keyframes float-icon {
                    0%, 100% { transform: translateY(0px) rotate(-5deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }
                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }
                .animate-float-reverse {
                    animation: float-reverse 20s ease-in-out infinite;
                }
                .animate-float-icon {
                    animation: float-icon 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
