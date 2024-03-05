import { createContext } from "react";

export const CartContext = createContext({
  items: [],
  addItemToCard: undefined,
  updateCartItemQuantity: undefined,
});
