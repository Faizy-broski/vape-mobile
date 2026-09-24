import { StoreCard } from "@/components/stores/store-card";
import { STORES } from "@/components/stores/stores-data";

export function StoresList() {
  return (
    <section className="wrap section-y">
      <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        01 — Locations
      </span>
      <h2 className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl sm:text-5xl">
        Pick a Counter
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 lg:grid-cols-2">
        {STORES.map((store, i) => (
          <StoreCard key={store.slug} store={store} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
