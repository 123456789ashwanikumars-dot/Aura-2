export default function Upgrade() {
  return (
    <div 
      className="w-full h-screen flex items-center justify-center 
                 bg-gradient-to-br from-gray-900 via-black to-gray-800 
                 text-white transition-all duration-500"
    >
      <div 
        className="p-10 rounded-2xl shadow-2xl 
                   bg-white/5 backdrop-blur-xl border border-white/10 
                   hover:scale-105 hover:shadow-purple-500/30 
                   transition-all duration-500"
      >
        <h1 className="text-3xl font-semibold bg-gradient-to-r 
                       from-purple-400 to-blue-400 bg-clip-text text-transparent
                       tracking-wide mb-3 transition-all">
          Upgrade Plan
        </h1>

        <p className="text-gray-300 mb-6 transition-all">
          Unlock all premium features and elevate your experience.
        </p>

        <button 
          className="px-6 py-3 rounded-xl text-lg font-medium 
                     bg-gradient-to-r from-purple-500 to-blue-500 
                     hover:from-purple-400 hover:to-blue-400 
                     active:scale-95 
                     shadow-lg hover:shadow-purple-500/40 
                     transition-all duration-300"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
