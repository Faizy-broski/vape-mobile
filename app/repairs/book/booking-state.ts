export type BookingState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialBookingState: BookingState = {
  status: "idle",
  message: "",
};
