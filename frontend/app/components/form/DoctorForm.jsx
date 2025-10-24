"use client"
import { useState, useEffect } from "react"

const DoctorForm = ({ doctor, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        branch: 'central'
    })

    // Load doctor data when editing
    useEffect(() => {
        if (doctor) {
            setFormData({
                id: doctor.id,
                username: doctor.username || '',
                password: '',
                branch: doctor.branch || 'central'
            })
        }
    }, [doctor])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    const branches = [
        { value: 'central', label: 'Central' },
        { value: 'branch_a', label: 'Branch A' },
        { value: 'branch_b', label: 'Branch B' }
    ]

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        {doctor ? 'Edit Doctor Account' : 'Add New Doctor Account'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                required={!doctor}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={doctor ? "Enter new password (leave empty to keep current)" : "Enter password"}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {doctor ? "Leave empty to keep current password" : "Minimum 6 characters recommended"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                {branches.map((branch) => (
                                    <option key={branch.value} value={branch.value}>
                                        {branch.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select the branch for this doctor</p>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                {doctor ? 'Update Account' : 'Create Account'}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DoctorForm