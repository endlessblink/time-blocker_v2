import React from 'react';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Build faster with</span>
                <span className="block text-indigo-600">Modern Stack</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Start your next project with our modern tech stack. Built with TypeScript, React, and Tailwind CSS for the perfect development experience.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                    Live demo
                  </button>
                </div>
              </div>
            </div>
          </main>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-3">
            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                  <Zap className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  Lightning Fast
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Optimized for speed and performance
                </p>
              </div>
            </div>

            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                  <Shield className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  Secure by Default
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Built with security best practices
                </p>
              </div>
            </div>

            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                  <Globe className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  Global Scale
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Ready for worldwide deployment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};