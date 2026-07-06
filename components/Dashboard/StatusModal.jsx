'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const StatusModal = ({ isOpen, onClose, type = 'success', title, message, actionText = 'Continue' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-sm bg-[#0B0E14] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
          >
            {/* Top Shine */}
            <div className={`absolute top-0 inset-x-0 h-1 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />

            <div className="p-8 flex flex-col items-center text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 200 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}
              >
                {type === 'success' ? (
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-500" />
                )}
              </motion.div>

              {/* Text */}
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                {title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                {message}
              </p>

              {/* Action Button */}
              <button
                onClick={onClose}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  type === 'success'
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'
                }`}
              >
                {actionText}
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;
