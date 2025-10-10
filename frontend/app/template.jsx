'use client'
import Sidebar from "./components/Sidebar";

export default function Template({ children }) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b p-4 px-6 border-gray-200">
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-bold text-gray-900">Hospital Management System</h1>
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">A</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                                    <p className="text-xs text-gray-500 truncate">Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}