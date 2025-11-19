import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Customer } from '../types/customer';
import { ImageUpload } from './ImageUpload';
import { X } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: customer ? {
      nombre_cliente: customer.nombre_cliente,
      email: customer.email,
      tipo_instalacion: customer.tipo_instalacion,
      direccion: customer.direccion,
      telefono: customer.telefono,
      ubicacion_region: customer.ubicacion_region,
      referencia_domicilio: customer.referencia_domicilio,
      ip_asignada: customer.ip_asignada,
      megas_contratados: customer.megas_contratados,
      fecha_instalacion: customer.fecha_instalacion,
      metodo_pago: customer.metodo_pago,
      folio_fibra_migracion: customer.folio_fibra_migracion,
      estado_pago: customer.estado_pago,
      notas: customer.notas || ''
    } : {
      estado_pago: 'Pendiente' as const,
      tipo_instalacion: 'Fibra' as const,
      metodo_pago: 'Efectivo' as const
    }
  });

  const onSubmitForm = (data: any) => {
    onSubmit({
      ...data,
      megas_contratados: Number(data.megas_contratados)
    });
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {customer ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Cliente *
              </label>
              <input
                {...register('nombre_cliente', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.nombre_cliente && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre_cliente.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Este campo es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Instalación *
              </label>
              <select
                {...register('tipo_instalacion', { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Fibra">Fibra</option>
                <option value="Antena">Antena</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <input
                {...register('direccion', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.direccion && (
                <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                {...register('telefono', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación/Región *
              </label>
              <input
                {...register('ubicacion_region', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.ubicacion_region && (
                <p className="text-red-500 text-sm mt-1">{errors.ubicacion_region.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia del Domicilio *
              </label>
              <input
                {...register('referencia_domicilio', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.referencia_domicilio && (
                <p className="text-red-500 text-sm mt-1">{errors.referencia_domicilio.message}</p>
              )}
            </div>
            
            <div>
              <ImageUpload
                label="Foto de Referencia"
                onChange={(file) => {
                  // Handle file upload logic here
                  console.log('Reference photo:', file);
                }}
              />
            </div>
            
            <div>
              <ImageUpload
                label="Foto del Folio"
                onChange={(file) => {
                  // Handle file upload logic here
                  console.log('Folio photo:', file);
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Asignada *
              </label>
              <input
                {...register('ip_asignada', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.ip_asignada && (
                <p className="text-red-500 text-sm mt-1">{errors.ip_asignada.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Megas Contratados *
              </label>
              <input
                type="number"
                {...register('megas_contratados', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.megas_contratados && (
                <p className="text-red-500 text-sm mt-1">{errors.megas_contratados.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Instalación *
              </label>
              <input
                type="date"
                {...register('fecha_instalacion', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.fecha_instalacion && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha_instalacion.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de Pago *
              </label>
              <select
                {...register('metodo_pago', { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folio Fibra/Migración *
              </label>
              <input
                {...register('folio_fibra_migracion', { required: 'Este campo es obligatorio' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.folio_fibra_migracion && (
                <p className="text-red-500 text-sm mt-1">{errors.folio_fibra_migracion.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado de Pago *
              </label>
              <select
                {...register('estado_pago', { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vencido">Vencido</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                {...register('notas')}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {customer ? 'Actualizar' : 'Guardar'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};