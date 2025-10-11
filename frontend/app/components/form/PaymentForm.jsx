import { useState } from "react"

const PaymentForm = ({ bill, onProcessPayment, onCancel }) => {
    const [paymentData, setPaymentData] = useState({
        amount: bill.amount - bill.paidAmount,
        method: 'Cash',
        reference: '',
        date: new Date().toISOString().split('T')[0]
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onProcessPayment(bill.id, paymentData)
    }

    const balance = bill.amount - bill.paidAmount

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Process Payment</h2>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Patient:</span>
                                <p className="font-medium">{bill.patientName}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Total Amount:</span>
                                <p className="font-medium">${bill.amount}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Paid Amount:</span>
                                <p className="font-medium">${bill.paidAmount}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Balance:</span>
                                <p className="font-medium text-red-600">${balance}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount ($)</label>
                            <input
                                type="number"
                                min="0.01"
                                max={balance}
                                step="0.01"
                                value={paymentData.amount}
                                onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                                value={paymentData.method}
                                onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                            <input
                                type="text"
                                value={paymentData.reference}
                                onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                            <input
                                type="date"
                                value={paymentData.date}
                                onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                            >
                                Process Payment
                            </button>
                            <button
                                onClick={onCancel}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentForm