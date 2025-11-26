'use client';

import { useRouter } from 'next/navigation';
import { MdContentCut, MdAdminPanelSettings } from 'react-icons/md';
import Image from 'next/image';

export default function Home() {
    const router = useRouter();

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
            <div className="absolute -top-[20%] -right-[20%] w-[800px] h-[800px] bg-tertiary-50 rounded-full opacity-10 blur-[100px] animate-float z-10" />
            <div className="absolute -bottom-[20%] -left-[20%] w-[700px] h-[700px] bg-tertiary-50 rounded-full opacity-10 blur-[100px] animate-float-reverse z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tertiary-50 rounded-full opacity-[0.05] blur-[120px] animate-pulse-slow z-10" />

            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center relative z-20 px-3 sm:px-4 py-8 sm:py-12 md:py-20">
                <div className="max-w-2xl w-full text-center">
                    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
                    {/* App Name */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.15em] leading-tight">
                            <span className="bg-gradient-to-r from-white via-tertiary-50 to-white bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_0_30px_rgba(255,255,255,0.5)] animate-gradient-shift">
                                N STYLES
                            </span>
                        </h1>
                        <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium px-2">
                            Professional Barber Management System
                        </p>
                    </div>

                    {/* Login Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-[600px] mx-auto">
                        {/* Barber Login Card */}
                        <div
                            className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/30 transition-all duration-400 active:scale-95 sm:hover:-translate-y-2 sm:hover:shadow-3xl cursor-pointer min-h-[44px]"
                            onClick={() => router.push('/barber-login')}
                        >
                            <div className="flex flex-col gap-3 sm:gap-4 items-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-primary-900 rounded-2xl flex items-center justify-center shadow-lg text-white">
                                    <MdContentCut size={40} className="sm:w-12 sm:h-12" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
                                    Barber Login
                                </h2>
                                <p className="text-gray-600 text-xs sm:text-sm text-center">
                                    Access your barber dashboard
                                </p>
                            </div>
                        </div>

                        {/* Admin Login Card */}
                        <div
                            className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/30 transition-all duration-400 active:scale-95 sm:hover:-translate-y-2 sm:hover:shadow-3xl cursor-pointer min-h-[44px]"
                            onClick={() => router.push('/admin-login')}
                        >
                            <div className="flex flex-col gap-3 sm:gap-4 items-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-primary-900 rounded-2xl flex items-center justify-center shadow-lg text-white">
                                    <MdAdminPanelSettings size={40} className="sm:w-12 sm:h-12" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
                                    Admin Login
                                </h2>
                                <p className="text-gray-600 text-xs sm:text-sm text-center">
                                    Access the admin dashboard
                                </p>
                            </div>
                        </div>
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
                @keyframes pulse-slow {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.2); }
                }
                @keyframes gradient-shift {
                    0%, 100% { 
                        background-position: 0% 50%;
                        filter: brightness(1);
                    }
                    50% { 
                        background-position: 100% 50%;
                        filter: brightness(1.2);
                    }
                }
                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
                .animate-float-reverse {
                    animation: float-reverse 25s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                .animate-gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
