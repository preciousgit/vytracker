import React from 'react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // If the modal is not open, don't render anything

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-lg text-center mb-4">Are you sure you want to book this appointment?</h3>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Continue
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
