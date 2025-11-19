import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';

interface PaymentStatusCardProps {
  type: 'total' | 'paid' | 'pending' | 'overdue';
  count: number;
  onClick: () => void;
  index: number;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({ type, count, onClick, index }) => {
  const config = useMemo(() => ({
    total: {
      title: 'Total Clientes',
      icon: Users,
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-white',
      iconColor: 'text-blue-200'
    },
    paid: {
      title: 'Clientes Pagados',
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-white',
      iconColor: 'text-green-200'
    },
    pending: {
      title: 'Pagos Pendientes',
      icon: Clock,
      bgColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
      textColor: 'text-white',
      iconColor: 'text-amber-200'
    },
    overdue: {
      title: 'Pagos Vencidos',
      icon: AlertCircle,
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-white',
      iconColor: 'text-red-200'
    }
  }), []);

  const { title, icon: Icon, bgColor, textColor, iconColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`${bgColor} p-6 rounded-xl shadow-lg cursor-pointer relative overflow-hidden`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10" />
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColor} text-sm font-medium opacity-90`}>{title}</p>
          <motion.p 
            className={`${textColor} text-3xl font-bold mt-2`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
          >
            {count}
          </motion.p>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Icon className={`w-12 h-12 ${iconColor}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(PaymentStatusCard);