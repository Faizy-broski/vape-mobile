"use client";

import { useState } from "react";
import { useActionState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "@/app/admin/login/actions";
import { initialLoginState } from "@/app/admin/login/login-state";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialLoginState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-6 flex flex-col gap-3"
    >
      <div className="relative">
        <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="h-12 rounded-xl border-border bg-card pr-11 pl-10 text-sm"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {state.error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
          />
        ) : (
          <LogIn className="size-4" />
        )}
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </motion.form>
  );
}
