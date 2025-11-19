import React, { useCallback, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (file: File | null) => void;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  accept = "image/*"
}) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onChange(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <motion.div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence>
          {preview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleFileChange(null)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id={`upload-${label}`}
              />
              <label
                htmlFor={`upload-${label}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar Archivo
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};