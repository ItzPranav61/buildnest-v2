import { Bell, ChevronDown, MapPin, Menu } from "lucide-react";
import { Brand } from "../Brand";

export function AppHeader() {
  return (
    <header className="px-[18px] pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="grid size-10 place-items-center text-black" type="button" aria-label="Open menu">
            <Menu className="size-8" strokeWidth={2.1} />
          </button>
          <Brand compact />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative grid size-9 place-items-center" type="button" aria-label="Notifications">
            <Bell className="size-7 text-black" strokeWidth={2.1} />
            <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-[#e8342f] text-xs font-black text-white">
              3
            </span>
          </button>
          <div className="size-[48px] overflow-hidden rounded-full border border-white bg-gradient-to-br from-[#d8e9dc] to-[#69977b] shadow-sm">
            <div className="mx-auto mt-2 size-8 rounded-full bg-[#1f6d52]" />
            <div className="mx-auto mt-0 h-8 w-11 rounded-t-full bg-[#f4cba7]" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 size-8 text-[#07864f]" fill="currentColor" strokeWidth={1.8} />
          <div>
            <button className="flex items-center gap-2 text-[28px] font-black leading-none tracking-[-0.02em]" type="button">
              Badlapur <ChevronDown className="mt-1 size-5" />
            </button>
            <p className="mt-2 text-[17px] leading-none text-[#6b6e79]">Thane, Maharashtra</p>
          </div>
        </div>
        <div className="shrink-0 pt-1 text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-[22px]">🌤️</span>
            <span className="text-[24px] font-black tracking-[-0.02em]">29°C</span>
          </div>
          <p className="mt-1 text-[15px] text-[#777982]">Partly Cloudy</p>
        </div>
      </div>
    </header>
  );
}
