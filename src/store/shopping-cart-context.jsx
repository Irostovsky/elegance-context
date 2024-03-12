import { DUMMY_PRODUCTS } from "../dummy-products.js";
import { createContext, useReducer } from "react";

export const CartContext = createContext({
  items: [],
  addItemToCard: undefined,
  updateCartItemQuantity: undefined,
});

const addCardItem = (updatedItems, id) => {
  const existingCartItemIndex = updatedItems.findIndex(
    (cartItem) => cartItem.id === id
  );
  const existingCartItem = updatedItems[existingCartItemIndex];

  if (existingCartItem) {
    const updatedItem = {
      ...existingCartItem,
      quantity: existingCartItem.quantity + 1,
    };
    updatedItems[existingCartItemIndex] = updatedItem;
  } else {
    const product = DUMMY_PRODUCTS.find((product) => product.id === id);
    updatedItems.push({
      id: id,
      name: product.title,
      price: product.price,
      quantity: 1,
    });
  }
  return updatedItems;
};

const updateCartItemQuantity = (updatedItems, productId, amount) => {
  const updatedItemIndex = updatedItems.findIndex(
    (item) => item.id === productId
  );

  const updatedItem = {
    ...updatedItems[updatedItemIndex],
  };

  updatedItem.quantity += amount;

  if (updatedItem.quantity <= 0) {
    updatedItems.splice(updatedItemIndex, 1);
  } else {
    updatedItems[updatedItemIndex] = updatedItem;
  }

  return updatedItems;
};

const shoppingCartReducer = (state, action) => {
  let updatedItems = [...state.items];

  if (action.type === "ADD_ITEM") {
    const { id } = action.payload;
    updatedItems = addCardItem(updatedItems, id);
  }
  if (action.type === "UPDATE_ITEM") {
    const { productId, amount } = action.payload;
    updatedItems = updateCartItemQuantity(updatedItems, productId, amount);
  }
  return {
    items: updatedItems,
  };
};

const CartContextProvider = ({ children }) => {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    { items: [] }
  );

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCard: (id) => {
      shoppingCartDispatch({ type: "ADD_ITEM", payload: { id } });
    },
    updateCartItemQuantity: (productId, amount) => {
      shoppingCartDispatch({
        type: "UPDATE_ITEM",
        payload: {
          productId,
          amount,
        },
      });
    },
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
