"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    UserOutlined,
    HomeOutlined,
    SolutionOutlined,
    LogoutOutlined,
    BulbOutlined,
    MoonOutlined,
} from '@ant-design/icons';

const Layout = ({ children }) => {
    const router = useRouter(); // Use Next.js router for navigation
    const pathname = usePathname(); // Get current pathname
    const [isDarkMode, setIsDarkMode] = useState(false); // State for theme

    // Function to check for token and handle redirection if token is not present
    useEffect(() => {
        const token = Cookies.get('token'); // Get token from cookies
        if (!token) {
            router.push('/auth/sign-in'); // Redirect to sign-in page if no token found
        }

        // Check localStorage for the user's theme preference
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDarkMode(true);
        }
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('token'); // Remove token from cookies
        router.push('/auth/sign-in'); // Redirect to login page
    };

    // Function to toggle between light and dark mode
    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Persist theme in localStorage
            return newMode;
        });
    };

    // Function to get link classes based on active route
    const getLinkClasses = (path) => {
        return pathname === path
            ? 'flex items-center gap-x-2 p-2 bg-yellow-500 text-black rounded-sm transition duration-200'
            : 'flex items-center gap-x-2 p-2 text-white rounded-sm transition duration-200';
    };

    return (
        <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'}`}>
            {/* Top Navigation Bar */}
            <header className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-slate-900 text-white'} shadow-md border-b border-gray-200`}>
                <div className="flex items-center">
                    <div className="text-xl font-bold">Radiographer Portal</div>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/radiographer" className={getLinkClasses('/radiographer')}>
                        <HomeOutlined style={{ fontSize: '24px' }} />
                        <span className="hidden md:block">Dashboard</span>
                    </Link>
                    <Link href="/radiographer/patients" className={getLinkClasses('/radiographer/patients')}>
                        <SolutionOutlined style={{ fontSize: '24px' }} />
                        <span className="hidden md:block">Patients</span>
                    </Link>
                    {/* <Link href="/profile" className='flex items-center gap-x-2 p-2 bg-gray-50 hover:bg-gray-200 rounded-md transition duration-200'>
                        <UserOutlined style={{ fontSize: '24px' }} />
                        <span className="hidden md:block">Profile</span>
                    </Link> */}
                    <button onClick={handleLogout} className="text-gray-600 hover:text-blue-500 text-lg focus:outline-none">
                        <LogoutOutlined style={{ fontSize: '24px' }} />
                    </button>
                    {/* <button onClick={toggleTheme} className="text-gray-600 hover:text-blue-500 text-lg focus:outline-none">
                        {isDarkMode ? <BulbOutlined style={{ fontSize: '24px' }} /> : <MoonOutlined style={{ fontSize: '24px' }} />}
                    </button> */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-6">
                <div className="container mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
