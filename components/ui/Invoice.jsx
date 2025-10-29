import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Invoice = ({ booking, onClose }) => {
  if (!booking) return null;

  const totalAmount = booking.packagePrice * booking.guests;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl"
        >
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-teal-600">Voyage</h2>
                <p className="text-slate-500">Booking Invoice</p>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><X size={24} /></button>
            </div>

            <div className="border-t my-6"></div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-500 mb-2">BILLED TO</h4>
                <p className="font-bold text-slate-800">{booking.clientName}</p>
                <p className="text-slate-600">{booking.clientEmail}</p>
                <p className="text-slate-600">{booking.clientPhone}</p>
              </div>
              <div className="text-right">
                <h4 className="font-semibold text-slate-500 mb-1">Invoice #{booking._id.slice(-8).toUpperCase()}</h4>
                <h4 className="font-semibold text-slate-500">Date: {new Date(booking.createdAt).toLocaleDateString('en-IN')}</h4>
              </div>
            </div>

            <div className="mt-8">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-slate-600">Package</th>
                    <th className="p-3 text-center font-semibold text-slate-600">Guests</th>
                    <th className="p-3 text-right font-semibold text-slate-600">Price/Guest</th>
                    <th className="p-3 text-right font-semibold text-slate-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3">{booking.packageName}</td>
                    <td className="p-3 text-center">{booking.guests}</td>
                    <td className="p-3 text-right">₹{booking.packagePrice.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right">₹{totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t mt-6 pt-6 flex justify-end">
                <div className="w-full max-w-xs">
                     <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                     </div>
                     <div className="flex justify-between text-slate-600 mt-2">
                        <span>Tax (0%)</span>
                        <span>₹0.00</span>
                     </div>
                     <div className="border-t my-2"></div>
                     <div className="flex justify-between font-bold text-xl text-slate-800">
                        <span>Total Paid</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                     </div>
                </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Invoice;