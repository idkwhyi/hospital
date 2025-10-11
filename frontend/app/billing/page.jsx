'use client'
import { useState } from 'react'
import BillForm from '@/app/components/form/BillForm'
import PaymentForm from '../components/form/PaymentForm'

export default function page() {
    const [bills, setBills] = useState([
        {
            id: 1,
            patientName: 'John Doe',
            patientId: 'P001',
            doctorName: 'Dr. Sarah Johnson',
            billDate: '2024-01-20',
            dueDate: '2024-02-20',
            amount: 450,
            paidAmount: 450,
            status: 'Paid',
            paymentMethod: 'Credit Card',
            services: ['Consultation', 'Blood Test', 'X-Ray']
        },
        {
            id: 2,
            patientName: 'Jane Smith',
            patientId: 'P002',
            doctorName: 'Dr. Michael Chen',
            billDate: '2024-01-19',
            dueDate: '2024-02-19',
            amount: 280,
            paidAmount: 150,
            status: 'Partial',
            paymentMethod: 'Insurance',
            services: ['Consultation', 'Medication']
        },
        {
            id: 3,
            patientName: 'Mike Wilson',
            patientId: 'P003',
            doctorName: 'Dr. Emily Rodriguez',
            billDate: '2024-01-18',
            dueDate: '2024-02-18',
            amount: 1200,
            paidAmount: 0,
            status: 'Pending',
            paymentMethod: '-',
            services: ['Surgery', 'Hospital Stay']
        }
    ])

    const [showAddForm, setShowAddForm] = useState(false)
    const [editingBill, setEditingBill] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [selectedBill, setSelectedBill] = useState(null)

    // Stats data untuk billing
    const stats = [
        {
            title: 'Total Revenue',
            value: `$${bills.reduce((acc, bill) => acc + bill.amount, 0).toLocaleString()}`,
            change: '+15%',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
        },
        {
            title: 'Paid Amount',
            value: `$${bills.reduce((acc, bill) => acc + bill.paidAmount, 0).toLocaleString()}`,
            change: '+12%',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Pending Amount',
            value: `$${bills.reduce((acc, bill) => acc + (bill.amount - bill.paidAmount), 0).toLocaleString()}`,
            change: '-8%',
            trend: 'down',
            icon: (
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Collection Rate',
            value: `${Math.round((bills.reduce((acc, bill) => acc + bill.paidAmount, 0) / bills.reduce((acc, bill) => acc + bill.amount, 0)) * 100)}%`,
            change: '+5%',
            trend: 'up',
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
    ]

    const filteredBills = bills.filter(bill =>
        bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddBill = (newBill) => {
        const bill = {
            id: bills.length + 1,
            ...newBill,
            paidAmount: 0,
            status: 'Pending'
        }
        setBills([...bills, bill])
        setShowAddForm(false)
    }

    const handleEditBill = (updatedBill) => {
        setBills(bills.map(b => b.id === updatedBill.id ? updatedBill : b))
        setEditingBill(null)
    }

    const handleDeleteBill = (id) => {
        if (confirm('Are you sure you want to delete this bill?')) {
            setBills(bills.filter(b => b.id !== id))
        }
    }

    const handleProcessPayment = (billId, paymentData) => {
        setBills(bills.map(bill => {
            if (bill.id === billId) {
                const newPaidAmount = bill.paidAmount + paymentData.amount
                const newStatus = newPaidAmount >= bill.amount ? 'Paid' :
                    newPaidAmount > 0 ? 'Partial' : 'Pending'

                return {
                    ...bill,
                    paidAmount: newPaidAmount,
                    status: newStatus,
                    paymentMethod: paymentData.method
                }
            }
            return bill
        }))
        setShowPaymentModal(false)
        setSelectedBill(null)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800'
            case 'Partial': return 'bg-yellow-100 text-yellow-800'
            case 'Pending': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getAmountColor = (amount, paidAmount) => {
        if (paidAmount >= amount) return 'text-green-600'
        if (paidAmount > 0) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Billing Management</h1>
                    <p className="text-gray-600">Manage patient bills and payments</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Create Bill</span>
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
                                placeholder="Search bills by patient name, ID, or doctor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Status</option>
                            <option>Paid</option>
                            <option>Partial</option>
                            <option>Pending</option>
                        </select>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Bill Date"
                        />
                    </div>
                </div>
            </div>

            {/* Bills Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBills.map((bill) => {
                                const balance = bill.amount - bill.paidAmount
                                return (
                                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <span className="text-indigo-600 font-semibold text-sm">
                                                        {bill.patientName.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{bill.patientName}</div>
                                                    <div className="text-sm text-gray-500">{bill.patientId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{bill.doctorName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{bill.billDate}</div>
                                            <div className="text-sm text-gray-500">Due: {bill.dueDate}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">${bill.amount}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${getAmountColor(bill.amount, bill.paidAmount)}`}>
                                                ${bill.paidAmount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                ${balance}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        console.log("Billing")
                                                        setSelectedBill(bill)
                                                        setShowPaymentModal(true)
                                                    }}
                                                    className="text-green-600 hover:text-green-900 transition-colors"
                                                    disabled={bill.status === 'Paid'}
                                                >
                                                    Payment
                                                </button>
                                                <button
                                                    onClick={() => setEditingBill(bill)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBill(bill.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredBills.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bills found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Bill Form Modal */}
            {(showAddForm || editingBill) && (
                <BillForm
                    bill={editingBill}
                    onSave={editingBill ? handleEditBill : handleAddBill}
                    onCancel={() => {
                        setShowAddForm(false)
                        setEditingBill(null)
                    }}
                />
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedBill && (
                <PaymentForm
                    bill={selectedBill}
                    onProcessPayment={handleProcessPayment}
                    onCancel={() => {
                        setShowPaymentModal(false)
                        setSelectedBill(null)
                    }}
                />
            )}
        </div>
    )
}