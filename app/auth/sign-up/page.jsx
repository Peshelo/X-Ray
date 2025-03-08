"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const Page = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    role: 'STUDENT', // role is fixed as student
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let errors = {};
    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number is invalid';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Make POST request to /admin endpoint
      const baseUrl = 'http://localhost:8080';
      fetch(baseUrl + '/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle success
          if (data.error) {
            console.error(data.error);
            return;
          }
          setIsSubmitted(true);
        })
        .catch((error) => {
          // Handle error
          console.error('Error:', error);
        });
      setIsSubmitted(true); // Simulate successful submission
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-10">
       <div className="logo p-4 text-center">
        <h1 className="text-2xl font-bold text-black">Academic</h1>
        <p className="text-xs text-gray-700">RESOURCE HUB</p>
      </div>
      <div className="w-[500px] h-fit bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign Up
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link
                className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                href="/auth/sign-in"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {isSubmitted ? (
            <div className="mt-5 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
              Credentials have been sent to your email.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4 mt-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm mb-2 dark:text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-2">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm mb-2 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  {errors.username && <p className="text-xs text-red-600 mt-2">{errors.username}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-2">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm mb-2 dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  {errors.phoneNumber && <p className="text-xs text-red-600 mt-2">{errors.phoneNumber}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
