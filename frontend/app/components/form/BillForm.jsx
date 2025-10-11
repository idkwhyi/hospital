"use client"
import { useState } from "react"

const BillForm = ({ bill, onSave, onCancel }) => {
    const [formData, setFormData] = useState(bill || {
        patientName: '',
        patientId: '',
        doctorName: '',
        billDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: 0,
        services: []
    })

    const [newService, setNewService] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    const addService = () => {
        if (newService.trim() && !formData.services.includes(newService.trim())) {
            setFormData({
                ...formData,
                services: [...formData.services, newService.trim()]
            })
            setNewService('')
        }
    }

    const removeService = (serviceToRemove) => {
        setFormData({
            ...formData,
            services: formData.services.filter(service => service !== serviceToRemove)
        })
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        {bill ? 'Edit Bill' : 'Create New Bill'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.patientName}
                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.patientId}
                                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="P001"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                            <select
                                required
                                value={formData.doctorName}
                                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Doctor</option>
                                <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                                <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                                <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                                <option value="Dr. James Wilson">Dr. James Wilson</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.billDate}
                                    onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                            <div className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={newService}
                                    onChange={(e) => setNewService(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Add service..."
                                />
                                <button
                                    type="button"
                                    onClick={addService}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.services.map((service, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {service}
                                        <button
                                            type="button"
                                            onClick={() => removeService(service)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                {bill ? 'Update Bill' : 'Create Bill'}
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

export default BillForm