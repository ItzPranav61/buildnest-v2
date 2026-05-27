import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

export type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

type ToastProps = {
  toast: ToastState;
  onClose: () => void;
};

export function Toast({ toast, onClose }: ToastProps) {
  if (!toast) {
    return null;
  }

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg ${
          isSuccess ? "border-cyan-200 text-cyan-900" : "border-red-200 text-red-800"
        }`}
      >
        <span className={`mt-0.5 ${isSuccess ? "text-cyan-700" : "text-red-600"}`}>
          {isSuccess ? <FiCheckCircle aria-hidden /> : <FiAlertCircle aria-hidden />}
        </span>
        <p className="flex-1 text-sm font-bold leading-5">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="grid size-6 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          aria-label="Dismiss notification"
        >
          <FiX aria-hidden />
        </button>
      </div>
    </div>
  );
}
