import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Mail } from 'lucide-react';

interface PaymentAlertProps {
  show: boolean;
  onClose: () => void;
  overdueCount: number;
  onSendReminders: () => void;
}

export const PaymentAlert: React.FC<PaymentAlertProps> = ({
  show,
  onClose,
  overdueCount,
  onSendReminders
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Pagos Vencidos
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {overdueCount} cliente{overdueCount !== 1 ? 's' : ''} con pagos vencidos
              </p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={onSendReminders}
                  className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Enviar Recordatorios
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};