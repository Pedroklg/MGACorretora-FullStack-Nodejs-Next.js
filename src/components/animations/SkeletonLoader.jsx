const SkeletonLoader = () => {
  return (
      <div className="container mx-auto p-4 m-5">
          <div className="flex items-center mb-6">
              <h1 className="text-4xl font-bold text-red-700">Loading...</h1>
              <div className="flex-grow h-px bg-red-700 ml-4 p-0.5 rounded-md"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8).keys()].map((index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                      <div className="aspect-w-16 aspect-h-9">
                          <div className="bg-gray-300 h-48 w-full rounded-t-lg"></div>
                      </div>
                      <div className="p-6">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};

export default SkeletonLoader;
