import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  onCustomerAdd: (customerData: any) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onCustomerAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual. Puedo ayudarte a:\n• Registrar nuevos clientes\n• Actualizar estados de pago\n• Consultar información\n\n¿En qué puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentFlow, setCurrentFlow] = useState<'none' | 'registro' | 'pago'>('none');
  const [formData, setFormData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const registrationSteps = [
    { field: 'nombre_cliente', question: 'Perfecto, vamos a registrar un nuevo cliente. ¿Cuál es el nombre completo?' },
    { field: 'telefono', question: '¿Cuál es su número de teléfono?' },
    { field: 'direccion', question: '¿Cuál es su dirección completa?' },
    { field: 'tipo_instalacion', question: '¿Qué tipo de instalación requiere? (Fibra o Antena)', options: ['Fibra', 'Antena'] },
    { field: 'ubicacion_region', question: '¿En qué ubicación o región se encuentra?' },
    { field: 'ip_asignada', question: '¿Cuál es la IP que se le asignará?' },
    { field: 'megas_contratados', question: '¿Cuántos MB contrató?' },
    { field: 'fecha_instalacion', question: '¿Cuál es la fecha de instalación? (dd/mm/aaaa)' },
    { field: 'metodo_pago', question: '¿Cuál es su método de pago preferido? (Efectivo o Tarjeta)', options: ['Efectivo', 'Tarjeta'] },
    { field: 'folio_fibra_migracion', question: '¿Cuál es el folio de fibra o migración?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, 'user');
    processUserInput(inputText);
    setInputText('');
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (currentFlow === 'none') {
      if (lowerInput.includes('registrar') || lowerInput.includes('nuevo cliente') || lowerInput.includes('agregar cliente')) {
        setCurrentFlow('registro');
        setCurrentStep(0);
        setTimeout(() => {
          addMessage(registrationSteps[0].question, 'bot');
        }, 500);
      } else if (lowerInput.includes('pago') || lowerInput.includes('marcar pago')) {
        setCurrentFlow('pago');
        setTimeout(() => {
          addMessage('¿Cuál es el nombre del cliente para actualizar su estado de pago?', 'bot');
        }, 500);
      } else {
        setTimeout(() => {
          addMessage('No entiendo tu solicitud. Puedes decir:\n• "Registrar nuevo cliente"\n• "Marcar pago"\n• "Ayuda"', 'bot');
        }, 500);
      }
    } else if (currentFlow === 'registro') {
      const currentStepData = registrationSteps[currentStep];
      let processedValue = input;

      if (currentStepData.field === 'megas_contratados') {
        processedValue = parseInt(input).toString();
      } else if (currentStepData.field === 'fecha_instalacion') {
        // Convert dd/mm/yyyy to yyyy-mm-dd
        const dateParts = input.split('/');
        if (dateParts.length === 3) {
          processedValue = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
        }
      }

      const newFormData = {
        ...formData,
        [currentStepData.field]: processedValue
      };
      setFormData(newFormData);

      if (currentStep < registrationSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeout(() => {
          addMessage(registrationSteps[currentStep + 1].question, 'bot');
        }, 500);
      } else {
        // Finish registration
        const completeData = {
          ...newFormData,
          estado_pago: 'Pendiente',
          referencia_domicilio: '',
          notas: ''
        };
        
        onCustomerAdd(completeData);
        
        setTimeout(() => {
          addMessage('¡Perfecto! He registrado al cliente exitosamente. El cliente ha sido agregado a la base de datos.\n\n¿Hay algo más en lo que pueda ayudarte?', 'bot');
        }, 500);
        
        // Reset flow
        setCurrentFlow('none');
        setFormData({});
        setCurrentStep(0);
      }
    } else if (currentFlow === 'pago') {
      setTimeout(() => {
        addMessage(`Entendido. Para marcar el pago de ${input}, necesitarías usar el panel principal y buscar al cliente para actualizar su estado. ¿Hay algo más en lo que pueda ayudarte?`, 'bot');
      }, 500);
      
      setCurrentFlow('none');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span className="font-medium">Asistente Virtual ISP</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-blue-700 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-line text-sm">{message.text}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};