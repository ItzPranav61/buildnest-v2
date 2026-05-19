import { Building2, CloudSun, Home, MapPin, TrainFront, TreePine, Users } from "lucide-react";

export function NeighborhoodIllustration() {
  return (
    <div className="relative min-h-[285px] overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(180deg,#dff6ff_0%,#fff4d9_54%,#e5f8e9_100%)]">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/85 to-transparent" />
      <CloudSun className="absolute right-8 top-8 size-14 text-amber-400" strokeWidth={1.6} />
      <div className="absolute left-7 top-20 w-28 rounded-t-3xl border border-emerald-900/10 bg-white/80 p-3 shadow-lg">
        <div className="mb-2 rounded-md bg-emerald-800 px-2 py-1 text-center text-xs font-bold uppercase text-white">
          Local Love
        </div>
        <div className="h-20 rounded-xl bg-amber-100" />
      </div>
      <div className="absolute bottom-16 left-[38%] h-28 w-36 rounded-t-[2rem] border border-emerald-900/10 bg-white/70 shadow-md" />
      <div className="absolute bottom-20 right-12 h-32 w-32 rounded-t-[2rem] border border-emerald-900/10 bg-white/75 shadow-md" />
      <Building2 className="absolute bottom-24 left-[45%] size-16 text-slate-300" strokeWidth={1.3} />
      <TreePine className="absolute bottom-20 left-32 size-24 text-green-500" fill="#22c55e22" />
      <TreePine className="absolute bottom-20 right-40 size-20 text-green-600" fill="#16a34a22" />
      <Users className="absolute bottom-24 right-24 size-12 text-emerald-900" />
      <div className="absolute bottom-16 left-24 flex items-end gap-2">
        <span className="h-12 w-8 rounded-full bg-amber-500" />
        <span className="h-16 w-8 rounded-full bg-emerald-700" />
      </div>
      <div className="absolute bottom-10 left-0 right-0 mx-auto h-20 w-[78%] rounded-[100%] bg-white/55 blur-sm" />
    </div>
  );
}

export function BadlapurHeroArt() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.78)_38%,rgba(255,255,255,0.14)_100%)]" />
      <CloudSun className="absolute right-6 top-5 size-12 text-amber-400" strokeWidth={1.5} />
      <div className="absolute bottom-0 right-0 h-32 w-64 rounded-tl-[5rem] bg-emerald-100/80" />
      <TrainFront className="absolute bottom-10 right-14 size-24 text-red-500" strokeWidth={1.5} />
      <div className="absolute bottom-11 right-20 h-5 w-44 rounded bg-slate-200" />
      <TreePine className="absolute bottom-9 right-48 size-20 text-green-600" fill="#16a34a28" />
      <div className="absolute bottom-20 right-24 rounded-xl border-4 border-amber-700 bg-amber-300 px-4 py-2 text-center text-sm font-black text-amber-950 shadow-lg">
        <span className="block">BADLAPUR</span>
      </div>
      <Building2 className="absolute bottom-20 right-3 size-24 text-sky-500/50" strokeWidth={1.2} />
    </div>
  );
}

export function BadlapurMapArt() {
  return (
    <div className="relative min-h-[290px] overflow-hidden rounded-[1.6rem] border border-emerald-900/10 bg-[#f9fbf7]">
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(25deg,transparent_46%,#d8e5de_47%,#d8e5de_49%,transparent_50%),linear-gradient(115deg,transparent_46%,#d8e5de_47%,#d8e5de_49%,transparent_50%)] [background-size:64px_64px]" />
      <div className="absolute -right-5 top-0 h-full w-24 rotate-6 bg-sky-100" />
      <div className="absolute left-[47%] top-[16%] h-48 w-44 -translate-x-1/2 rotate-12 rounded-[35%_45%_38%_52%] border-2 border-emerald-700 bg-emerald-100/70 shadow-inner" />
      <MapPin className="absolute left-[51%] top-[38%] size-12 text-emerald-700" fill="currentColor" />
      <span className="absolute left-[43%] top-[56%] text-3xl font-black text-slate-900">Badlapur</span>
      <span className="absolute left-[37%] top-[25%] text-sm font-semibold text-slate-700">Kulgaon</span>
      <span className="absolute right-[18%] top-[31%] text-sm font-semibold text-slate-700">Rameshwadi</span>
      <span className="absolute right-[8%] top-[62%] text-sm font-semibold text-slate-700">Badlapur Gaon</span>
      <span className="absolute left-[45%] bottom-[13%] text-sm font-semibold text-slate-700">Kharvai Naka</span>
      <Home className="absolute right-6 top-5 size-8 rounded-lg bg-white p-1 text-emerald-700 shadow" />
    </div>
  );
}

export function SunsetStrip() {
  return (
    <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-b from-orange-300 via-amber-400 to-slate-800">
      <div className="absolute left-1/2 top-10 size-10 -translate-x-1/2 rounded-full bg-amber-50 shadow-[0_0_40px_rgba(255,244,214,0.9)]" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(160deg,#172554_0%,#1e293b_45%,#064e3b_100%)]" />
      <div className="absolute bottom-10 left-0 h-20 w-full bg-[linear-gradient(155deg,transparent_0%,transparent_42%,#334155_43%,#334155_52%,transparent_53%)] opacity-70" />
      <div className="absolute bottom-0 left-8 right-8 grid grid-cols-12 gap-1 opacity-80">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="rounded-t-sm bg-slate-200/80"
            style={{ height: `${10 + (index % 5) * 5}px` }}
          />
        ))}
      </div>
    </div>
  );
}
