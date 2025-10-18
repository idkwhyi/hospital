'use client'
import { useState } from 'react'
import DoctorForm from '@/app/components/form/DoctorForm'

export default function page() {
    const [doctors, setDoctors] = useState([
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialization: 'Cardiology',
            email: 'sarah.j@hospital.com',
            phone: '+1 (555) 123-4567',
            status: 'Active',
            schedule: 'Mon, Wed, Fri: 9AM-5PM',
            consultationFee: '$150',
            experience: '8 years'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialization: 'Neurology',
            email: 'michael.c@hospital.com',
            phone: '+1 (555) 234-5678',
            status: 'Active',
            schedule: 'Tue, Thu: 10AM-6PM',
            consultationFee: '$180',
            experience: '12 years'
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialization: 'Pediatrics',
            email: 'emily.r@hospital.com',
            phone: '+1 (555) 345-6789',
            status: 'On Leave',
            schedule: 'Mon-Fri: 8AM-4PM',
            consultationFee: '$120',
            experience: '6 years'
        }
    ])

    const [showAddForm, setShowAddForm] = useState(false)
    const [editingDoctor, setEditingDoctor] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Stats data untuk doctors
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
            title: 'Active Doctors',
            value: doctors.filter(d => d.status === 'Active').length.toString(),
            change: '+1',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Specializations',
            value: new Set(doctors.map(d => d.specialization)).size.toString(),
            change: '+1',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            title: 'Avg. Fee',
            value: '$150',
            change: '+5%',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
        },
    ]

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddDoctor = (newDoctor) => {
        const doctor = {
            id: doctors.length + 1,
            ...newDoctor
        }
        setDoctors([...doctors, doctor])
        setShowAddForm(false)
    }

    const handleEditDoctor = (updatedDoctor) => {
        setDoctors(doctors.map(d => d.id === updatedDoctor.id ? updatedDoctor : d))
        setEditingDoctor(null)
    }

    const handleDeleteDoctor = (id) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            setDoctors(doctors.filter(d => d.id !== id))
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Doctors Management</h1>
                    <p className="text-gray-600">Manage doctor profiles</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Doctor</span>
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
                                placeholder="Search doctors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    {/* <div className="flex space-x-3">
                        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>On Leave</option>
                        </select>
                        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Specializations</option>
                            <option>Cardiology</option>
                            <option>Neurology</option>
                            <option>Pediatrics</option>
                        </select>
                    </div> */}
                </div>
            </div>

            {/* Doctors Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> 
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold text-sm">
                                                    {doctor.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                                {/* <div className="text-sm text-gray-500">{doctor.experience}</div> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingDoctor(doctor)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDoctor(doctor.id)}
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

                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter</p>
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

