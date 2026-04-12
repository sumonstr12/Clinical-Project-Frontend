export default function CardLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 bg-slate-700 rounded-xl w-48" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-4 space-y-3">
            <div className="h-4 bg-slate-700 rounded w-24" />
            <div className="h-8 bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>

      {/* <div className="bg-slate-800 rounded-xl p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-slate-700 rounded w-1/4" />
            <div className="h-4 bg-slate-700 rounded w-1/3" />
            <div className="h-4 bg-slate-700 rounded w-1/5" />
          </div>
        ))}
      </div> */}
    </div>
  );
}