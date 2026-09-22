import { Headset, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Next Day UK Delivery",
    subtitle: "Order before 3pm",
  },
  {
    icon: Headset,
    title: "Live Support",
    subtitle: "Talk to the team while you shop",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "All major cards accepted",
  },
];

export function TrustStrip() {
  return (
    <section className="">
      <div className="wrap grid grid-cols-1 gap-6 py-8 sm:grid-cols-3 sm:gap-8 sm:py-10">
        {ITEMS.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
