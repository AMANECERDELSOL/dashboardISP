import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Customer } from '../types/customer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const exportCustomerToPDF = async (customer: Customer) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235); // Blue color
  pdf.text('Información del Cliente', margin, yPosition);
  
  yPosition += 20;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);

  // Customer information
  const fields = [
    { label: 'Nombre del Cliente', value: customer.nombre_cliente },
    { label: 'Tipo de Instalación', value: customer.tipo_instalacion },
    { label: 'Dirección', value: customer.direccion },
    { label: 'Teléfono', value: customer.telefono },
    { label: 'Ubicación/Región', value: customer.ubicacion_region },
    { label: 'Referencia del Domicilio', value: customer.referencia_domicilio },
    { label: 'IP Asignada', value: customer.ip_asignada },
    { label: 'Megas Contratados', value: `${customer.megas_contratados} MB` },
    { 
      label: 'Fecha de Instalación', 
      value: format(new Date(customer.fecha_instalacion), 'dd/MM/yyyy', { locale: es })
    },
    { label: 'Método de Pago', value: customer.metodo_pago },
    { label: 'Folio Fibra/Migración', value: customer.folio_fibra_migracion },
    { label: 'Estado de Pago', value: customer.estado_pago },
    { label: 'Notas', value: customer.notas || 'N/A' }
  ];

  fields.forEach(field => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.text(`${field.label}:`, margin, yPosition);
    
    pdf.setFont('helvetica', 'normal');
    const textLines = pdf.splitTextToSize(field.value, pageWidth - margin * 2 - 60);
    pdf.text(textLines, margin + 60, yPosition);
    
    yPosition += textLines.length * 6 + 5;
  });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`,
    margin,
    pdf.internal.pageSize.height - 10
  );

  // Save the PDF
  pdf.save(`cliente_${customer.nombre_cliente.replace(/\s+/g, '_')}.pdf`);
};