"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    MenuOutlined,
    UserOutlined,
    HomeOutlined,
    SolutionOutlined,
    MedicineBoxOutlined,
    TeamOutlined,
    FileTextOutlined,
    SettingOutlined,
    MoonOutlined,
    SunOutlined,
} from '@ant-design/icons';

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
    const pathname = usePathname();
    const router = useRouter(); // Use Next.js router for navigation
    const currentPath = pathname.split('/')[2] || ''; // Get the current path to highlight active link

    // Function to check for token and handle redirection if token is not present
    useEffect(() => {
        const token = Cookies.get('token'); // Get token from cookies
        if (!token) {
            router.push('/auth/sign-in'); // Redirect to sign-in page if no token found
        }
    }, [router]);

    // Handle logout
    const handleLogout = () => {
        Cookies.remove('token'); // Remove token from cookies
        router.push('/auth/sign-in'); // Redirect to login page
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
        // Save the preference in local storage
        localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    };

    const getLinkClasses = (path) => {
        return currentPath === path
            ? "flex items-center gap-2 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700"
            : "flex items-center gap-2 p-3 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300 text-gray-100 hover:text-black transition-colors duration-200";
    };

    const items = [
        { label: 'Dashboard', path: '', icon: <HomeOutlined /> },
        { label: 'Patients', path: 'patients', icon: <SolutionOutlined /> },
        { label: 'Radiographers', path: 'radiographers', icon: <TeamOutlined /> },
        { label: 'Physicians', path: 'physician', icon: <MedicineBoxOutlined /> },
        // { label: 'X-Ray Reports', path: 'records', icon: <FileTextOutlined /> },
        { label: 'Settings', path: 'settings', icon: <SettingOutlined /> },
    ];

    return (
        <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-900'}`}>
            <header className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-slate-900'} shadow-md border-gray-200`}>
              
                <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-white'}`}>Admin Dashboard</div>
                <button
                    onClick={toggleDarkMode}
                    className="text-gray-600 hover:text-black focus:outline-none"
                >
                    {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                </button>
            </header>
            <div className="flex flex-1">
                <nav
                    className={`flex flex-col ${collapsed ? 'w-20' : 'w-60'} transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-slate-900 text-white'} shadow-lg border-r overflow-y-auto`}
                    style={{
                        minHeight: '100vh',
                    }}
                >
                
                    <ul className="space-y-1 flex-1">
                        {items.map(({ label, path, icon }) => (
                            <li key={path}>
                                <Link href={`/hospital/${path}`}>
                                    <label className={getLinkClasses(path)}>
                                        {icon}
                                        {!collapsed && <span>{label}</span>}
                                    </label>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                className="text-sm absolute bottom-0 left-4 w-fit text-gray-300 bg-gray-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200 mt-auto mb-4"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        {/* <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-600 hover:text-black focus:outline-none"
                >
                    <MenuOutlined style={{ fontSize: '24px' }} />
                </button> */}
                        </li>
                   
                    </ul>
                </nav>
                <main className={`flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} shadow-md`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
