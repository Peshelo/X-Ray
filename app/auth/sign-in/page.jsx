"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import jwtDecode from 'jwt-decode'; // Corrected import
import Link from 'next/link'; // Import Link for client-side navigation

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Renamed to router

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validateForm = () => {
    if (!email) {
      setError('Please include an email address.');
      return false;
    }
    // Simple email regex for basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    // if (password.length < 6) { // Increased minimum length
    //   setError('Password must be at least 6 characters long.');
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const response = await fetch('http://4.222.233.23/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password }), // Ensure backend expects 'email'
      });

      console.log('Response Status:', response.status);

      if (response.status === 200) {
        const data = await response.json();
        console.log('Role:', data.role[0]);

        // Store tokens securely. Note: Using HttpOnly cookies is more secure.
        document.cookie = `token=${data.token};max-age=86400;path=/;secure;SameSite=Strict`;
        document.cookie = `username=${encodeURIComponent(email)};max-age=86400;path=/;secure;SameSite=Strict`;
        const role = data.role[0];
        document.cookie = `userRole=${encodeURIComponent(role)};max-age=86400;path=/;secure;SameSite=Strict`;

        // Decode JWT if needed
        // const decodedToken = jwtDecode(data.token);
        // console.log('Decoded JWT:', decodedToken);

        if (role === "PATIENT") {
          router.push('/patient');
        } else if (role === "ADMIN") {
          router.push('/hospital');
        } else if (role === "RADIOGRAPHER") {
          router.push('/radiographer');
        } else if (role === "PHYSICIAN") {
          router.push('/physician');
        } else {
          alert("Account role not found");
          return;
        }
      } else if (response.status === 422) {
        router.push('/auth/set-password');
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-10">
      <div className="logo p-4 text-center">
        <h1 className="text-2xl font-bold text-black">X-RAY IMAGE</h1>
        <p className="text-xs text-gray-700 dark:text-gray-400">Management System</p>
      </div>
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
          </div>

          <div className="mt-5">
            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border border-gray-200 before:mr-6 after:flex-1 after:border-t after:border border-gray-200 after:ml-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
              Or
            </div>

            {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 dark:text-white text-black">Email address</label>
                  <div className="relative">
                    <input
                      type="email" // Changed to email type for better validation
                      id="email" // Corrected id
                      name="email" // Corrected name
                      value={email}
                      onChange={handleEmailChange}
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                    {/* <Link href="/recover-account" passHref className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500">
                        Forgot password?
                    </Link> */}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="password-error"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="shrink-0 mt-0.5 border border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="remember-me" className="text-sm dark:text-white">Remember me</label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Sign in
                </button>
                <label htmlFor="fingerprint" className="block text-center text-xs my-2 dark:text-neutral-400">Or sign in with</label>
                <button
          className="w-full py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
        >
          <img src='/fingerprint.png' alt='Fingerprint' className='w-5 h-5 object-contain' />
          Sign in with fingerprint
        </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
