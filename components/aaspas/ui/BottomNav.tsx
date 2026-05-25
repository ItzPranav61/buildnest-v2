import { navItems, type NavId } from "../data";

export function BottomNav({ active = "home" }: { active?: NavId }) {
  return (
    <nav className="pointer-events-auto fixed inset-x-0 bottom-4 z-30 mx-auto h-[86px] w-[min(390px,calc(100vw-34px))] rounded-[34px] border border-black/5 bg-white/95 px-4 pb-2 pt-3 shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="grid h-full grid-cols-5 items-end">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const isPost = item.id === "post";

          return (
            <button
              key={item.id}
              className={`relative flex h-full flex-col items-center justify-end gap-1 text-[14px] font-medium ${
                isActive ? "text-[#07864f]" : "text-[#5c626b]"
              }`}
              type="button"
            >
              <span
                className={
                  isPost
                    ? "mb-1 grid size-[62px] translate-y-[-13px] place-items-center rounded-full bg-gradient-to-br from-[#0a8f54] to-[#00723e] text-white shadow-[0_14px_30px_rgba(0,118,65,0.34)]"
                    : "relative grid size-8 place-items-center"
                }
              >
                <Icon className={isPost ? "size-9" : "size-8"} strokeWidth={isActive ? 2.8 : 2.2} />
                {item.badge && (
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-[#ef372f] text-xs font-black text-white">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className={isPost ? "-mt-4" : ""}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
