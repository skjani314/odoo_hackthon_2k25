const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl p-6 relative transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none" aria-label="Close modal">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;