import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Buscar por nombre, teléfono, IP, dirección..." 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  }, [query, onSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Auto-search as user types (with debounce effect)
    if (value.length === 0 || value.length >= 3) {
      onSearch(value);
    }
  }, [onSearch]);

  const inputProps = useMemo(() => ({
    type: "text",
    value: query,
    onChange: handleChange,
    placeholder,
    className: "w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
  }), [query, handleChange, placeholder]);
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: query ? 360 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </motion.div>
        <input {...inputProps} />
      </div>
    </motion.form>
  );
};