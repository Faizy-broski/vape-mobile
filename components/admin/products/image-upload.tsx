"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadProductImageAction } from "@/app/admin/(dashboard)/products/actions";

export function ImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadProductImageAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        onUploaded(result.url);
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleChange}
        disabled={pending}
        className="hidden"
        id="image-upload-input"
      />
      <label
        htmlFor="image-upload-input"
        className="inline-flex h-10 w-fit cursor-pointer items-center gap-1.5 rounded-full border border-input px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted has-disabled:pointer-events-none has-disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {pending ? "Uploading…" : "Upload image"}
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
