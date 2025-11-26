'use client';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useEffect, useState } from 'react';
import { MdContentCut, MdList, MdAdd, MdKeyboardArrowDown, MdMenu, MdClose } from 'react-icons/md';

const NavItem = ({ icon, children, href, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full px-3 sm:px-4 py-3 rounded-xl text-left transition-all duration-300 relative ${
                isActive 
                    ? 'bg-black/10 text-primary-900 font-semibold' 
                    : 'text-secondary-600 font-medium hover:bg-gray-50 hover:translate-x-1'
            }`}
        >
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-primary-900 rounded-r" />
            )}
            <div className="flex items-center gap-2 sm:gap-3">
                <div className={`text-lg sm:text-xl transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
                    {icon}
                </div>
                <span className="text-xs sm:text-sm tracking-wide">{children}</span>
            </div>
        </button>
    );
};

export default function BarberLayout({ children, currentPage }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'barber')) {
            router.push('/barber-login');
        }
    }, [isAuthenticated, user, router, isLoading]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-tertiary-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'barber') {
        return null;
    }

    return (
        <div className="h-screen bg-tertiary-50 relative overflow-hidden flex flex-col">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-30">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Toggle menu"
                    >
                        {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                    </button>
                    <p className="text-lg font-bold text-primary-900">Barber Panel</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute -top-1/2 -right-1/5 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-secondary-500 rounded-full opacity-10 blur-[80px] animate-float" />
            <div className="absolute -bottom-[30%] -left-[10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-secondary-500 rounded-full opacity-10 blur-[80px] animate-float-reverse" />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Mobile Overlay / Desktop Fixed */}
                <div className={`
                    fixed lg:static inset-y-0 left-0 z-40 lg:z-10
                    w-[280px] bg-white/95 lg:bg-white/80 backdrop-blur-xl border-r border-gray-200 p-4 sm:p-6
                    shadow-2xl lg:shadow-none
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="flex flex-col h-full">
                        {/* Logo - Hidden on mobile (shown in header) */}
                        <div className="hidden lg:block text-center mb-4">
                            <div className="w-[60px] h-[60px] mx-auto mb-3 bg-primary-900 rounded-xl flex items-center justify-center shadow-lg rotate-[-5deg] transition-transform hover:rotate-0 hover:scale-105 text-white">
                                <MdContentCut size={32} />
                            </div>
                            <p className="text-xl font-bold text-primary-900 tracking-wide">
                                Barber Panel
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 bg-primary-900 text-white text-xs font-semibold rounded-full">
                                Professional
                            </span>
                        </div>

                        <div className="border-t border-gray-200 my-4 sm:my-6" />

                        {/* Navigation */}
                        <div className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto">
                            <NavItem
                                icon={<MdList size={20} />}
                                href="/barber/dashboard"
                                isActive={currentPage === 'dashboard'}
                                onClick={() => {
                                    router.push('/barber/dashboard');
                                    setIsSidebarOpen(false);
                                }}
                            >
                                My Entries
                            </NavItem>
                            <NavItem
                                icon={<MdAdd size={20} />}
                                href="/barber/add-entry"
                                isActive={currentPage === 'add-entry'}
                                onClick={() => {
                                    router.push('/barber/add-entry');
                                    setIsSidebarOpen(false);
                                }}
                            >
                                Add Entry
                            </NavItem>
                        </div>

                        {/* User Menu */}
                        <div className="mt-auto p-3 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="w-full flex items-center gap-2 sm:gap-3 hover:bg-transparent p-2 rounded-lg transition-colors min-h-[44px]"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-xs sm:text-sm font-semibold truncate">{user?.name}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    <MdKeyboardArrowDown className={`transition-transform flex-shrink-0 ${isMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors min-h-[44px]"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto relative z-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {children}
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-30px, -30px) rotate(180deg); }
                }
                @keyframes float-reverse {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(30px, 30px) rotate(-180deg); }
                }
                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
                .animate-float-reverse {
                    animation: float-reverse 15s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
