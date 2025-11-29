import React, { useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Customer } from '../types/customer';
import { Phone, MapPin, Wifi, Calendar, Download } from 'lucide-react';
import { exportCustomerToPDF } from '../utils/pdfExport';

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
  index: number;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick, index }) => {
  const handleExportPDF = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await exportCustomerToPDF(customer);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al generar el PDF');
    }
  }, [customer]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Pagado': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Vencido': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  // Parse date correctly without timezone conversion
  // fecha_instalacion is a string in format YYYY-MM-DD, we need to display it as-is
  const [year, month, day] = customer.fecha_instalacion.split('-').map(Number);
  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

  const statusColor = getStatusColor(customer.estado_pago);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      className="bg-white p-6 rounded-xl shadow-md cursor-pointer border border-gray-100 overflow-hidden relative"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-500" />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{customer.nombre_cliente}</h3>
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}>
            {customer.estado_pago}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleExportPDF}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 z-10"
          title="Exportar a PDF"
        >
          <Download className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-3 text-gray-400" />
          <span>{customer.telefono}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-3 text-gray-400" />
          <span className="truncate">{customer.direccion}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Wifi className="w-4 h-4 mr-3 text-gray-400" />
          <span>{customer.megas_contratados} MB - {customer.tipo_instalacion}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-3 text-gray-400" />
          <span>Instalado: {formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CustomerCard);
