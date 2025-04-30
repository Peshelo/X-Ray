"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="px-6 py-4 md:px-12 lg:px-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-indigo-900">XRayCloud</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-indigo-900 hover:text-indigo-700 font-medium">
              Features
            </Link>
            <Link href="/" className="text-indigo-900 hover:text-indigo-700 font-medium">
              Solutions
            </Link>
            <Link href="/" className="text-indigo-900 hover:text-indigo-700 font-medium">
              Pricing
            </Link>
            <Link href="/" className="text-indigo-900 hover:text-indigo-700 font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth/sign-in"
              className="text-indigo-900 hover:text-indigo-700 font-medium hidden md:block"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register-hospital"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
            >
              Register Hospital
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-indigo-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 leading-tight mb-6">
              Modern X-Ray Management <span className="text-indigo-600">Simplified</span>
            </h1>
            <p className="text-lg text-indigo-800 mb-8">
              Secure, cloud-based solution for hospitals to manage, store, and analyze X-ray images with
              cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/auth/sign-in"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium text-center transition duration-300"
              >
                Sign In to Dashboard
              </Link>
              <Link
                href="/auth/sign-in"
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium text-center transition duration-300"
              >
                Register Your Hospital
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-12 -right-8 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <Image
                  src="/assets/images/bg.jpg" // Replace with your actual image
                  alt="X-Ray Management"
                  width={600}
                  height={500}
                  className="rounded-lg shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
                title: "Secure Storage",
                description: "Military-grade encryption for all your medical images and patient data.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "AI Analysis",
                description: "Advanced algorithms to help detect abnormalities in X-ray images.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                ),
                title: "Seamless Sharing",
                description: "Easily share images with specialists and patients with controlled access.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-indigo-50 p-6 rounded-xl hover:shadow-md transition duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">{feature.title}</h3>
                <p className="text-indigo-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your X-Ray Management?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of hospitals already benefiting from our secure, efficient platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/auth/register-hospital"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Get Started Today
            </Link>
            <Link
              href="/auth/sign-in"
              className="border-2 border-white text-white hover:bg-indigo-700 px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Existing User? Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-white rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">XRayCloud</span>
              </div>
              <p className="text-indigo-200">
                The leading platform for secure medical image management and analysis.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-indigo-200 hover:text-white">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-indigo-800 mt-8 pt-8 text-center text-indigo-300">
            <p>© {new Date().getFullYear()} XRayCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}