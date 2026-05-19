import { Home, MapPin } from "lucide-react";

type BrandProps = {
  compact?: boolean;
};

export function LogoMark({ compact = false }: BrandProps) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-500 text-white shadow-lg shadow-emerald-900/20 ${
        compact ? "size-10" : "size-14"
      }`}
      aria-hidden="true"
    >
      <MapPin className={compact ? "size-8" : "size-11"} fill="currentColor" strokeWidth={1.6} />
      <Home className={`absolute text-white ${compact ? "size-4" : "size-5"}`} strokeWidth={2.8} />
      <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-amber-400 shadow-sm" />
      <span className="absolute -right-3 top-2 h-1.5 w-3 rounded-full bg-amber-400" />
      <span className="absolute right-0 -top-4 h-3 w-1.5 rounded-full bg-amber-400" />
    </div>
  );
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark compact={compact} />
      <span
        className={`font-black tracking-normal text-emerald-950 ${compact ? "text-3xl" : "text-4xl"}`}
      >
        Aaspas
      </span>
    </div>
  );
}
