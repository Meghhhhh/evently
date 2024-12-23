// features/cart/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], 
  packagesState: [],  
};

// Create cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addItemToCart: (state, action) => {
        const newItem = action.payload;
        console.log("payload", action.payload);
        const existingItemIndex = state.items.findIndex(i => i._id === newItem._id);
        
        if (existingItemIndex !== -1) {
        
          state.items[existingItemIndex] = {
            ...state.items[existingItemIndex],
            quantity: newItem.quantity, 
          };
        } else {
          // Item does not exist, add it to the cart
          state.items.push(newItem);
        }
       
      },
 
    removeItemFromCart: (state, action) => {
        const newItem = action.payload;
        console.log("payload", action.payload);
        const existingItemIndex = state.items.findIndex(i => i._id === newItem._id);
        if (existingItemIndex !== -1) {
        
            state.items[existingItemIndex] = {
              ...state.items[existingItemIndex],
              quantity: newItem.quantity, 
            };
          } 
          if(state.items[existingItemIndex].quantity === 0)
{
      state.items = state.items.filter(i => i._id !== newItem._id);}
      
    },
   
    addPackageToCart: (state, action) => {
        const newPackage = action.payload;
        console.log("payload of package add", action.payload);
        const existingPackageIndex = state.packagesState.findIndex(p => p._id === newPackage._id);
        
        if (existingPackageIndex !== -1) {
          // Update quantity of existing package
          state.packagesState[existingPackageIndex] = {
            ...state.packagesState[existingPackageIndex],
            quantity:  newPackage.quantity,
          };
        } else {
          // Package does not exist, add it to the cart
          state.packagesState.push(newPackage);
        }
        const amount = state.packagesState.reduce((total, pkg) => total + (pkg.price * pkg.quantity), 0);
        console.log("Total Package Amount:", amount);
        console.log("gd")
      },
  
      removePackageFromCart: (state, action) => {
        const newPackage = action.payload;
        console.log("payload of package", action.payload);
        const existingPackageIndex = state.packagesState.findIndex(p => p._id === newPackage._id);
        
        if (existingPackageIndex !== -1) {
          // Update quantity of existing package
          state.packagesState[existingPackageIndex] = {
            ...state.packagesState[existingPackageIndex],
            quantity:  newPackage.quantity,
          };
  
          // Remove package if quantity is zero or less
          if (state.packagesState[existingPackageIndex].quantity <= 0) {
            state.packagesState = state.packagesState.filter(p => p._id !== newPackage._id);
          }
        }
      },
      getPackageNames: (state) => {
        return state.packagesState.map(pkg => pkg.packageName);  
      },  
    clearCart: (state) => {
      state.items = [];
      state.packagesState = [];
    },
  },
  
});

export const {
  addItemToCart,
  removeItemFromCart,
  addPackageToCart,
  removePackageFromCart,
  clearCart,getPackageNames
} = cartSlice.actions;

export const selectTotalItemAmount = (state) => {
    return state.cart.items.reduce((total, item) => total + (item.itemPrice * item.quantity * item.itemQuantity), 0);
  };
  
  export const selectTotalPackageAmount = (state) => {
    return state.cart.packagesState.reduce((total, pkg) => total + (pkg.price * pkg.quantity), 0);
  };
  
  export const selectGrandTotal = (state) => {
    const totalItems = selectTotalItemAmount(state);
    const totalPackages = selectTotalPackageAmount(state);
    return totalItems + totalPackages;
  };

export default cartSlice.reducer;
