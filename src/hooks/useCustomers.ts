import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Customer } from '../types/customer';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    if (!supabase) {
      setError('Supabase no está configurado. Por favor conecta a Supabase.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading customers';
      setError(errorMessage);
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCustomers = useCallback(async (query: string) => {
    if (!supabase) {
      setError('Supabase no está configurado. Por favor conecta a Supabase.');
      return;
    }

    if (!query.trim()) {
      await fetchCustomers();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`nombre_cliente.ilike.%${query}%,telefono.ilike.%${query}%,ip_asignada.ilike.%${query}%,direccion.ilike.%${query}%,ubicacion_region.ilike.%${query}%`);

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error searching customers';
      setError(errorMessage);
      console.error('Error searching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchCustomers]);

  const addCustomer = useCallback(async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado. Por favor conecta a Supabase.');
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .maybeSingle();

      if (error) throw error;
      await fetchCustomers();
      return data;
    } catch (err) {
      console.error('Error adding customer:', err);
      throw new Error(err instanceof Error ? err.message : 'Error adding customer');
    }
  }, [fetchCustomers]);

  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado. Por favor conecta a Supabase.');
    }

    try {
      const { error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchCustomers();
    } catch (err) {
      console.error('Error updating customer:', err);
      throw new Error(err instanceof Error ? err.message : 'Error updating customer');
    }
  }, [fetchCustomers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    searchCustomers,
    addCustomer,
    updateCustomer
  };
};