export default function Loading() {
  return (
    <div className="flex min-h-[100svh] flex-1 flex-col items-center justify-center gap-5 bg-background">
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-primary/15 border-t-primary" />
        <span className="font-heading text-[11px] font-bold tracking-tight text-primary">
          V&M
        </span>
      </div>
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Loading
      </p>
    </div>
  );
}
