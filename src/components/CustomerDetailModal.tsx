import React from 'react';
import { Customer } from '../types/customer';
import { X, Phone, MapPin, Wifi, Calendar, CreditCard, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { exportCustomerToPDF } from '../utils/pdfExport';

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
  onEdit: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  onEdit
}) => {
  const handleExportPDF = async () => {
    try {
      await exportCustomerToPDF(customer);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al generar el PDF');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pagado': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Vencido': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date correctly without timezone conversion
  const [year, month, day] = customer.fecha_instalacion.split('-').map(Number);
  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

  // Check if a string is a URL
  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Detalles del Cliente</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleExportPDF}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Exportar a PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{customer.nombre_cliente}</h3>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(customer.estado_pago)}`}>
                {customer.estado_pago}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">Información de Contacto</h4>

              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{customer.telefono}</p>
                </div>
              </div>

              <div className="flex items-start text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">{customer.direccion}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Región: {customer.ubicacion_region}
                  </p>
                  {customer.referencia_domicilio && (
                    <p className="text-sm text-gray-500 mt-1">
                      Ref: {customer.referencia_domicilio}
                    </p>
                  )}
                  {customer.maps_link && (
                    <a
                      href={customer.maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1 underline"
                    >
                      Ver en Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">Información del Servicio</h4>

              <div className="flex items-center text-gray-600">
                <Wifi className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Servicio</p>
                  <p className="font-medium">{customer.megas_contratados} MB - {customer.tipo_instalacion}</p>
                  <p className="text-sm text-gray-500">IP: {customer.ip_asignada}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Instalación</p>
                  <p className="font-medium">
                    {formattedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Método de Pago</p>
                  <p className="font-medium">{customer.metodo_pago}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Folio Fibra/Migración</p>
                <p className="font-medium">{customer.folio_fibra_migracion}</p>
              </div>

              {customer.notas && (
                <div>
                  <p className="text-sm text-gray-500">Notas</p>
                  <p className="font-medium">{customer.notas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photos Section */}
          {(customer.referencia_foto_url || customer.folio_foto_url) && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">Fotografías</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.referencia_foto_url && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Foto de Referencia</p>
                    <img
                      src={customer.referencia_foto_url}
                      alt="Foto de referencia del domicilio"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                {customer.folio_foto_url && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Foto del Folio</p>
                    <img
                      src={customer.folio_foto_url}
                      alt="Foto del folio"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Editar Cliente
          </button>
        </div>
      </div>
    </div>
  );
};
