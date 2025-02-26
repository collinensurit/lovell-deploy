import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <main className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Lovell File Components</h1>
        
        <p className="text-lg mb-8 text-center text-gray-700">
          A collection of modern, reusable file handling components and utilities for Next.js applications
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-2">File Upload Components</h2>
            <p className="text-gray-600 mb-4">
              Modern drag-and-drop file upload components with validation and progress indicators
            </p>
            <Link href="/examples/file-utils">
              <a className="text-blue-500 hover:text-blue-700 font-medium">
                View Demo →
              </a>
            </Link>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-2">File Preview Components</h2>
            <p className="text-gray-600 mb-4">
              Advanced file preview components with support for various file types
            </p>
            <Link href="/examples/file-utils">
              <a className="text-blue-500 hover:text-blue-700 font-medium">
                View Demo →
              </a>
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Getting Started</h2>
          <p className="mb-4">
            Explore our demos to see how to implement file handling in your application.
          </p>
          <Link href="/examples/file-utils">
            <a className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
              View All Examples
            </a>
          </Link>
        </div>
      </main>
      
      <footer className="mt-8 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Lovell File Components</p>
      </footer>
    </div>
  );
}
