'use client'
import { useState, useEffect } from 'react'
import DoctorForm from '@/app/components/form/DoctorForm'

// API Base URL - sesuaikan dengan backend Anda
const API_BASE_URL = 'http://localhost:8000'

export default function Page() {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingDoctor, setEditingDoctor] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState(null)

    // Get token from cookies
    const getAuthToken = () => {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='))
        return tokenCookie ? tokenCookie.split('=')[1] : null
    }

    // Fetch doctors from API
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/users/?role=doctor`, {
                method: 'GET', // <-- pindahkan ke sini
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // opsional, kalau pakai cookie-based auth
            });

            if (!response.ok) {
                throw new Error('Failed to fetch doctors');
            }

            const data = await response.json();

            // API-mu sudah bisa filter berdasarkan role,
            const doctorUsers = data.filter(user => user.role === 'doctor');
            setDoctors(doctorUsers);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };


    // Load doctors on component mount
    useEffect(() => {
        fetchDoctors()
    }, [])

    const stats = [
        {
            title: 'Total Doctors',
            value: doctors.length.toString(),
            change: '+2',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            title: 'Active Accounts',
            value: doctors.length.toString(),
            change: '+1',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Password Changed',
            value: '3',
            change: '+1',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
        }
    ]

    const filteredDoctors = doctors.filter(doctor =>
        doctor.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddDoctor = async (newDoctor) => {
        console.log("doctor: ", newDoctor)
        console.log("token: ", getAuthToken())
        try {
            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: newDoctor.username,  // <- Changed from newDoctor.name
                    password: newDoctor.password,
                    role: 'doctor',
                    branch: newDoctor.branch  // <- Added branch
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to create doctor')
            }

            const createdDoctor = await response.json()
            setDoctors([...doctors, createdDoctor])
            setShowAddForm(false)
            alert('Doctor account created successfully!')
        } catch (err) {
            alert(`Error: ${err.message}`)
            console.error('Error creating doctor:', err)
        }
    }

    const handleEditDoctor = async (updatedDoctor) => {
        try {
            const payload = {
                role: 'doctor',
                branch: updatedDoctor.branch
            }

            // Only include password if it's not empty
            if (updatedDoctor.password && updatedDoctor.password.trim() !== '') {
                payload.password = updatedDoctor.password
            }

            const response = await fetch(`${API_BASE_URL}/users/${updatedDoctor.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to update doctor')
            }

            const updated = await response.json()
            setDoctors(doctors.map(d => d.id === updated.id ? updated : d))
            setEditingDoctor(null)
            alert('Doctor account updated successfully!')
        } catch (err) {
            alert(`Error: ${err.message}`)
            console.error('Error updating doctor:', err)
        }
    }

    // DELETE: Delete doctor
    const handleDeleteDoctor = async (id) => {
        if (!confirm('Are you sure you want to delete this doctor account?')) {
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
                throw new Error(errorData.detail || 'Failed to delete doctor')
            }

            setDoctors(doctors.filter(d => d.id !== id))
            alert('Doctor account deleted successfully!')
        } catch (err) {
            alert(`Error: ${err.message}`)
            console.error('Error deleting doctor:', err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading doctors...</p>
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
                        onClick={fetchDoctors}
                        className="text-sm underline mt-1"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Doctors Account Management</h1>
                    <p className="text-gray-600">Manage doctor login accounts</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Doctor Account</span>
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
                                placeholder="Search doctors by username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctors Table */}
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
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold text-sm">
                                                    {doctor.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{doctor.username}</div>
                                                <div className="text-sm text-gray-500">ID: {doctor.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                            {doctor.branch === 'central' ? 'Central' :
                                                doctor.branch === 'branch_a' ? 'Branch A' :
                                                    doctor.branch === 'branch_b' ? 'Branch B' :
                                                        doctor.branch}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                            {doctor.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingDoctor(doctor)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDoctor(doctor.id)}
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

                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No doctor accounts found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search term</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Doctor Form Modal */}
            {(showAddForm || editingDoctor) && (
                <DoctorForm
                    doctor={editingDoctor}
                    onSave={editingDoctor ? handleEditDoctor : handleAddDoctor}
                    onCancel={() => {
                        setShowAddForm(false)
                        setEditingDoctor(null)
                    }}
                />
            )}
        </div>
    )
}