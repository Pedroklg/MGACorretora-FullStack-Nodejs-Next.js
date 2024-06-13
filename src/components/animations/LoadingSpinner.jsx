const LoadingSpinner = ({ isLoading }) => {
    return isLoading ? (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-10 z-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 h-24 w-24"></div>
      </div>
    ) : null;
  };
  
  export default LoadingSpinner;