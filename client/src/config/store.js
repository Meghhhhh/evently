import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";

import vendorReducer from "../features/vendorSlice";
import venueReducer from "../features/venue/venueSlice.js"
import cartReducer from "../features/cartSlice.js"
import cityReducer from "../features/city/citySlice.js";
import dateReducer from "../features/date/dateSlice.js"


export const store = configureStore({
  reducer: {
    user: userReducer,

    vendor: vendorReducer,

    venue: venueReducer,
    cart:cartReducer,
    city:cityReducer,
    date: dateReducer
  },
});
