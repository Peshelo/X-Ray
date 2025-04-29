"use client";
import React, { useState } from "react";

export default function FingerprintPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setUserData(null) // Reset user data on new submission
    setError(''); // Reset error message
    if (!selectedFile) {
      setError('Please select a fingerprint image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://4.222.233.23:8080/patient/get-by-fingerprint', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Fingerprint Identification
        </h1>

        <div className="flex flex-col items-center gap-4">
          <input 
            type="file"
         
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search by Fingerprint'}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {userData && (
          <div className="mt-8 border-t pt-6">
            <div className="flex flex-col items-center">
              <img 
                src={`https://4.222.233.23:8080/${userData.profileUrl}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
              />
              <h2 className="mt-4 text-xl font-bold text-gray-700">
                {userData.firstname} {userData.lastname}
              </h2>
              <p className="text-gray-500">@{userData.username}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-semibold">Email:</p>
                <p>{userData.email}</p>
              </div>
              <div>
                <p className="font-semibold">Mobile:</p>
                <p>{userData.mobileNumber}</p>
              </div>
              <div>
                <p className="font-semibold">National ID:</p>
                <p>{userData.nationalId}</p>
              </div>
              <div>
                <p className="font-semibold">Date of Birth:</p>
                <p>{userData.dateOfBirth}</p>
              </div>
              <div>
                <p className="font-semibold">Gender:</p>
                <p>{userData.gender}</p>
              </div>
              <div>
                <p className="font-semibold">Address:</p>
                <p>{userData.address}</p>
              </div>
              <div>
                <p className="font-semibold">Language:</p>
                <p>{userData.language}</p>
              </div>
              <div>
                <p className="font-semibold">Account Locked:</p>
                <p>{userData.accountLocked ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
