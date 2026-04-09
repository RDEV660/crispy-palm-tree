"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

type Props = {
  label: string;
  clearLabel: string;
  className?: string;
  onChange: (pngDataUrl: string | null) => void;
};

export function SignaturePadField({ label, clearLabel, className, onChange }: Props) {
  const ref = useRef<SignatureCanvas>(null);

  const sync = () => {
    const canvas = ref.current;
    if (!canvas || canvas.isEmpty()) {
      onChange(null);
      return;
    }
    onChange(canvas.toDataURL("image/png"));
  };

  return (
    <div className={className}>
      <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{label}</div>
      <div className="mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
        <SignatureCanvas
          ref={ref}
          penColor="#18181b"
          canvasProps={{
            className: "h-36 w-full touch-none",
          }}
          onEnd={sync}
        />
      </div>
      <button
        type="button"
        className="mt-2 text-sm font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
        onClick={() => {
          ref.current?.clear();
          onChange(null);
        }}
      >
        {clearLabel}
      </button>
    </div>
  );
}
