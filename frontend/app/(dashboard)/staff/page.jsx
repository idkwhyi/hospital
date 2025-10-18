'use client'
import { useState } from 'react'
import StaffForm from '@/app/components/form/StaffForm'

export default function page() {
    const [staff, setStaff] = useState([
        {
            id: 1,
            name: 'Robert Brown',
            email: 'robert.b@hospital.com',
            phone: '+1 (555) 456-7890',
            role: 'Receptionist',
            department: 'Front Desk',
            joinDate: '2022-03-15',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Lisa Wang',
            email: 'lisa.w@hospital.com',
            phone: '+1 (555) 567-8901',
            role: 'Nurse',
            department: 'Emergency',
            joinDate: '2021-08-22',
            status: 'Active'
        },
        {
            id: 3,
            name: 'David Kim',
            email: 'david.k@hospital.com',
            phone: '+1 (555) 678-9012',
            role: 'Lab Technician',
            department: 'Laboratory',
            joinDate: '2023-01-10',
            status: 'On Leave'
        }
    ])

    const [showAddForm, setShowAddForm] = useState(false)
    const [editingStaff, setEditingStaff] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Stats data untuk staff
    const stats = [
        {
            title: 'Total Staff',
            value: staff.length.toString(),
            change: '+3',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
        },
        {
            title: 'Active Staff',
            value: staff.filter(s => s.status === 'Active').length.toString(),
            change: '+2',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Departments',
            value: new Set(staff.map(s => s.department)).size.toString(),
            change: '+1',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
        {
            title: 'Avg. Tenure',
            value: '1.8 yrs',
            change: '+0.2',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ]

    const filteredStaff = staff.filter(staffMember =>
        staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.department.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddStaff = (newStaff) => {
        const staffMember = {
            id: staff.length + 1,
            ...newStaff
        }
        setStaff([...staff, staffMember])
        setShowAddForm(false)
    }

    const handleEditStaff = (updatedStaff) => {
        setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s))
        setEditingStaff(null)
    }

    const handleDeleteStaff = (id) => {
        if (confirm('Are you sure you want to delete this staff member?')) {
            setStaff(staff.filter(s => s.id !== id))
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-600">Manage hospital staff and personnel</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Staff</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <p className={`text-sm font-medium mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change} from last month
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 w-full sm:max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search staff by name, role, or department..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Roles</option>
                            <option>Receptionist</option>
                            <option>Nurse</option>
                            <option>Lab Technician</option>
                            <option>Administrator</option>
                        </select>
                        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>On Leave</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStaff.map((staffMember) => (
                                <tr key={staffMember.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 font-semibold text-sm">
                                                    {staffMember.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
                                                <div className="text-sm text-gray-500">{staffMember.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{staffMember.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{staffMember.role}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                            {staffMember.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{staffMember.joinDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${staffMember.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {staffMember.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingStaff(staffMember)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStaff(staffMember.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStaff.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Staff Form Modal */}
            {(showAddForm || editingStaff) && (
                <StaffForm
                    staff={editingStaff}
                    onSave={editingStaff ? handleEditStaff : handleAddStaff}
                    onCancel={() => {
                        setShowAddForm(false)
                        setEditingStaff(null)
                    }}
                />
            )}
        </div>
    )
}