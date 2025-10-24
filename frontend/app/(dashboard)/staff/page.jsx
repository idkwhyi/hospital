'use client'
import { useState, useEffect } from 'react'
import StaffForm from '@/app/components/form/StaffForm'

// API Base URL - sesuaikan dengan backend Anda
const API_BASE_URL = 'http://localhost:8000'

export default function Page() {
    const [staff, setStaff] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingStaff, setEditingStaff] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState(null)

    // Get token from cookies
    const getAuthToken = () => {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='))
        return tokenCookie ? tokenCookie.split('=')[1] : null
    }

    // Fetch staff from API
    const fetchStaff = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_BASE_URL}/users/?role=staff`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Failed to fetch staff')
            }

            const data = await response.json()
            const staffUsers = data.filter(user => user.role === 'staff')
            setStaff(staffUsers)
            setError(null)
        } catch (err) {
            setError(err.message)
            console.error('Error fetching staff:', err)
        } finally {
            setLoading(false)
        }
    }

    // Load staff on component mount
    useEffect(() => {
        fetchStaff()
    }, [])

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
            title: 'Active Accounts',
            value: staff.length.toString(),
            change: '+2',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Password Changed',
            value: '2',
            change: '+1',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
        }
    ]

    const filteredStaff = staff.filter(staffMember =>
        staffMember.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // CREATE: Add new staff
    const handleAddStaff = async (newStaff) => {
        console.log("staff: ", newStaff)
        console.log("token: ", getAuthToken())
        try {
            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: newStaff.username,
                    password: newStaff.password,
                    role: 'staff',
                    branch: newStaff.branch
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to create staff')
            }

            const createdStaff = await response.json()
            setStaff([...staff, createdStaff])
            setShowAddForm(false)
            alert('Staff account created successfully!')
        } catch (err) {
            alert(`Error: ${err.message}`)
            console.error('Error creating staff:', err)
        }
    }

    // UPDATE: Edit existing staff
    const handleEditStaff = async (updatedStaff) => {
        try {
            const payload = {
                username: updatedStaff.username,
                role: 'staff',
                branch: updatedStaff.branch
            }

            // Only include password if it's not empty
            if (updatedStaff.password && updatedStaff.password.trim() !== '') {
                payload.password = updatedStaff.password
            }

            const response = await fetch(`${API_BASE_URL}/users/${updatedStaff.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to update staff')
            }

            const updated = await response.json()
            setStaff(staff.map(s => s.id === updated.id ? updated : s))
            setEditingStaff(null)
            alert('Staff account updated successfully!')
        } catch (err) {
            alert(`Error: ${err.message}`)
            console.error('Error updating staff:', err)
        }
    }

    // DELETE: Delete staff
    const handleDeleteStaff = async (id) => {
        if (!confirm('Are you sure you want to delete this staff account?')) {
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to delete staff')
            }

            setStaff(staff.filter(s => s.id !== id))
            alert('Staff account deleted successfully!')
        } catch (err) {
            alert(`Error: ${err.message}`)
            console.error('Error deleting staff:', err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading staff...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error: {error}</p>
                    <button
                        onClick={fetchStaff}
                        className="text-sm underline mt-1"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Account Management</h1>
                    <p className="text-gray-600">Manage staff login accounts</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Staff Account</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Search */}
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
                                placeholder="Search staff by username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStaff.map((staffMember) => (
                                <tr key={staffMember.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 font-semibold text-sm">
                                                    {staffMember.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{staffMember.username}</div>
                                                <div className="text-sm text-gray-500">ID: {staffMember.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                            {staffMember.branch === 'central' ? 'Central' :
                                                staffMember.branch === 'branch_a' ? 'Branch A' :
                                                    staffMember.branch === 'branch_b' ? 'Branch B' :
                                                        staffMember.branch}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                            {staffMember.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingStaff(staffMember)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStaff(staffMember.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors px-3 py-1 rounded border border-red-200 hover:bg-red-50"
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No staff accounts found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search term</p>
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