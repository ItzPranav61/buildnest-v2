export function HomeHeroArt() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_38%,rgba(255,255,255,0.22)_68%,rgba(255,255,255,0)_100%)]" />
      <div className="absolute inset-y-0 right-0 w-[62%] bg-[linear-gradient(180deg,#cfecf7_0%,#f7f6e8_50%,#dcefd7_100%)]" />
      <div className="absolute right-[5px] top-[22px] h-[92px] w-[70px] rounded-t-xl bg-[#b4d4e3] opacity-80" />
      <div className="absolute right-[78px] top-[58px] h-[62px] w-[54px] rounded-t-lg bg-[#efbe79]" />
      <div className="absolute bottom-[38px] right-[4px] h-[42px] w-[166px] rounded-full bg-[#e8f2f4]" />
      <div className="absolute bottom-[45px] right-[16px] h-[24px] w-[126px] rounded-[18px] bg-[#dfe7ea] shadow-sm" />
      <div className="absolute bottom-[48px] right-[23px] h-[18px] w-[42px] rounded-r-full bg-[#e64735]" />
      <div className="absolute bottom-[50px] right-[70px] h-[14px] w-[77px] rounded bg-white" />
      <div className="absolute bottom-[70px] right-[156px] rounded-md border-[3px] border-[#bd7b21] bg-[#efb73d] px-3 py-1 text-center text-[12px] font-black leading-[14px] text-[#74410c] shadow-lg">
        <span className="block">बदलापुर</span>
        <span className="block">BADLAPUR</span>
      </div>
      <div className="absolute bottom-[44px] right-[213px] h-[52px] w-[28px] rounded-full bg-[#78ad54]" />
      <div className="absolute bottom-[34px] right-[245px] h-[36px] w-[112px] rounded-full bg-[#77b75e]/40 blur-sm" />
      <div className="absolute left-[260px] top-[38px] h-2 w-7 rounded-full bg-white/80" />
      <div className="absolute left-[292px] top-[34px] h-2 w-10 rounded-full bg-white/80" />
    </div>
  );
}

export function SunsetPhoto() {
  return (
    <div className="relative h-[180px] overflow-hidden rounded-[12px] bg-[linear-gradient(180deg,#f6a34c_0%,#e58b3f_34%,#4d5c61_66%,#0f2f28_100%)]">
      <div className="absolute left-1/2 top-[46px] size-8 -translate-x-1/2 rounded-full bg-[#fff6ce] shadow-[0_0_42px_rgba(255,238,169,0.9)]" />
      <div className="absolute inset-x-0 top-[74px] h-[44px] bg-[linear-gradient(165deg,transparent_0%,transparent_25%,#6a6463_27%,#746d6c_36%,transparent_37%),linear-gradient(18deg,transparent_0%,transparent_46%,#596361_47%,#4e5856_58%,transparent_59%)] opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 h-[74px] bg-[#1b3d35]" />
      <div className="absolute bottom-0 left-6 right-6 grid grid-cols-12 gap-1 opacity-80">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="rounded-t-sm bg-[#d9d2c5]"
            style={{ height: `${10 + (index % 6) * 5}px` }}
          />
        ))}
      </div>
    </div>
  );
}
