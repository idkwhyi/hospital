export default function page() {
    const stats = [
        {
            title: 'Total Patients',
            value: '1,234',
            change: '+12%',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            title: 'Today Appointments',
            value: '45',
            change: '+5%',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            title: 'Available Doctors',
            value: '28',
            change: '+2',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            title: 'Revenue',
            value: '$12,456',
            change: '+8%',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
        },
    ]

    const recentActivities = [
        { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', time: '2 min ago', type: 'Appointment' },
        { id: 2, patient: 'Jane Smith', doctor: 'Dr. Johnson', time: '5 min ago', type: 'Check-in' },
        { id: 3, patient: 'Mike Wilson', doctor: 'Dr. Brown', time: '10 min ago', type: 'Payment' },
        { id: 4, patient: 'Sarah Davis', doctor: 'Dr. Wilson', time: '15 min ago', type: 'Appointment' },
    ]

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <p className={`text-sm font-medium mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.change} from last week
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts and Activities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.patient}</p>
                                    <p className="text-xs text-gray-500">with {activity.doctor} • {activity.type}</p>
                                </div>
                                <span className="text-xs text-gray-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center">
                            <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-sm font-medium text-blue-900">New Appointment</span>
                        </button>
                        <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center">
                            <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-medium text-green-900">Add Patient</span>
                        </button>
                        <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center">
                            <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-sm font-medium text-purple-900">Reports</span>
                        </button>
                        <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center">
                            <svg className="w-8 h-8 text-orange-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm font-medium text-orange-900">Analytics</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}