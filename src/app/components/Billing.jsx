import React from 'react';

const Billing = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">EduPlatform</h1>
        </div>
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span className="w-5 h-5 mr-3">📊</span>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span className="w-5 h-5 mr-3">📚</span>
                Courses
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span className="w-5 h-5 mr-3">📝</span>
                Notes
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span className="w-5 h-5 mr-3">🎥</span>
                Videos
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span className="w-5 h-5 mr-3">👥</span>
                Students
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
                <span className="w-5 h-5 mr-3">💳</span>
                Billing
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span className="w-5 h-5 mr-3">⚙️</span>
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8">
          <nav className="text-sm text-gray-500 mb-2">
            Pages / Billing
          </nav>
          <h1 className="text-3xl font-bold text-gray-800">Billing</h1>
        </header>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Credit Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
              <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-white opacity-5 rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-sm opacity-70 mb-1">Card Name</p>
                    <p className="text-xl font-semibold">Platinum Card</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      <circle cx="12" cy="12" r="5"/>
                    </svg>
                  </div>
                </div>
                
                <p className="text-2xl tracking-wider mb-8 font-mono">
                  **** **** **** 7852
                </p>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs opacity-70 mb-1">Card Holder</p>
                    <p className="text-sm font-medium">Card Holder</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70 mb-1">Expires</p>
                    <p className="text-sm font-medium">12/28</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70 mb-1">Type</p>
                    <p className="text-sm font-medium">VISA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-6">
            {/* Salary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm">Salary</span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">💰</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">$4,250.00</p>
              <p className="text-xs text-green-500 mt-2">+2.5% from last month</p>
            </div>

            {/* PayPal Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm">Paypal</span>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">💳</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">$1,200.00</p>
              <p className="text-xs text-gray-400 mt-2">Pending transfer</p>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
            <button className="bg-[#1e3a5f] hover:bg-[#2d5a87] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg">
              ADD NEW CARD
            </button>
          </div>

          <div className="space-y-4">
            {/* Payment Row 1 */}
            <div className="bg-gray-50 border border-[#eee] rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Card Logo */}
                <div className="w-14 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                {/* Card Number */}
                <div>
                  <p className="text-gray-800 font-medium">**** **** **** 5248</p>
                  <p className="text-gray-400 text-xs">Expires 09/27</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">Default</span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Payment Row 2 */}
            <div className="bg-gray-50 border border-[#eee] rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Card Logo */}
                <div className="w-14 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                {/* Card Number */}
                <div>
                  <p className="text-gray-800 font-medium">**** **** **** 8765</p>
                  <p className="text-gray-400 text-xs">Expires 11/26</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice History Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Invoice History</h2>
          
          <div className="space-y-4">
            {/* Invoice Row 1 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📄</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Premium Plan - January 2026</p>
                  <p className="text-gray-400 text-xs">Invoice #INV-2026-001</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-gray-800 font-medium">$49.99</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">Paid</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
              </div>
            </div>

            {/* Invoice Row 2 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📄</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Premium Plan - December 2025</p>
                  <p className="text-gray-400 text-xs">Invoice #INV-2025-012</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-gray-800 font-medium">$49.99</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">Paid</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
              </div>
            </div>

            {/* Invoice Row 3 */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">📄</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Premium Plan - November 2025</p>
                  <p className="text-gray-400 text-xs">Invoice #INV-2025-011</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-gray-800 font-medium">$49.99</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">Paid</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
