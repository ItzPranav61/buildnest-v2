import type { ReactNode } from "react";

export function MobileFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <main className="min-h-screen bg-[#edf5ef] text-[#101217]">
      <div
        className={`mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-white shadow-2xl shadow-emerald-950/10 md:my-5 md:min-h-[900px] md:rounded-[34px] ${className}`}
      >
        {children}
      </div>
    </main>
  );
}

export function PhoneStatus({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex h-11 items-center justify-between px-6 text-[15px] font-black ${light ? "text-white" : "text-black"}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <span className="flex items-end gap-0.5">
          <span className={`h-2.5 w-1 rounded-full ${light ? "bg-white" : "bg-black"}`} />
          <span className={`h-3.5 w-1 rounded-full ${light ? "bg-white" : "bg-black"}`} />
          <span className={`h-[18px] w-1 rounded-full ${light ? "bg-white" : "bg-black"}`} />
        </span>
        <span className={`h-3.5 w-4 rounded-sm border-2 ${light ? "border-white" : "border-black"}`} />
        <span className={`h-3.5 w-7 rounded-[4px] border-2 p-0.5 ${light ? "border-white" : "border-black"}`}>
          <span className={`block h-full w-[18px] rounded-[2px] ${light ? "bg-white" : "bg-black"}`} />
        </span>
      </span>
    </div>
  );
}
