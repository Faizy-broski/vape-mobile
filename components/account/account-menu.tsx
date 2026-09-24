"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, ShieldCheck, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAdmin } from "@/app/admin/login/actions";

export function AccountMenu() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setLoggedIn(Boolean(data.loggedIn));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loggedIn) {
    return (
      <Link
        href="/admin/login"
        aria-label="Admin login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "hidden sm:inline-flex",
        )}
      >
        <User className="size-4.5" />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Admin account"
          />
        }
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShieldCheck className="size-3.5" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <p className="text-sm font-semibold">Admin</p>
          <p className="text-xs font-normal text-muted-foreground">Signed in</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/admin" />}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => startTransition(() => logoutAdmin())}
          variant="destructive"
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
