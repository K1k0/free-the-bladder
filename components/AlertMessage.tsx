import React from 'react';

interface AlertMessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type, onClose }) => {
  const baseClasses = "p-4 rounded-lg shadow-lg flex justify-between items-center text-sm sm:text-base";
  let typeClasses = "";

  switch (type) {
    case 'success':
      typeClasses = "bg-green-50 border border-green-300 text-green-700";
      break;
    case 'error':
      typeClasses = "bg-red-50 border border-red-300 text-red-700";
      break;
    case 'info':
      typeClasses = "bg-sky-50 border border-sky-300 text-sky-700";
      break;
  }

  return (
    <div className={`${baseClasses} ${typeClasses} mb-6`} role="alert">
      <span className="font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-xl font-semibold leading-none hover:opacity-75 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Close alert"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertMessage;