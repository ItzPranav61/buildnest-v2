import { ChevronDown, ChevronRight, Globe2, KeyRound, Mail, Phone, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "../Brand";
import { MobileFrame } from "../ui/MobileFrame";

export function LoginScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <MobileFrame className="relative rounded-none bg-[#eaf8ec] md:rounded-[34px]">
      <section className="relative min-h-screen overflow-hidden rounded-[30px] bg-[#eaf8ec]">
        <div className="absolute inset-x-0 top-0 h-[390px] overflow-hidden rounded-b-[42px] bg-[linear-gradient(180deg,#bfe4f5_0%,#fff1c7_56%,#e8f7e9_100%)]">
          <LoginNeighborhood />
          <div className="absolute inset-x-0 bottom-0 h-[150px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.96)_78%,#fff_100%)]" />
        </div>

        <div className="relative z-10 flex justify-between gap-3 px-[18px] pt-6">
          <button className="flex h-[58px] items-center gap-2 rounded-[19px] bg-white/95 px-4 text-[19px] font-black shadow-[0_10px_28px_rgba(15,23,42,0.12)]" type="button">
            <Globe2 className="size-6" />
            English
            <ChevronDown className="size-5" />
          </button>
          <div className="flex h-[58px] items-center gap-2 rounded-[19px] bg-white/95 px-3 text-[16px] font-black shadow-[0_10px_28px_rgba(15,23,42,0.12)]">
            <ShieldCheck className="size-6 text-[#53ae6b]" fill="#53ae6b22" />
            Safe & Secure
          </div>
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center px-[26px] pb-6 pt-[280px]">
          <LogoMark />
          <h1 className="-mt-1 text-[66px] font-black leading-none tracking-[-0.04em] text-[#005b38]">Aaspas</h1>
          <p className="mt-5 text-center text-[20px] font-semibold tracking-[-0.02em]">
            Your Local. Your People. <span className="text-[#09834d]">Your Community.</span>
          </p>
          <div className="mb-5 mt-6 flex items-center gap-5 text-[#54b768]">
            <span className="h-px w-[78px] bg-[#dfe6e1]" />
            <span className="text-[26px] leading-none">♥</span>
            <span className="h-px w-[78px] bg-[#dfe6e1]" />
          </div>

          <div className="w-full rounded-[32px] border border-black/5 bg-white p-4 shadow-[0_20px_55px_rgba(0,88,50,0.14)]">
            <button
              className="flex h-[74px] w-full items-center gap-4 rounded-[20px] bg-gradient-to-r from-[#087c45] to-[#007f48] px-4 text-left text-white shadow-[0_14px_28px_rgba(0,107,61,0.25)]"
              type="button"
              onClick={onContinue}
            >
              <span className="grid size-[52px] shrink-0 place-items-center rounded-[15px] bg-white/92 text-[#07864f]">
                <Phone className="size-7" fill="currentColor" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block whitespace-nowrap text-[19px] font-black leading-tight">Continue with Mobile</span>
                <span className="mt-1 block truncate text-[14px] text-white/85">We&apos;ll send you a OTP to verify your number</span>
              </span>
              <ChevronRight className="size-9 shrink-0" />
            </button>

            <div className="mt-4 space-y-3">
              <AuthButton onClick={onContinue} icon={<span className="text-[30px] font-black text-[#4285f4]">G</span>} label="Continue with Google" />
              <AuthButton icon={<span className="grid size-8 place-items-center rounded-full bg-[#1877f2] text-[26px] font-black leading-none text-white">f</span>} label="Continue with Facebook" />
              <AuthButton icon={<span className="text-[31px] font-black text-black">●</span>} label="Continue with Apple" />
            </div>

            <div className="my-5 flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.18em] text-[#777b83]">
              <span className="h-px flex-1 bg-[#dfe3e5]" />
              Or continue with
              <span className="h-px flex-1 bg-[#dfe3e5]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex h-[58px] items-center justify-center gap-3 rounded-[17px] border border-[#e4e7e8] bg-white text-[19px] font-semibold" type="button">
                <Mail className="size-7 text-[#1f9457]" />
                Email
              </button>
              <button className="flex h-[58px] items-center justify-center gap-3 rounded-[17px] border border-[#e4e7e8] bg-white text-[19px] font-semibold" type="button">
                <KeyRound className="size-7 text-[#51ae62]" fill="#51ae62" />
                Password
              </button>
            </div>

            <p className="mt-5 text-center text-[15px] leading-7 text-[#52575f]">
              By continuing, you agree to our <span className="text-[#087c45]">Terms of Service</span>
              <br />
              and <span className="text-[#087c45]">Privacy Policy</span>
            </p>
          </div>
        </div>
      </section>
    </MobileFrame>
  );
}

function AuthButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      className="grid h-[56px] w-full grid-cols-[56px_1fr_56px] items-center rounded-[17px] border border-[#e4e7e8] bg-white px-2 text-[21px] font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
      type="button"
      onClick={onClick}
    >
      <span className="grid place-items-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function LoginNeighborhood() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-0 top-[122px] h-[95px] w-[105px] rounded-r-2xl bg-[#7c5134]" />
      <div className="absolute left-[20px] top-[112px] h-[34px] w-[104px] rotate-3 rounded bg-[#5c8b45] text-center text-[15px] font-black uppercase leading-[34px] text-white">
        Local Love
      </div>
      <div className="absolute right-[-6px] top-[85px] h-[132px] w-[112px] rounded-l-2xl bg-[#c68d6c]" />
      <div className="absolute left-[118px] top-[118px] h-[94px] w-[82px] rounded-t-3xl bg-[#f1d8b1]" />
      <div className="absolute right-[98px] top-[118px] h-[104px] w-[86px] rounded-t-3xl bg-[#f3d0a9]" />
      <div className="absolute left-[25px] bottom-[96px] h-[36px] w-[18px] rounded-full bg-[#f4d0b7]" />
      <div className="absolute left-[43px] bottom-[94px] h-[46px] w-[22px] rounded-full bg-[#246e4e]" />
      <div className="absolute right-[76px] bottom-[92px] h-[52px] w-[20px] rounded-full bg-[#f4c22f]" />
      <div className="absolute right-[52px] bottom-[92px] h-[48px] w-[20px] rounded-full bg-[#ddbea6]" />
      <div className="absolute bottom-[75px] left-0 right-0 h-[80px] rounded-[100%] bg-white/45 blur-md" />
    </div>
  );
}
