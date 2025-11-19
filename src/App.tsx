import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Users, CreditCard, AlertTriangle, Wifi, MessageCircle } from 'lucide-react';
import CustomerCard from './components/CustomerCard';
import { CustomerForm } from './components/CustomerForm';
import PaymentStatusCard from './components/PaymentStatusCard';
import { SearchBar } from './components/SearchBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { PaymentAlert } from './components/PaymentAlert';
import { Chatbot } from './components/Chatbot';
import { useCustomers } from './hooks/useCustomers';
import type { Customer } from './types/customer';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pagado' | 'Pendiente' | 'Vencido'>('all');
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  const {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    searchCustomers
  } = useCustomers();

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.telefono.includes(searchTerm) ||
                          customer.ip_asignada.includes(searchTerm) ||
                          customer.direccion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || customer.estado_pago === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = customers.length;
    const pagados = customers.filter(c => c.estado_pago === 'Pagado').length;
    const pendientes = customers.filter(c => c.estado_pago === 'Pendiente').length;
    const vencidos = customers.filter(c => c.estado_pago === 'Vencido').length;
    
    return { total, pagados, pendientes, vencidos };
  }, [customers]);

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
    if (query.length >= 3 || query.length === 0) {
      searchCustomers(query);
    }
  }, [searchCustomers]);

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addCustomer(customerData);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding customer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al agregar cliente';
      alert(`Error al agregar cliente: ${errorMessage}`);
    }
  };

  const handleUpdateCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingCustomer) return;
    
    try {
      await updateCustomer(editingCustomer.id, customerData);
      setEditingCustomer(null);
      setShowForm(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error al actualizar cliente');
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleStatusCardClick = (status: 'paid' | 'pending' | 'overdue') => {
    const statusMap = {
      paid: 'Pagado',
      pending: 'Pendiente',
      overdue: 'Vencido'
    };
    setFilterStatus(statusMap[status] as 'Pagado' | 'Pendiente' | 'Vencido');
  };

  const handleSendReminders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-payment-reminders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Recordatorios enviados exitosamente');
        setShowPaymentAlert(false);
      } else {
        throw new Error('Error sending reminders');
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Error al enviar recordatorios');
    }
  };

  // Show payment alert when there are overdue payments
  React.useEffect(() => {
    if (stats.vencidos > 0 && !showPaymentAlert) {
      const timer = setTimeout(() => {
        setShowPaymentAlert(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stats.vencidos, showPaymentAlert]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Wifi className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Skyweb
              </h1>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingCustomer(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Nuevo Cliente
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PaymentStatusCard
              type="total"
              count={stats.total}
              onClick={() => setFilterStatus('all')}
              index={0}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PaymentStatusCard
              type="paid"
              count={stats.pagados}
              onClick={() => handleStatusCardClick('paid')}
              index={1}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PaymentStatusCard
              type="pending"
              count={stats.pendientes}
              onClick={() => handleStatusCardClick('pending')}
              index={2}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PaymentStatusCard
              type="overdue"
              count={stats.vencidos}
              onClick={() => handleStatusCardClick('overdue')}
              index={3}
            />
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          className="mb-6 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { key: 'all', label: 'Todos' },
            { key: 'Pagado', label: 'Pagados' },
            { key: 'Pendiente', label: 'Pendientes' },
            { key: 'Vencido', label: 'Vencidos' }
          ].map((filter) => (
            <motion.button
              key={filter.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(filter.key as any)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filterStatus === filter.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Customer List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer, index) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onClick={() => handleCustomerClick(customer)}
                  index={index}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {!loading && filteredCustomers.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron clientes
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer cliente'}
            </p>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <CustomerForm
            customer={editingCustomer}
            onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
            onClose={() => {
              setShowForm(false);
              setEditingCustomer(null);
            }}
          />
        )}

        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onEdit={() => handleEditCustomer(selectedCustomer)}
          />
        )}
      </AnimatePresence>

      {/* Payment Alert */}
      <PaymentAlert
        show={showPaymentAlert}
        onClose={() => setShowPaymentAlert(false)}
        overdueCount={stats.vencidos}
        onSendReminders={handleSendReminders}
      />

      {/* Chatbot */}
      <Chatbot onCustomerAdd={handleAddCustomer} />
    </div>
  );
}

export default App;