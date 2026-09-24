"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "@/app/admin/(dashboard)/products/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${name}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Delete ${name}`}
        className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}
