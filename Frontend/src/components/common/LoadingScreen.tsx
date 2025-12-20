export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-[999]">
      <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Waking up Server
        </h2>
        <p className="text-slate-500 text-sm text-center max-w-[250px] leading-relaxed">
          The backend is starting up on Render. This usually takes some time
        </p>

        <div className="mt-6 flex gap-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
