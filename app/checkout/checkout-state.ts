/** A cart line whose price changed (`price` is the new one) or that can no longer be bought (`price: null`). */
export type CartUpdate = { id: string; price: string | null };

export type CheckoutState = {
  status: "idle" | "success" | "error";
  message: string;
  cartUpdates?: CartUpdate[];
};

export const initialCheckoutState: CheckoutState = {
  status: "idle",
  message: "",
};
