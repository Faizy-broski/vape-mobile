export type CheckoutState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCheckoutState: CheckoutState = {
  status: "idle",
  message: "",
};
