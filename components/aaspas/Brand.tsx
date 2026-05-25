import { Home } from "lucide-react";

type BrandProps = {
  compact?: boolean;
};

export function LogoMark({ compact = false }: BrandProps) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center text-white ${
        compact ? "size-[48px]" : "size-[96px]"
      }`}
      aria-hidden="true"
    >
      <div
        className={`absolute rounded-full border-[6px] border-[#00643e] ${
          compact ? "inset-[7px] border-[4px]" : "inset-[15px]"
        }`}
      />
      <div
        className={`absolute bottom-1 rounded-t-[999px] bg-gradient-to-br from-[#0c8f54] to-[#74bd54] ${
          compact ? "h-[25px] w-[32px]" : "h-[50px] w-[65px]"
        }`}
        style={{ clipPath: "polygon(50% 100%, 0 28%, 18% 10%, 50% 0, 82% 10%, 100% 28%)" }}
      />
      <div className={`absolute rounded-full bg-white ${compact ? "size-[25px]" : "size-[50px]"}`} />
      <Home className={`absolute text-[#00643e] ${compact ? "size-[17px]" : "size-[33px]"}`} strokeWidth={3} />
      <span className={`absolute rounded-full bg-[#f6b716] ${compact ? "right-[5px] top-0 size-1.5" : "right-[14px] top-1 size-2.5"}`} />
      <span className={`absolute rounded-full bg-[#f6b716] ${compact ? "right-0 top-[9px] h-1 w-2" : "right-1 top-[19px] h-1.5 w-4"}`} />
      <span className={`absolute rounded-full bg-[#f6b716] ${compact ? "right-[13px] -top-1 h-2 w-1" : "right-[29px] -top-1 h-3 w-1.5"}`} />
    </div>
  );
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark compact={compact} />
      <span className={`font-black tracking-normal text-[#005b38] ${compact ? "text-[32px]" : "text-[70px]"}`}>
        Aaspas
      </span>
    </div>
  );
}
