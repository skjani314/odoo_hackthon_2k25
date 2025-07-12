


const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };


  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};


export default Button;