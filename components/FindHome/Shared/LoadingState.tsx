'use client';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-slate-700/50 border-t-blue-500 animate-spin"></div>
        </div>
        <p className="text-center text-slate-400 text-sm">Finding your perfect neighborhood...</p>
      </div>
    </div>
  );
}
